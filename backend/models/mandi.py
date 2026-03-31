def mandi_schema(data: dict):
    return {
        "crop": data.get("crop"),
        "district": data.get("district"),
        "state": data.get("state", "West Bengal"),  # ✅ DEFAULT STATE
        "mandi_price": data.get("mandi_price"),
        "mandi": data.get("mandi"),
        "timestamp": data.get("timestamp")
    }