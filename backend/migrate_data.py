import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Post, MusicReview  # Adjust import if your models file is named differently

# 1. Connect to your old local SQLite database
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sqlite_path = os.path.join(BASE_DIR, "blog.db")
sqlite_engine = create_engine(f"sqlite:///{sqlite_path}")
SqliteSession = sessionmaker(bind=sqlite_engine)
sqlite_session = SqliteSession()

# 2. Connect to your new Supabase PostgreSQL database
load_dotenv()
pg_url = os.getenv("DATABASE_URL")
if not pg_url:
    raise ValueError("Missing DATABASE_URL in .env")

pg_engine = create_engine(pg_url)
PgSession = sessionmaker(bind=pg_engine)
pg_session = PgSession()

def migrate_data():
    print("Starting data migration...")

    # --- Migrate Blog Posts ---
    print("Extracting Posts from SQLite...")
    sqlite_posts = sqlite_session.query(Post).all()
    
    for post in sqlite_posts:
        # session.merge() safely inserts the row and preserves your original IDs
        pg_session.merge(post) 
    print(f"Loaded {len(sqlite_posts)} Posts into Supabase.")

    # --- Migrate Music Reviews ---
    print("Extracting Music Reviews from SQLite...")
    sqlite_reviews = sqlite_session.query(MusicReview).all()
    
    for review in sqlite_reviews:
        pg_session.merge(review)
    print(f"Loaded {len(sqlite_reviews)} Music Reviews into Supabase.")

    # 3. Commit the changes to Supabase
    try:
        pg_session.commit()
        print("Migration completely successfully! Data is now in the cloud.")
    except Exception as e:
        pg_session.rollback()
        print(f"An error occurred: {e}")
    finally:
        sqlite_session.close()
        pg_session.close()

if __name__ == "__main__":
    migrate_data()