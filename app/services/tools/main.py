# option 1 -> I make all the tool declarations here and use them in the HotelInfoBot 
# option 2 -> 

from .utils import mapping
import google.generativeai as genai
from google.ai.generativelanguage_v1beta.types import content
from pydantic import BaseModel  
from typing import Type

SYSTEM_PROMPT = "You are a hotel booking agent. your job is to inform the user about information related to hotel. for hotel information, get it using get_hotel_info, to get how far is the hotel from xyz, use the get_distance function. to search about the nearby region of the hotel, use the search_api."

class Tool(BaseModel):
    __fname__ : str
    __description__ : str

def toolify(ToolDeclaration: Type[Tool]):
    name = ToolDeclaration.__fname__
    description = ToolDeclaration.__description__
    print(name)
    
    if not ToolDeclaration.model_fields: 
        return genai.protos.FunctionDeclaration(
            name=name,
            description=description
        )

    required = []
    properties = {}
    for field in ToolDeclaration.model_fields.keys():
        if ToolDeclaration.model_fields[field].is_required():
            required.append(field)
        properties[field] = content.Schema(
            type = mapping[ToolDeclaration.model_fields[field].annotation],     # won't work with dict/object types
        )
    return genai.protos.FunctionDeclaration(
        name = name,
        description = description,
        parameters = content.Schema(
            type = content.Type.OBJECT,
            enum = [],
            required = required,
            properties = properties
        )
    )