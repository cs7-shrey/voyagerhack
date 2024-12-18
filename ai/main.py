global model
from keys import api,model_name
import google.generativeai as genai

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
  
def seggregate(data):
    global model_name
    if check(data):
        model=genai.GenerativeModel(model_name=model_name)
        prompt ='''
        Analyze the following audio transcript of a conversation where a person is trying to book a hotel. Extract the relevant information based on the given categories. If any category cannot be identified from the transcript, assign it a null value.

        Categories to Extract:

        Price Range: The price range specified by the user (e.g., budget, mid-range, luxury, or specific amounts).
        Location: The location or area where the user wants to book the hotel.
        Star Rating: The desired star rating of the hotel (e.g., 3-star, 5-star).
        User Review: Any user-provided reviews or feedback about the hotel or preferences.
        Room View: Any specified preferences for the view from the room (e.g., sea view, garden view).
        Property Type: The type of property the user is interested in (e.g., resort, villa, boutique hotel).
        Food and Dining: Any specific requirements or preferences for food and dining options (e.g., vegetarian, buffet breakfast).
        Output Format:
        Return the extracted information in JSON format, with each category as a key and its corresponding value (or null if unavailable).

        Example Output:
        {
        "Price Range": "Budget",
        "Location": "Goa",
        "Star Rating": "4-star",
        "User Review": null,
        "Room View": "Sea view",
        "Property Type": "Resort",
        "Food and Dining": "Buffet breakfast"
        }
        TRANSCIPT
    '''
        prompt=prompt+data
        try :
            response = model.generate_content([prompt])
            return response.text
        except Exception as e:
            return e
    else:
        return "There is an error with the input"


