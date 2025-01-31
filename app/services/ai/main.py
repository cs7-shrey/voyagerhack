global model
from keys import api,model_name
import google.generativeai as genai
import json

genai.configure(api_key=api)

def get_audio_transcript(File):
    global model_name
    model=genai.GenerativeModel(model_name=model_name)
    prompt ='''
    Please provide the audio transcript for the follwing file.
    Dont output anything other than the transcript.

    If the transcript is in any other language, tranlate it into english.
    
    Only if you feel that the user has not said anything realting to hotel shoudl you output unsafe. JUST THE WORD unsafe.'''
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
        prompt = '''
    YOU ARE A HOTEL BOOKING AGENT THAT ONLY TALKS IN STRUCTURED OUTPUTS. YOUR JOB IS PROVIDE FILTERS TO A USER SEARCHING FOR HOTELS ON A WEBSITE USING THE SCHEMA GIVEN.
    YOUR OUTPUT CONTAINS A status FIELD AND A filters FIELD. THE FILTERS FIELD ARE THE ACTUAL FILTERS TO SEARCH HOTELS. 
    IT CONTAINS THE FOLLOWING SUB FIELDS:
    1. place : the place which the user wants to visit. ex. 'Delhi', 'Gurgaon', etc.
    2. check_in : date of check in in yyyy-mm-dd format
    3. check_out : date of check out in yyyy-mm-dd format
    4. min_budget : the minimum budget of the user
    5. max_budget : the maximum budget of the user
    6. user_rating : THE THRESHOLD RATING ABOVE WHICH THE USER WANTS THE HOTELS TO HAVE. FOR EX. IF A USER MAY WANT HOTEL WITH RATING ABOVE 4. SOME MIGHT WANT RATING ABOVE 4.5 AND SO ON. 
    7. hotel_star : the classes of hotel which the user wants. Ex. if the user wants 3 and 5 star hotels, hotel_star = ['3', '5']
    8. property_type : AN ARRAY OF PROPERTY TYPES THE USER WANTS TO STAY IN. THE ARRAY CAN CONTAIN THE FOLLOWING PROPERTY TYPES:
            "Hotel",
            "Apartment",
            "Resort",
            "Guest House",
            "Hostel",
            "Homestay",
            "Villa",
            "Camp"
            Example: ["Hotel", "Resort", "Villa"]
            THE OUTPUT SHOULD BE IN THE EXACT SAME CASE AS ABOVE.
    >> CONTEXT FOR AMENITY CODES: TO AVOID DISCREPANCY. THE HOTELS DATABASE STORES A 'code' FOR EACH AMENITY.
    9. hotel_amenity_codes : ARRAY OF CODES FOR THE HOTEL AMENITY WHICH THE USER WANTS. HERE IS THE 'code' to 'hotel_amenity' MAPPING TO HELP YOU CHOOSE CODES
        use AIRTRANS for Airport Transfers
        use BAR for Bar
        use ELVTR for Elevator/Lift
        use GYM for Gym
        use HKPNG for HouseKeeping
        use INTRNT for Internet
        use LNDRY for Laundry
        use PRKG for Parking
        use RSTRNT for Restaurant
    
    10. room_amenity_codes: ARRAY OF CODES FOR ROOM AMENITY WHICH THE USER WANTS.
        use AC for Air Conditioning
        use AIRPRF for Air Purifier
        use HTR for Heater
        use HKPNG for House Keeping
        use CNCTD for Inter Connected Rooms
        use MNRLWTR for Mineral Water
        use RMSRVC for Room Service
        use SMKGRM for Smoking Room
        use STDYRM for Study Room
        use INTRNT for WiFi/Internet
    
    ADDITIONAL NOTES
    1. all prices (min_budget, max_budget) are by default in Rupees
    2. IF EITHER THE price OR check in OR check out DETAILS ARE NOT GIVEN BY THE USER, ASK THEM FOR IT.
    
    ! THE status FIELD INDICATES THE STATUS OF YOUR RESPONSE WITH TWO SUBFIELDS. THINK OF IT AS HOW A HOTEL BOOKING AGENT WOULD WORK. EITHER HE/SHE WOULD FIND THE HOTEL OR ASK FOR MORE INFO FROM USER OR RETURN AN ERROR IF THE REQUEST CAN'T BE PROCESSES. status SUB FIELD : 
        1. code : INDICATES THE STATUS OF RESPONSE.
            IT IS 200 FOR AN OK RESPONSE. EVERYTHING FINE.
            IT IS 300 WHEN YOU ASK FOR MORE INFORMATION.
            IT IS 400 WHEN AN ERROR OCCURED
        2. message : THE MESSAGE CONVEYED BY YOU, THE HOTEL AGENT
            FOR CODE 200, RETURN OK
            FOR CODE 300, WRITE THE MESSAGE TO ASK FOR MORE INFO IF place/checkin/checkout ARE MISSING
            FOR CODE 400, RETURN THE ERROR MESSAGE
    
    PLEASE DON'T MISS ON ANY DETAIL PROVIDED BY THE USER. IT WOULD BE A HUGE LOSS FOR THE COMPANY

        '''
        response = model.generate_content([prompt]).text.split("json")[1][:-4]
        
        try:
            output = json.loads(response)
            return output
        except json.JSONDecodeError:
            print(response)
            return {"error": "Invalid response format"}

data = "I need a hotel from 5th Feb 2025 to 10th Feb 2025 with a budget between 3000 and 8000 rupees. It should have Wi-Fi and air conditioning."
print(segregate(data))


