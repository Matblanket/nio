import os
import json

add = {"naruto":[{'worktype': 'work', 'time': 1}]}  # Use a dictionary instead of a list with one dictionary

# Check if 'data.json' exists
if os.path.exists('data.json'):
    with open("data.json", 'r') as f:
        existing_data = json.load(f)
print(type(existing_data['naruto']))
