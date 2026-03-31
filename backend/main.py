from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.price import router as price_router
from routes.stats import router as stats_router

app = FastAPI(title="Mandi Price API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routes
app.include_router(price_router)
app.include_router(stats_router)

@app.get("/")
def root():
    return {"message": "Mandi API is running"}