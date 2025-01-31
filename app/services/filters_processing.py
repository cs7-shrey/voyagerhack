from app.database import get_db
from app.routes.search import suggestion_search_space
from app.services.crud.hotel.filter import get_hotels_with_filters
from app.utils.search_suggestions import get_suggestions
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Type

def set_error(llm_filters):
    llm_filters = {}
    llm_filters['status'] = { 'code': 400, 'message': 'Some error occured. Please try again or use manual search'}
    llm_filters['filters'] = {}
    llm_filters['data'] = []
    return llm_filters
def preprocess_llm_filters(llm_filters, SearchFiltersSchema: Type[BaseModel]):
    """
        Making sure that the filters have a valid schema
    """
    if 'status' not in llm_filters or 'code' not in llm_filters['status']:
        return set_error(llm_filters)
    else:
        try:
            llm_filters['status']['code'] = int(llm_filters['status']['code'])
        except ValueError:
            return set_error(llm_filters)
        # if llm_filters['status']['code'] not in [200, 300, 400]:
        #     return set_error(llm_filters)
    if not 'filters' in llm_filters:
        return set_error(llm_filters)
    else: 
        filters = llm_filters['filters']        # filters are present
        if not isinstance(filters, dict):
            return set_error(llm_filters)
        print(filters)
        cleaned_filters: dict[str, any] = {}
        schema_fields = SearchFiltersSchema.model_fields
        
        for field_name, field_info in schema_fields.items():
            if field_name in filters:
                cleaned_filters[field_name] = filters[field_name]
            else:
                cleaned_filters[field_name] = None 
        llm_filters['filters'] = cleaned_filters                # extra fields are removed whatsoever
        return llm_filters
                

def process_llm_filters(llm_filters, SearchFiltersSchema: Type[BaseModel], db: Session):
    llm_filters = preprocess_llm_filters(llm_filters, SearchFiltersSchema)
    # the llm filters now have a valid schema but their status codes can still be erroneous and the required fields can still be None 
    final_response = {
        'status': llm_filters['status'],
        'filters': llm_filters['filters'],
        'data': []
    }
    if llm_filters['status']['code'] not in [200, 300, 400]:
        final_response = set_error(llm_filters)
    # now the llm_filters have valid status codes but still possible for some required fields to be None
    # basically for status code 300, we are trusting the LLM
    elif llm_filters['status']['code'] == 200 or llm_filters['status']['code'] == 300:
        # TODO: make this checking more programatic in case of more default fields
        if not llm_filters['filters']['place']:
            final_response['status'] = {
                'code': 300,
                'message': "Please provide a location you'd like to visit"
            }
            return final_response
        query_dict = {k: v for k, v in llm_filters['filters'].items() if v is not None}
        suggestions = get_suggestions(query_dict['place'], suggestion_search_space)
        if not suggestions or suggestions[0]['score'] < 90:
            final_response['status'] = {
                'code': 300,
                'message': "The place you are looking for could not be found. Please try again."
            }
            final_response['filters']['place'] = None
            return final_response
        query_dict['place'] = {
            'name': suggestions[0]['label'],
            'type': suggestions[0]['type']
        }
        search_filters =  SearchFiltersSchema(**query_dict)
        final_response['filters'] = search_filters.model_dump()     # making sure that default filters exist
        # query the database
        try:
            final_response['data'] = get_hotels_with_filters(search_filters, db)
        except:
            final_response['status'] = {
                'code': 400,
                'message': "Some error occured. Please try again or use manual search"
            }
        # return the data with filters
    return final_response
        
