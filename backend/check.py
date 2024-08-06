import sqlite3

database_path = './chat_logs.db'

def check_table_structure():
    try:
        conn = sqlite3.connect(database_path)
        cursor = conn.cursor()
        cursor.execute("PRAGMA table_info(chat_logs);")
        columns = cursor.fetchall()
        for column in columns:
            print(column)
        conn.close()
    except sqlite3.Error as e:
        print(f"SQLite error: {e}")

check_table_structure()
