from fastapi import FastAPI
from pydantic import BaseModel
import sqlite3
from hashlib import sha256
import re
from fastapi.middleware.cors import CORSMiddleware  # ✅ added this
 
 
# Define what data the API expects to receive
class PasswordRequest(BaseModel):
    password: str
 
# Define what data the API will send back
class PasswordResponse(BaseModel):
    strength_score: int
    strength_category: str  # e.g., "Very Weak", "Weak", "Medium", "Strong"
    is_breached: bool
    suggestions: list[str]
 
# Create the FastAPI app instance
app = FastAPI(title="Password Checker API")
 
# CORS MIDDLEWARE SETUP ↓
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)
 
# Helper function to check password strength
def check_strength(password: str) -> (int, str, list[str]):
    suggestions = []
    score = 0
 
    # Length check
    if len(password) >= 8:
        score += 1
    else:
        suggestions.append("Use at least 8 characters.")
 
    # Digit check
    if re.search(r"\d", password):
        score += 1
    else:
        suggestions.append("Add at least one number.")
 
    # Uppercase check
    if re.search(r"[A-Z]", password):
        score += 1
    else:
        suggestions.append("Add at least one uppercase letter.")
 
    # Lowercase check
    if re.search(r"[a-z]", password):
        score += 1
    else:
        suggestions.append("Add at least one lowercase letter.")
 
    # Special char check
    if re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        score += 1
    else:
        suggestions.append("Add at least one special character (!@#$...).")
 
    # Map score to a category
    categories = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong", "Excellent"]
    category = categories[score] if score < len(categories) else "Excellent"
 
    return score, category, suggestions
 
# Helper function to check breach database
def check_breach(password: str) -> bool:
    # Hash the input password the same way we did before
    hash_value = sha256(password.encode()).hexdigest()
   
    # Connect to the database and check for the hash
    conn = sqlite3.connect('breach_database.db')
    cursor = conn.cursor()
    cursor.execute("SELECT 1 FROM breached_hashes WHERE hash = ?", (hash_value,))
    result = cursor.fetchone() is not None  # True if found, False if not found
    conn.close()
   
    return result
 
# The key endpoint that does everything
@app.post("/check", response_model=PasswordResponse)
async def check_password(request: PasswordRequest):
    # 1. Check strength
    score, category, suggestions = check_strength(request.password)
   
    # 2. Check breach database
    is_breached = check_breach(request.password)
   
    # If breached, add a critical suggestion
    if is_breached:
        suggestions.insert(0, "⚠️ This password has been found in known data breaches. DO NOT use it.")
   
    # 3. Send back the combined response
    return PasswordResponse(
        strength_score=score,
        strength_category=category,
        is_breached=is_breached,
        suggestions=suggestions
    )
 
# Root endpoint for testing
@app.get("/")
async def root():
    return {"message": "Password Checker API is running!"}