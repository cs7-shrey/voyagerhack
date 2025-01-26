from .tools.get_hotel_info import GetHotelInfo, get_hotel_info
from .tools.get_distance import GetDistance, get_distance
from .tools.search_api import SearchAPI, search_api
from .tools.main import SYSTEM_PROMPT
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, ToolMessage
from langchain_google_genai import ChatGoogleGenerativeAI
import json
import os

load_dotenv()
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash-exp", api_key=os.getenv('GOOGLE_API_KEY'))
llm_with_tools = llm.bind_tools([GetHotelInfo, GetDistance, SearchAPI])


class HotelInfoBot:
    def __init__(self, hotel_name, location, hotel_info):
        self.system_prompt = SYSTEM_PROMPT
        self.hotel_name = hotel_name
        self.location_name = location
        self.class_to_fn_mapping = {
            "GetHotelInfo": self.get_hotel_info,
            "GetDistance": get_distance,
            "SearchAPI": search_api
        }
        self.hotel_info = hotel_info
        
    async def get_hotel_info(self):
        return self.hotel_info
    
    async def talk(self, prompt):
        human_message = f"""
            SYSTEM GENERATED DETAILS: 
            Hotel Name: {self.hotel_name}
            Location: {self.location_name}
            
            USER PROMPT: {prompt}
        """
        messages = [
            SystemMessage(self.system_prompt),
            HumanMessage(human_message)
        ]
        ai_msg = await llm_with_tools.ainvoke(messages)
        if not ai_msg.tool_calls:
            return ai_msg
        
        messages.append(ai_msg)

        for tool_call in ai_msg.tool_calls:
            selected_tool = self.class_to_fn_mapping[tool_call['name']]
            tool_output = await selected_tool(**tool_call['args'])
            messages.append(ToolMessage(content=json.dumps(tool_output), name=tool_call['name'], tool_call_id=tool_call['id']))
            
        final_message = await llm_with_tools.ainvoke(messages)
        return final_message