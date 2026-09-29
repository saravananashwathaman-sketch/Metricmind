from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional
import uuid
import time

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    email: str
    password: str
    remember_me: Optional[bool] = False

class ForgotPasswordRequest(BaseModel):
    email: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    initials: str
    department: str
    organization: str

class LoginResponse(BaseModel):
    success: bool
    token: str
    expires_at: int
    user: UserResponse
    is_demo: bool = False

MOCK_USERS = {
    "ashwathaman@metricmind.com": {
        "id": "user_001",
        "name": "Ashwathaman",
        "role": "Executive",
        "email": "ashwathaman@metricmind.com",
        "initials": "A",
        "department": "Business Analytics",
        "organization": "MetricMind Enterprise",
        "password": "Password123!"
    },
    "demo@metricmind.app": {
        "id": "user_001",
        "name": "Rajesh Kapoor",
        "role": "Executive",
        "email": "demo@metricmind.app",
        "initials": "RK",
        "department": "Business Analytics",
        "organization": "MetricMind Enterprise",
        "password": "demo"
    },
    "priya.sharma@metricmind.com": {
        "id": "user_002",
        "name": "Priya Sharma",
        "role": "Finance Analyst",
        "email": "priya.sharma@metricmind.com",
        "initials": "PS",
        "department": "Strategic Finance",
        "organization": "MetricMind Enterprise",
        "password": "Password123!"
    },
    "admin@metricmind.com": {
        "id": "user_003",
        "name": "Vikram Malhotra",
        "role": "Admin",
        "email": "admin@metricmind.com",
        "initials": "VM",
        "department": "Data Governance & Infrastructure",
        "organization": "MetricMind Enterprise",
        "password": "Password123!"
    },
    "devon.clark@metricmind.com": {
        "id": "user_004",
        "name": "Devon Clark",
        "role": "Sales Analyst",
        "email": "devon.clark@metricmind.com",
        "initials": "DC",
        "department": "Commercial Operations",
        "organization": "MetricMind Enterprise",
        "password": "Password123!"
    }
}

@router.post("/login", response_model=LoginResponse)
async def login(payload: LoginRequest):
    email_clean = payload.email.strip().lower()
    
    # 1. Check known mock/demo accounts
    if email_clean in MOCK_USERS:
        account = MOCK_USERS[email_clean]
        if payload.password and (payload.password == account["password"] or payload.password == "demo" or len(payload.password) >= 6):
            token = f"mm_sess_{uuid.uuid4().hex}"
            ttl = 30 * 86400 if payload.remember_me else 86400
            return LoginResponse(
                success=True,
                token=token,
                expires_at=int(time.time()) + ttl,
                user=UserResponse(
                    id=account["id"],
                    name=account["name"],
                    email=account["email"],
                    role=account["role"],
                    initials=account["initials"],
                    department=account["department"],
                    organization=account["organization"]
                ),
                is_demo=email_clean == "demo@metricmind.app"
            )

    # 2. Support any corporate domain (@company.com, @metricmind.com, etc.) with valid password
    if "@" in email_clean and len(payload.password) >= 6:
        username_part = email_clean.split("@")[0].replace(".", " ").title()
        initials = "".join([p[0].upper() for p in username_part.split()[:2]]) or "MM"
        token = f"mm_sess_{uuid.uuid4().hex}"
        ttl = 30 * 86400 if payload.remember_me else 86400
        return LoginResponse(
            success=True,
            token=token,
            expires_at=int(time.time()) + ttl,
            user=UserResponse(
                id=f"user_{uuid.uuid4().hex[:6]}",
                name=username_part,
                email=email_clean,
                role="Executive",
                initials=initials,
                department="Business Intelligence",
                organization="Enterprise Organization"
            ),
            is_demo=False
        )

    # Invalid credentials
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Unable to sign in. Please check your credentials and try again."
    )

@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordRequest):
    return {
        "success": True,
        "message": "If the account exists, recovery instructions have been sent."
    }

@router.post("/logout")
async def logout():
    return {
        "success": True,
        "message": "Logged out successfully"
    }
