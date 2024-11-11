import certifi
from pymongo import MongoClient
from app.config import MONGO_URI

client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
db = client["AlphaBrain"]