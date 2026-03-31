from fastapi import APIRouter, Query
from services.pricing import calculate_price

router = APIRouter(prefix="/api", tags=["Price"])

@router.get("/get-price")
def get_price(
    crop: str = Query(...),
    district: str = Query(...),
):
    return calculate_price(crop, district)