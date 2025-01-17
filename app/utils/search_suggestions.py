import psycopg
from dotenv import load_dotenv
import os
from psycopg.rows import dict_row
from thefuzz import fuzz

load_dotenv()
    
def get_suggestion_space() -> list:
    try:
        conn = psycopg.connect(conninfo=os.getenv('DATABASE_URL'), row_factory=dict_row)
        print('connection successful')
        cursor = conn.cursor()
        cursor.execute("SELECT version();")
        print(cursor.fetchone())
    except Exception as e:
        print(e)
        return []
    cursor.execute("select city.name as city_name, country.name as country_name from city inner join country on city.country_id = country.country_id")
    cities = cursor.fetchall()
    cursor.execute("select hotel.name as hotel_name, city.name as city_name, country.name as country_name, location from hotel inner join city on hotel.city_id = city.city_id inner join country on city.country_id = country.country_id")
    hotels = cursor.fetchall()
    conn.close()
    
    location_labels = []
    temp_labels = []
    for hotel in hotels:
        location = {}
        if not 'location' in hotel:
            continue
        if hotel['location'] in temp_labels:
            continue
        temp_labels.append(hotel['location'])
        location['label'] = hotel['location']
        location['sublabel'] = hotel['country_name']
        location['type'] = 'location'
        location_labels.append(location)
    
    hotel_labels = [{'label': hotel['hotel_name'], 'sublabel': hotel['location'] + ', ' + hotel['country_name'], 'type': 'hotel'} for hotel in hotels]
    city_lables = [{'label': city['city_name'], 'sublabel': city['country_name'], 'type': 'city'} for city in cities]
    suggestion_search_space = location_labels + hotel_labels + city_lables
    return suggestion_search_space

def custom_sort(choices, query):
    results = []
    for choice in choices:
        # 1. Partial Ratio (Important for Substring Matching):
        partial_ratio = fuzz.partial_ratio(query, choice['label'])

        # 2. Token Set Ratio (Handles Word Order Variations):
        token_set_ratio = fuzz.token_set_ratio(query, choice['label'])

        # 3. Ratio (Overall Similarity):
        ratio = fuzz.ratio(query, choice['label'])

        # 4. Custom Scoring (Prioritizing Order):
        score = (partial_ratio * 0.5) + (token_set_ratio * 0.4) + (ratio * 0.1) # you can play with these weights
        if query.lower() in choice['label'].lower(): # Boost if the query is a substring of the label
            score += 10

        if score > 70:
            choice['score'] = score
            results.append(choice)

    results.sort(key=lambda x: x['score'], reverse=True)
    # return at max 10 results
    return results if len(results) < 10 else results[:10]

def get_suggestions(search_term: str) -> list:
    suggestion_search_space = get_suggestion_space()   
    # print(suggestion_search_space)
    return custom_sort(suggestion_search_space, search_term)