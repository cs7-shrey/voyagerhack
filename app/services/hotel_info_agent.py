from .tools.get_hotel_info import GetHotelInfo, get_hotel_info
from .tools.get_distance import GetDistance, get_distance
from .tools.search_api import SearchAPI, search_api
from .tools.nearby_places import NearbyPlaces, get_nearby_places
from .tools.main import SYSTEM_PROMPT
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, ToolMessage
from langchain_google_genai import ChatGoogleGenerativeAI
import json
import os
import copy

load_dotenv()
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash-exp", api_key=os.getenv('GOOGLE_API_KEY'))
llm_with_tools = llm.bind_tools([GetHotelInfo, GetDistance, SearchAPI])


class HotelChatAgent:
    def __init__(self, hotel_name, location, hotel_info):
        self.system_prompt = f"""
            {SYSTEM_PROMPT}
            SYSTEM GENERATED DETAILS: 
                Hotel Name: {hotel_name}
                Location: {location}
        """
        self.hotel_name = hotel_name
        self.location_name = location
        self.class_to_fn_mapping = {
            "GetHotelInfo": self.get_hotel_info,
            "GetDistance": get_distance,
            "SearchAPI": search_api,
            "NearbyPlaces": get_nearby_places
        }
        self.hotel_info = hotel_info
        self.messages = [
            SystemMessage(self.system_prompt)
        ]
        
    async def get_hotel_info(self):
        return self.hotel_info
    
    async def talk(self, prompt):
        self.messages.append(HumanMessage(prompt))
        context_messages = copy.deepcopy(self.messages)            # context messages will contain toll calls
        ai_msg = await llm_with_tools.ainvoke(context_messages)
        if not ai_msg.tool_calls:
            self.messages.append(AIMessage(ai_msg.content))
            return ai_msg.content
        
        context_messages.append(ai_msg)
        
        count = 0
        while ai_msg.tool_calls:
            print('calling tools')
            if count > 4:
                break
                # set a manual message here
            for tool_call in ai_msg.tool_calls:
                selected_tool = self.class_to_fn_mapping[tool_call['name']]
                tool_output = await selected_tool(**tool_call['args'])
                context_messages.append(ToolMessage(content=json.dumps(tool_output), name=tool_call['name'], tool_call_id=tool_call['id']))
            ai_msg = await llm_with_tools.ainvoke(context_messages)
            context_messages.append(ai_msg)
            

            # selected_tool = self.class_to_fn_mapping[tool_call['name']]
            # tool_output = await selected_tool(**tool_call['args'])
            # context_messages.append(ToolMessage(content=json.dumps(tool_output), name=tool_call['name'], tool_call_id=tool_call['id']))
            
        # final_message = await llm_with_tools.ainvoke(context_messages)
        self.messages.append(AIMessage(ai_msg.content))
        return ai_msg.content