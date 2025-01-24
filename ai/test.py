import asyncio
import httpx
import os
from dotenv import load_dotenv
import time
load_dotenv()

async def fetch_data(url):
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json={
            "query": "Fun things to do in Gurgaon",
            "api_key": os.getenv("TAVILY_API_KEY"),
            "include_answer": "basic"
        })
        return response
    
async def main():
    url = "https://api.tavily.com/search"
    t1 = time.time()
    data = await fetch_data(url)
    t2 = time.time()
    print(data.json()['answer'])
    print('took', t2-t1, 'seconds')

asyncio.run(main())