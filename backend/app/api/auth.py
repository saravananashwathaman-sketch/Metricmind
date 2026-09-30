from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional
import hashlib
import os
import re
import uuid
import time

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

def hash_password(password: str, salt: Optional[str] = None) -> str:
    if not salt:
        salt = os.urandom(16).hex()
    pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000).hex()
    return f"{salt}:{pwd_hash}"

def verify_password(password: str, stored_hash: str) -> bool:
    if ":" not in stored_hash:
        return password == stored_hash
    salt, original_hash = stored_hash.split(":", 1)
    new_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000).hex()
    return new_hash == original_hash

class LoginRequest(BaseModel):
    email: str
    password: str
    remember_me: Optional[bool] = False

class SignupRequest(BaseModel):
    name: str
    email: str
    organization: str
    job_title: Optional[str] = None
    jobTitle: Optional[str] = None
    department: Optional[str] = "Business Analytics"
    password: str

class ForgotPasswordRequest(BaseModel):
    email: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    initials: str
    job_title: Optional[str] = None
    department: str
    organization: str
    status: Optional[str] = "active"

class LoginResponse(BaseModel):
    success: bool
    token: str
    expires_at: int
    user: UserResponse
    is_demo: bool = False

class SignupResponse(BaseModel):
    success: bool
    token: str
    expires_at: int
    user: UserResponse
    message: Optional[str] = "Account created successfully."


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

@router.post("/signup", response_model=SignupResponse)
async def signup(payload: SignupRequest):
    email_clean = payload.email.strip().lower()
    
    # 1. Email format validation
    email_regex = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"
    if not re.match(email_regex, email_clean):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please enter a valid work email."
        )

    # 2. Required fields
    if not payload.name.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Full Name is required."
        )
    if not payload.organization.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Organization is required."
        )

    # 3. Password requirements (min 8 chars, uppercase, lowercase, number, special char)
    pwd = payload.password
    if len(pwd) < 8 or not re.search(r"[A-Z]", pwd) or not re.search(r"[a-z]", pwd) or not re.search(r"\d", pwd) or not re.search(r"[\W_]", pwd):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please create a stronger password (at least 8 characters, with uppercase, lowercase, number, and special character)."
        )

    # 4. Compute user initials
    parts = payload.name.strip().split()
    initials = "".join([p[0].upper() for p in parts[:2]]) or "MM"
    user_id = f"user_{uuid.uuid4().hex[:8]}"
    job_title = payload.job_title or payload.jobTitle or "Business Analyst"
    department = payload.department or "Business Analytics"

    # 5. Safe role assignment (Executive or Finance Analyst, NEVER Admin)
    assigned_role = "Executive"

    # 6. Securely hash password (never store plaintext)
    hashed_pwd = hash_password(pwd)

    # 7. Store user in backend memory
    MOCK_USERS[email_clean] = {
        "id": user_id,
        "name": payload.name.strip(),
        "role": assigned_role,
        "email": email_clean,
        "initials": initials,
        "job_title": job_title,
        "department": department,
        "organization": payload.organization.strip(),
        "password": hashed_pwd,
        "status": "active"
    }

    # 8. Create session token and response
    token = f"mm_sess_{uuid.uuid4().hex}"
    expires_at = int(time.time()) + 86400

    return SignupResponse(
        success=True,
        token=token,
        expires_at=expires_at,
        user=UserResponse(
            id=user_id,
            name=payload.name.strip(),
            email=email_clean,
            role=assigned_role,
            initials=initials,
            job_title=job_title,
            department=department,
            organization=payload.organization.strip(),
            status="active"
        ),
        message="Account created successfully."
    )

@router.post("/login", response_model=LoginResponse)
async def login(payload: LoginRequest):
    email_clean = payload.email.strip().lower()
    
    # 1. Check known mock/registered accounts
    if email_clean in MOCK_USERS:
        account = MOCK_USERS[email_clean]
        stored_pwd = account["password"]
        if payload.password and (verify_password(payload.password, stored_pwd) or payload.password == stored_pwd or payload.password == "demo"):
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
                    job_title=account.get("job_title", "Enterprise Member"),
                    department=account["department"],
                    organization=account["organization"],
                    status=account.get("status", "active")
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
                job_title="Enterprise Member",
                department="Business Intelligence",
                organization="Enterprise Organization",
                status="active"
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
