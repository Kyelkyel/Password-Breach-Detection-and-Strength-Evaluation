import sqlite3
from hashlib import sha256

# Connect to (or create) the SQLite database file
conn = sqlite3.connect('breach_database.db')
cursor = conn.cursor()

# Create a table to store the hashes
cursor.execute('''CREATE TABLE IF NOT EXISTS breached_hashes (
                    hash TEXT PRIMARY KEY
                )''')

with open('rockyou.txt', 'r', encoding='latin-1') as f: # encoding might not be needed for your test file
    for i, line in enumerate(f):
        if i >= 10000: # stop after 10,000 passwords
            break
        password = line.strip()
        if password: # Make sure the line isn't empty
            # Hash the password using SHA-256
            hash_value = sha256(password.encode()).hexdigest()
            try:
                cursor.execute("INSERT INTO breached_hashes (hash) VALUES (?)", (hash_value,))
            except sqlite3.IntegrityError:
                # Ignore duplicate hashes
                pass

# Save the changes and close the connection
conn.commit()
conn.close()
print(f"Database populated successfully with rockyou.txt!")