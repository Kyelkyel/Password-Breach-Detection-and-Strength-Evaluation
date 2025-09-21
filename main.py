from fastapi import FastAPI
from pydantic import BaseModel
import sqlite3
from hashlib import sha256
import re
from fastapi.middleware.cors import CORSMiddleware  # ✅ added this
import random
import string
 
# Define what data the API expects to receive
class PasswordRequest(BaseModel):
    password: str
 
# Define what data the API will send back
class PasswordResponse(BaseModel):
    strength_score: int
    strength_category: str  # e.g., "Very Weak", "Weak", "Medium", "Strong"
    is_breached: bool
    suggestions: list[str]
 
class GeneratePasswordRequest(BaseModel):
    length: int = 12
    include_uppercase: bool = True
    include_lowercase: bool = True
    include_digits: bool = True
    include_special: bool = True

class GeneratePasswordResponse(BaseModel):
    generated_password: str
    strength_score:int
    strength_category: str

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
# helper function to generate random password
def generate_password(length: int = 12, include_uppercase: bool = True,
                      include_lowercase: bool = True, include_digits: bool = True,
                      include_special: bool = True) -> str:
    """
    Generate a random password with specified criteria.
    Default: 12 characters with uppercase, lowercase, digits, and special characters.
    """
    character_sets = []

    if include_lowercase:
        character_sets.append(string.ascii_lowercase)
    if include_uppercase:
        character_sets.append(string.ascii_uppercase)
    if include_digits:
        character_sets.append(string.digits)
    if include_special:
        character_sets.append("!@#$%^&*()_+-=[]{}|;:,.<>?")
    
    # ensure at least one character set is selected
    if not character_sets:
        character_sets.append(string.ascii_letters + string.digits + "!@#$%^&*")

    # generate password ensuring at least one character from each selected set
    password = []
    for char_set in character_sets:
        password.append(random.choice(char_set))

    # fill the rest randomly
    all_chars = ''.join(character_sets)
    while len(password) < length:
        password.append(random.choice(all_chars))

    random.shuffle(password)    # shuffle to avoid predictable patterns


    return ''.join(password)

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

@app.post("/generate", response_model=GeneratePasswordResponse)
async def generate_password_endpoint(request: GeneratePasswordRequest = GeneratePasswordRequest()):
    # generate the password
    password = generate_password(
        length=request.length,
        include_uppercase=request.include_uppercase,
        include_lowercase=request.include_lowercase,
        include_digits=request.include_digits,
        include_special=request.include_special
    )
    
    score, category, _ = check_strength(password) # check its strength (optional but useful)

    return GeneratePasswordResponse(
        generated_password=password,
        strength_score=score,
        strength_category=category
    )

# quick generate endpoint with default settings
@app.get("/generate-quick", response_model=GeneratePasswordResponse)
async def generate_password_quick():
    password = generate_password()  # Uses default 12 chars with all types
    score, category, _ = check_strength(password)
    
    return GeneratePasswordResponse(
        generated_password=password,
        strength_score=score,
        strength_category=category
    )

# Root endpoint for testing
@app.get("/")
async def root():
    return {"message": "Password Checker API is running!"}