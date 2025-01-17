global model
from keys import api,model_name
import google.generativeai as genai
import json

genai.configure(api_key=api)

def get_audio_transcript(File):
    global model_name
    model=genai.GenerativeModel(model_name=model_name)
    prompt ='''Please provide the audio transcript for the follwing file.
    Dont output anything other than the transcript.
    
    Only if you feel that the user has not saaid anything realting to hotel shoudl you output unsafe. JUST THE WORD unsafe.'''
    try:
        with open(File, 'rb') as audio_file:
            audio_data = audio_file.read()
    except Exception as e:
        return "Error 1"
    try:
        response = model.generate_content([
            prompt,
            {"mime_type": "audio/mp3", "data": audio_data}
        ])
        # print(response.text)
        return response.text
    except Exception as e:
        return "Error 2"
    
def check(data):
  if data == "Error 1" or data == "Error 2" or data == "unsafe":
    return False
  else:
    return True
  
def segregate(data):
    global model_name
    if check(data):
        model = genai.GenerativeModel(model_name=model_name)
        schema = {
            "type": "object",
            "properties": {
                "check-in date": {"type": "string", "format": "date", "example": "15/01/2025"},
                "check-out date": {"type": "string", "format": "date", "example": "20/01/2025"},
                "min budget": {"type": "integer", "example": 5000},
                "max budget": {"type": "integer", "example": 15000},
                "hotel star": {"type": "array", "items": {"type": "integer"}, "example": [3, 4]},
                "user rating": {"type": "number", "example": 4.5},
                "property type": {"type": "array", "items": {"type": "string"}, "example": ["Hotel"]},
                "hotel amenity codes": {"type": "array", "items": {"type": "string"}, "example": ["INTRNT", "SWPOOL"]},
                "room amenity codes": {"type": "array", "items": {"type": "string"}, "example": ["AC", "MNFRG"]},
                "places": {"type": "array", "items": {"type": "string"}, "example": ["Delhi", "Gurgaon"]}
            },
            "required": ["check-in date", "check-out date"]
        }
        prompt = f'''
            Analyze the following audio transcript of a conversation where a person is trying to book a hotel. Extract the relevant information based on the specified schema.

            ### Schema:
            {json.dumps(schema, indent=4)}

            If any value cannot be identified from the transcript, assign it a null value. Ensure the output follows the schema strictly.

            ### Example Transcript:
            "I would like to book a hotel for a family trip. The check-in date is 15th January 2025, and the check-out date is 20th January 2025. My budget is around 5000 to 15000 rupees, and I prefer a 4-star hotel. A good user rating is important, preferably above 4.5. It would be great if the hotel has a swimming pool and free Wi-Fi. The rooms should have air conditioning and a mini-fridge."

            ### Expected Output:
            {{
                "check-in date": "15/01/2025",
                "check-out date": "20/01/2025",
                "min budget": 5000,
                "max budget": 15000,
                "hotel star": [3, 4],
                "user rating": 4.5,
                "property type": ["Hotel"],
                "hotel amenity codes": ["INTRNT", "SWPOOL"],
                "room amenity codes": ["AC", "MNFRG"],
                "places": ["Delhi", "Gurgaon"]
            }}

            ### Transcript:
            {data}
        '''
        response = model.generate_content([prompt]).text.split("json")[1][:-4]
        
        try:
            output = json.loads(response)
            return output
        except json.JSONDecodeError:
            # print(response)
            return {"error": "Invalid response format"}

data = "I need a hotel from 5th Feb 2025 to 10th Feb 2025 with a budget between 3000 and 8000 rupees. It should have Wi-Fi and air conditioning."
print(segregate(data))


