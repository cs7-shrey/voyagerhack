import asyncio
import httpx

async def fetch_data(url):
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        return response
    
async def main():
    url = "https://jsonplaceholder.typicode.com/posts"
    data = await fetch_data(url)
    print(data.json())

asyncio.run(main())