from fastapi import APIRouter
from utils.db import mandi_collection

router = APIRouter(prefix="/api/stats", tags=["Stats"])

@router.get("/")
def get_stats():
    # Overview metrics
    total_records = mandi_collection.count_documents({})
    
    distinct_crops = len(mandi_collection.distinct("crop"))
    distinct_districts = len(mandi_collection.distinct("district"))

    # Average price per crop
    # Pipeline to group by crop and calculate average mandi_price
    pipeline = [
        {"$group": {"_id": "$crop", "avg_price": {"$avg": "$mandi_price"}, "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10}
    ]
    crop_stats_cursor = mandi_collection.aggregate(pipeline)
    crop_stats = [{"crop": doc["_id"], "avg_price": round(doc["avg_price"], 2), "searches": doc["count"]} for doc in crop_stats_cursor]

    # Recent queries
    recent_queries_cursor = mandi_collection.find({}, {"_id": 0}).sort("timestamp", -1).limit(5)
    recent_queries = list(recent_queries_cursor)
    
    for query in recent_queries:
        if "timestamp" in query and query["timestamp"]:
            query["timestamp"] = query["timestamp"].isoformat()

    return {
        "overview": {
            "total_records": total_records,
            "distinct_crops": distinct_crops,
            "distinct_districts": distinct_districts
        },
        "crop_stats": crop_stats,
        "recent_queries": [
            {
                "crop": q.get("crop"),
                "district": q.get("district"),
                "price": q.get("mandi_price"),
                "timestamp": q.get("timestamp")
            } for q in recent_queries
        ]
    }
