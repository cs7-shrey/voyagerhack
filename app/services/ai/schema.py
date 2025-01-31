from typing_extensions import TypedDict
from .enums import HotelStar, UserRating, PropertyType, HotelAmenityCode, RoomAmenityCode, StatusCode
from google.generativeai.protos import Schema
from google.ai.generativelanguage_v1beta.types import content

class Filters(TypedDict):
    place: str
    check_in: str
    check_out: str
    min_budget: int
    max_budget: int
    hotel_star: list[HotelStar]
    user_rating: UserRating
    property_type: list[PropertyType]
    hotel_amenity_codes: list[HotelAmenityCode]
    room_amenity_codes: list[RoomAmenityCode]

class Status(TypedDict):
    code: StatusCode
    message: str
    
    
class Response(Schema):
    status: Status
    filters: Filters

GOOGLE_GENAI_SCHEMA = content.Schema(
    {
  "type": "object",
  "properties": {
    "status": {
      "type": "object",
      "properties": {
        "code": {
          "type": "string",
          "enum": [
            "200",
            "300",
            "400"
          ]
        },
        "message": {
          "type": "string"
        }
      },
      "required": [
        "code",
        "message"
      ]
    },
    "filters": {
      "type": "object",
      "properties": {
        "place": {
          "type": "string"
        },
        "check_in": {
          "type": "string"
        },
        "check_out": {
          "type": "string"
        },
        "min_budget": {
          "type": "string"
        },
        "max_budget": {
          "type": "string"
        },
        "hotel_star": {
          "type": "array",
          "items": {
            "type": "string",
            "enum": [
              "0",
              "1",
              "2",
              "3",
              "4",
              "5"
            ]
          }
        },
        "user_rating": {
          "type": "string",
          "enum": [
            "0",
            "3",
            "4",
            "4.5"
          ]
        },
        "property_type": {
          "type": "array",
          "items": {
            "type": "string",
            "enum": [
              "Hotel",
              "Apartment",
              "Resort",
              "Guest House",
              "Hostel",
              "Homestay",
              "Villa",
              "Camp"
            ]
          }
        },
        "hotel_amenity_codes": {
          "type": "array",
          "items": {
            "type": "string",
            "enum": [
              "AC",
              "AIRTRANS",
              "BAR",
              "ELVTR",
              "GYM",
              "HKPNG",
              "INTRNT",
              "LNDRY",
              "PRKG",
              "RSTRNT"
            ]
          }
        },
        "room_amenity_codes": {
          "type": "array",
          "items": {
            "type": "string",
            "enum": [
              "AC",
              "AIRPRF",
              "HTR",
              "HKPNG",
              "CNCTD",
              "LNDRY",
              "MNRLWTR",
              "RMSRVC",
              "SMKGRM",
              "STDYRM",
              "INTRNT"
            ]
          }
        }
      }
    }
  },
  "required": [
    "status"
  ]
}
  )

generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 40,
  "max_output_tokens": 8192,
  "response_schema": content.Schema(
    type = content.Type.OBJECT,
    enum = [],
    required = ["status"],
    properties = {
      "status": content.Schema(
        type = content.Type.OBJECT,
        enum = [],
        required = ["code", "message"],
        properties = {
          "code": content.Schema(
            type = content.Type.STRING,
            enum = [
            "200",
            "300",
            "400"
          ]
          ),
          "message": content.Schema(
            type = content.Type.STRING,
          ),
        },
      ),
      "filters": content.Schema(
        type = content.Type.OBJECT,
        properties = {
          "place": content.Schema(
            type = content.Type.STRING,
          ),
          "check_in": content.Schema(
            type = content.Type.STRING,
          ),
          "check_out": content.Schema(
            type = content.Type.STRING,
          ),
          "min_budget": content.Schema(
            type = content.Type.STRING,
          ),
          "max_budget": content.Schema(
            type = content.Type.STRING,
          ),
          "hotel_star": content.Schema(
            type = content.Type.ARRAY,
            items = content.Schema(
              type = content.Type.STRING,
            ),
          ),
          "user_rating": content.Schema(
            type = content.Type.STRING,
          ),
          "property_type": content.Schema(
            type = content.Type.ARRAY,
            items = content.Schema(
              type = content.Type.STRING,
            ),
          ),
          "hotel_amenity_codes": content.Schema(
            type = content.Type.ARRAY,
            items = content.Schema(
              type = content.Type.STRING,
            ),
          ),
          "room_amenity_codes": content.Schema(
            type = content.Type.ARRAY,
            items = content.Schema(
              type = content.Type.STRING,
            ),
          ),
        },
      ),
    },
  ),
  "response_mime_type": "application/json",
}