from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from contextlib import asynccontextmanager
from database import init_db, SessionLocal, ChatLog
import aiohttp
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from dotenv import load_dotenv
import os
import json
import asyncio

# Load environment variables from .env file
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(lifespan=lifespan)

# Initialize the Groq client
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY)

# Set the system prompt
system_prompt = {
    "role": "system",
    "content": "You are a helpful assistant.Answer the user's queries. Give accurate and to the point information."
}

# Initialize chat history
chat_history = [system_prompt]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Adjust this to match your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Example endpoint
async def fetch_from_tool(endpoint: str, params: dict):
    async with aiohttp.ClientSession() as session:
        async with session.get(endpoint, params=params) as response:
            return await response.json()

async def get_llm_response(message: str):
    # Update chat history with user input
    chat_history.append({"role": "user", "content": message})
    
    # Generate response from Groq
    response = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=chat_history,
        max_tokens=400,
        temperature=1.2
    )
    
    # Extract the response content
    response_content = response.choices[0].message.content
    
    # Update chat history with assistant's response
    chat_history.append({
        "role": "assistant",
        "content": response_content
    })
    
    return response_content

async def get_llm_stream_response(message: str, websocket: WebSocket):
    # Update chat history with user input
    chat_history.append({"role": "user", "content": message})
    
    # Generate streaming response from Groq
    stream = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=chat_history,
        max_tokens=400,
        temperature=1.2,
        stream=True
    )
    
    full_response = ""
    
    # Stream the response
    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            content = chunk.choices[0].delta.content
            full_response += content
            
            # Send the chunk to the client
            await websocket.send_text(json.dumps({
                "type": "chunk",
                "content": content
            }))
    
    # Update chat history with assistant's complete response
    chat_history.append({
        "role": "assistant",
        "content": full_response
    })
    
    # Send completion signal
    await websocket.send_text(json.dumps({
        "type": "complete",
        "content": full_response
    }))
    
    return full_response

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            message = message_data.get("message", "")
            
            print(f"Received message via WebSocket: {message}")
            
            # Send acknowledgment
            await websocket.send_text(json.dumps({
                "type": "ack",
                "message": "Processing your message..."
            }))
            
            # Get streaming response
            response_content = await get_llm_stream_response(message, websocket)
            
            # Save to database
            db = SessionLocal()
            try:
                chat_log = ChatLog(message=message, response=response_content)
                db.add(chat_log)
                db.commit()
            except Exception as e:
                print(f"Database error: {e}")
            finally:
                db.close()
                
    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"WebSocket error: {e}")
        await websocket.send_text(json.dumps({
            "type": "error",
            "content": str(e)
        }))

@app.post("/message")
async def post_message(request: Request):
    data = await request.json()
    message = data.get("message")
    
    # Print received message
    print(f"Received message: {message}")
    
    # Fetch LLM response
    response_content = await get_llm_response(message)
    
    # Print response from LLM
    print(f"Response from LLM: {response_content}")
    
    # Save to SQLite
    db = SessionLocal()
    chat_log = ChatLog(message=message, response=response_content)
    db.add(chat_log)
    db.commit()
    db.close()
    
    # Return response to client
    return {"message": message, "response": response_content}
