from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
import os
from .tools.get_hotel_info import GetHotelInfo, get_hotel_info
from .tools.get_distance import GetDistance, get_distance
from .tools.search_api import SearchAPI, search_api
from .tools.main import SYSTEM_PROMPT

load_dotenv()
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash-exp", api_key=os.getenv('GOOGLE_API_KEY'))
llm_with_tools = llm.bind_tools([GetHotelInfo, GetDistance, SearchAPI])

class_to_fn_mapping = {
    "GetHotelInfo": get_hotel_info,
    "GetDistance": get_distance,
    "SearchAPI": search_api
}

class HotelInfoBot:
    def __init__(self):
        self.llm = ...
        self.system_prompt = SYSTEM_PROMPT
    
    async def invoke(self, prompt):
        messages = [
            ("system", self.system_prompt),
            ("human", prompt)
        ]
        await llm_with_tools.ainvoke()