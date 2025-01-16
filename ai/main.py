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
        prompt = '''
            Analyze the following audio transcript of a conversation where a person is trying to book a hotel. Extract the relevant information based on the specified categories. Ensure that the extracted data is accurate and formatted correctly. If any category cannot be identified from the transcript, assign it a null value.

            ### Categories to Extract:
            1. **Check-in Date**: A string in the format `dd/mm/yyyy`.
            2. **Check-out Date**: A string in the format `dd/mm/yyyy`.
            3. **Minimum Budget**: An integer representing the user's minimum budget.
            4. **Maximum Budget**: An integer representing the user's maximum budget.
            5. **Hotel Star Ratings**: A list of integers ranging from 0 to 5. Default: `[0, 1, 2, 3, 4, 5]`.
            6. **User Rating**: A float value representing the user rating. Default: `0.0`.
            7. **Property Type**: A list of strings representing property types (e.g., "Hotel", "Resort", etc.). Default: `[]`.
            8. **Hotel Amenity Codes**: A list of 'codes' of all hotel amenities that the user wants, e.g., Wi-Fi (code: INTRNT), airport transfer (code: AIRTRANS), etc. Default: []
            9. **Room Amenity Codes**: A list of 'codes' of all room amenities that the user wants, e.g., study room (code: STDYRM), smoking room (code: SMKGRM), etc. Default: []
            10. **Places**: An list of strings representing places mentioned in the transcript. Default: []

            ### Example Output:
            For the transcript: 
            "I would like to book a hotel for a family trip. The check-in date is 15th January 2025, and the check-out date is 20th January 2025. My budget is around 5000 to 15000 rupees, and I prefer a 4-star hotel. A good user rating is important, preferably above 4.5. It would be great if the hotel has a swimming pool and free Wi-Fi. The rooms should have air conditioning and a mini-fridge."

            The output JSON should look like this:
            ```
            {
                "check-in date": "15/01/2025",
                "check-out date": "20/01/2025",
                "min budget": 5000,
                "max budget": 15000,
                "hotel star": [4],
                "User Rating": 4.5,
                "Property Type": [],
                "hotel amenity codes": ["INTRNT", "SWPOOL"],
                "room amenity codes": ["AC", "MNFRG"],
                "place" : ["Delhi", "Gurgaon"]
            }
            dont write anything else in the output

'''
        prompt=prompt+data
        try :
            response = model.generate_content([prompt])
            return response.text
        except Exception as e:
            return e
    else:
        return "There is an error with the input"

