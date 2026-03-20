from database import engine, Base
from models import Post  # Import models so Base knows about them

# Create tables in the database
Base.metadata.create_all(bind=engine)

print("Database tables created successfully!")
