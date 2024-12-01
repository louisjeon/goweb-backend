import pandas as pd
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import chardet

load_dotenv()

db_user = os.getenv('DB_USERNAME')
db_pw = os.getenv('DB_PW')
print(db_user, db_pw)
uri = f'mongodb+srv://hjs123:qwer1234@cluster0.ymcer3e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
client = MongoClient(uri)
db = client["test"]  # 데이터베이스 이름
collection = db["map"]  # 컬렉션 이름

df = pd.read_csv('./load/mergeData.csv')
grouped_data = df.groupby("자전거길 이름").apply(
    lambda x: {
        "title": x.name,
        "coordinates": [{"x": row["위도(LINE_XP)"], "y": row["경도(LINE_YP)"]} for _, row in x.iterrows()]
    }
).tolist()
# MongoDB에 삽입

collection.insert_many(grouped_data)

print("데이터가 MongoDB에 성공적으로 삽입되었습니다!")