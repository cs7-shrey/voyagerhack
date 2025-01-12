from fastapi import FastAPI, APIRouter
from ..utils.search_suggestions import get_suggestions
from .. import schemas

router = APIRouter(prefix="/search", tags=["search"])

@router.get("/suggestions/", response_model=list[schemas.SearchSuggestion]) 
def search_suggestions(search_term: str):
    results = get_suggestions(search_term)
    return results