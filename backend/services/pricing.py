from services.agmarknet import fetch_mandi_price
from utils.cache import get_cache, set_cache
from utils.db import mandi_collection
from models.mandi import mandi_schema
from datetime import datetime

DEFAULT_STATE = "West Bengal"

def calculate_price(crop: str, district: str):
    cache_key = f"{crop}_{district}"

    # ✅ Check cache
    cached = get_cache(cache_key)
    if cached:
        return cached

    # ✅ Check DB first
    db_data = mandi_collection.find_one({
        "crop": crop,
        "district": district,
        "state": DEFAULT_STATE
    })

    if db_data:
        mandi_price = db_data["mandi_price"]
        mandi_name = db_data["mandi"]
    else:
        # 🔄 Fetch from API
        mandi_data = fetch_mandi_price(crop, district, DEFAULT_STATE)

        if not mandi_data:
            mandi_price = 2200
            mandi_name = district
        else:
            mandi_price = mandi_data["mandi_price"]
            mandi_name = mandi_data["mandi"]

            # ✅ Save to DB
            mandi_collection.insert_one(
                mandi_schema({
                    "crop": crop,
                    "district": district,
                    "state": DEFAULT_STATE,
                    "mandi_price": mandi_price,
                    "mandi": mandi_name,
                    "timestamp": datetime.utcnow()
                })
            )

    # 🚚 Transport logic
    distance_km = 40
    transport_cost_per_km = 0.5
    transport_cost = distance_km * transport_cost_per_km

    walkaway_price = mandi_price - transport_cost

    result = {
        "crop": crop,
        "district": district,
        "state": DEFAULT_STATE,  # ✅ included in response
        "mandi_price": mandi_price,
        "transport_cost": round(transport_cost, 2),
        "walkaway_price": round(walkaway_price, 2),
        "nearest_mandi": mandi_name,
        "distance_km": distance_km
    }

    # ✅ Cache result
    set_cache(cache_key, result)

    return result