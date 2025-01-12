from pydantic import BaseModel

class SearchSuggestion(BaseModel):
    label: str
    sublabel: str
    type: str
    score: float