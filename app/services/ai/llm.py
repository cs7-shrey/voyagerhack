from .prompts import SYSTEM_PROMPT
import google.generativeai as genai
import json
import os

genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

# Create the model
generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 40,
  "max_output_tokens": 8192,
  "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
  model_name="gemini-2.0-flash-exp",
  generation_config=generation_config,
  system_instruction=SYSTEM_PROMPT
)

# chat_session.
async def invoke(prompt, previous_filters_string, previous_messages):
  history=[
    {
    "role": "user",
    "parts": [
      f"""
        SYSTEM GENERATED PREVIOUSLY USED FILTERS:
        {previous_filters_string}
        USE IT AS CONTEXT FOR FURTHER QUERIES
      """
    ],
  },
  ]
  if previous_messages and len(previous_messages) > 0:
    history = history + [
            {
        "role": "user",
        "parts": [
          "previous user messages",
        ],
      },
      {
        "role": "model",
        "parts": [
          previous_messages,
        ],
      },
    ]
  chat_session = model.start_chat(
    history=history
  )
  response = await chat_session.send_message_async(prompt)
  return response


def parse_llm_response(text):
    """
    Extract and parse the JSON content between ```json and ``` from a given text.
    Handles errors and returns a dictionary if successful or None otherwise.
    """
    failed_response = {
      'status': {
        'code': 400,
        'message': 'An error occured. Please try again or use manual search'
      }
    }
    try:
        # Regex to extract content between ```json and ```
        import re
        match = re.search(r'```json\s*([\s\S]*?)\s*```', text)
        if not match:
            print("No JSON block found in the text.")
            return None
        
        # Extract JSON string
        json_string = match.group(1)
        
        # Parse JSON string into a dictionary
        parsed_data = json.loads(json_string)
        
        return parsed_data
    except json.JSONDecodeError as e:
        print(f"Failed to decode JSON: {e}")
        return failed_response
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return failed_response