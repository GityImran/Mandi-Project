import requests
import os
from dotenv import load_dotenv

load_dotenv()

DEFAULT_STATE = "West Bengal"
API_KEY = os.getenv("AGMARKNET_API_KEY")

def fetch_mandi_price(crop: str, district: str, state: str = DEFAULT_STATE):
    try:
        url = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"

        params = {
            "api-key": "579b464db66ec23bdd000001117ea733ce2442687d8962d38f62bf49",
            "format": "json",
            "filters[commodity]": crop.capitalize(),
            "filters[district]": district.capitalize(),
            "filters[state]": state,
            "limit": 1
        }

        headers = {
            "User-Agent": "Mozilla/5.0"
        }

        response = requests.get(url, params=params, headers=headers)

        # ✅ Debug print (very useful)
        print("API URL:", response.url)

        if response.status_code != 200:
            print("Error:", response.status_code)
            return None

        data = response.json()
        records = data.get("records", [])

        if not records:
            print("No records found")
            return None

        record = records[0]

        return {
            "mandi_price": float(record.get("modal_price", 0)),
            "mandi": record.get("market", district),
            "district": record.get("district", district),
            "state": record.get("state", state)
        }

    except Exception as e:
        print("AGMARKNET error:", e)
        return None
