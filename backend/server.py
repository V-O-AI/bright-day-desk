from fastapi import FastAPI, APIRouter, Request, HTTPException, Depends
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import re
from pathlib import Path
from pydantic import BaseModel, Field, validator
from typing import List, Optional
import uuid
import sys
from datetime import datetime
import jwt as pyjwt


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging early
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT config — fail fast if secret is missing or too short
try:
    SUPABASE_JWT_SECRET = os.environ['SUPABASE_JWT_SECRET']
    if not SUPABASE_JWT_SECRET or len(SUPABASE_JWT_SECRET) < 32:
        raise ValueError('SUPABASE_JWT_SECRET must be at least 32 characters')
except KeyError:
    logger.error('SUPABASE_JWT_SECRET environment variable is required')
    sys.exit(1)
except ValueError as e:
    logger.error(str(e))
    sys.exit(1)

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Auth dependency
async def get_current_user(request: Request) -> dict:
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = auth_header.replace("Bearer ", "")
    try:
        payload = pyjwt.decode(
            token,
            SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated",
        )
        return {"user_id": payload.get("sub"), "email": payload.get("email")}
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except pyjwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str = Field(..., min_length=1, max_length=200)
    user_id: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str = Field(..., min_length=1, max_length=200, description="Client name")

    @validator('client_name')
    def validate_client_name(cls, v):
        v = v.strip()
        if not v:
            raise ValueError('Client name cannot be empty')
        if len(v) > 200:
            raise ValueError('Client name must be less than 200 characters')
        if not re.match(r'^[\w\s\-.,\u0400-\u04FF]+$', v):
            raise ValueError('Client name contains invalid characters')
        return v


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal error occurred."}
    )


# Routes
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate, current_user: dict = Depends(get_current_user)):
    status_dict = input.dict()
    status_dict["user_id"] = current_user["user_id"]
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks(
    current_user: dict = Depends(get_current_user),
    skip: int = 0,
    limit: int = 50,
):
    if limit > 100:
        limit = 100
    if skip < 0:
        skip = 0
    status_checks = await db.status_checks.find(
        {"user_id": current_user["user_id"]}
    ).skip(skip).limit(limit).to_list(limit)
    return [StatusCheck(**sc) for sc in status_checks]

# Include the router in the main app
app.include_router(api_router)

# CORS
cors_origins_env = os.environ.get('CORS_ORIGINS', '')
if not cors_origins_env.strip():
    logger.error('CORS_ORIGINS environment variable must be set (comma-separated origins)')
    sys.exit(1)
allowed_origins = [o.strip() for o in cors_origins_env.split(',') if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=allowed_origins,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
