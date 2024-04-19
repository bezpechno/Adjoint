# db.py
from pymongo import MongoClient

client = None

def init_db():
    global client
    try:
        client = MongoClient('mongodb+srv://nirotteveel:1234@testcluster.bqd7i1u.mongodb.net/?retryWrites=true&w=majority&appName=TestCluster')
        print("Successfully connected to the database.")
    except Exception as e:
        print("Failed to connect to the database.")
        print(e)

def get_db():
    return client['db']