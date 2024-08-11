# FastAPI Chat Application with Groq

A FastAPI-based chat application integrated with Groq to provide AI-driven responses and handle function calls. This application demonstrates how to set up a FastAPI service, connect to Groq, manage chat history, and process function calls in responses.

## [Video Preview](https://drive.google.com/file/d/1OWkfnh3bdsyPkbcUQBfz7JHQEb2k8cyc/view?usp=sharing)

## Features

- Interact with Groq's language model to generate responses.
- Maintain chat history with user inputs and model responses.
- Handle and return function calls from the model.
- CORS configuration to allow frontend communication.
- SQLite database integration to log chat messages and responses.

## Requirements

- Python 3.8+
- FastAPI
- Groq
- python-dotenv
- SQLite (for database)

## Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/anishshetty6/chat_app-fastAPI-groq.git
    ```

2. Navigate into the project directory:

    ```bash
    cd fastapi-chat-app
    ```

3. Create a virtual environment and activate it:

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

4. Install the required dependencies:

    ```bash
    pip install -r requirements.txt
    ```

## Configuration

1. Create a `.env` file in the root directory of the project with the following content:

    ```env
    GROQ_API_KEY=your_groq_api_key
    ```

2. Ensure you have the necessary database setup in `database.py`. Update `init_db`, `SessionLocal`, and `ChatLog` according to your database schema.

## Usage

1. Start the FastAPI server:

    ```bash
    uvicorn main:app --reload
    ```

2. Open your browser and navigate to `http://localhost:8000/docs` to access the Swagger UI for testing the API endpoints.

3. Start the Frontend with Reactjs:

    ```bash
    npm run dev
    ```

## Endpoints

### POST /message

- **Description**: Receives a user message, generates a response from Groq, logs the interaction in the database, and returns the response .

- **Request Body**:

    ```json
    {
      "message": "Your message here"
    }
    ```

- **Response**:

    ```json
    {
      "message": "Your message here",
      "response": "Model's response here",
    }
    ```

## Database Schema

- **ChatLog**: Logs chat interactions.

    | Column     | Type    | Description                |
    |------------|---------|----------------------------|
    | id         | Integer | Primary Key, Auto-increment|
    | message    | Text    | User's message             |
    | response   | Text    | Model's response           |
    | timestamp  | DateTime| Timestamp of the interaction|

## Running the Application

1. Ensure you have the `.env` file configured with the appropriate API key.
2. Run the server using the command provided in the [Usage](#usage) section.
3. Test the API using the Swagger UI or any HTTP client like Postman.


