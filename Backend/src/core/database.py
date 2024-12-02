import psycopg2
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager
from .config import settings

@contextmanager
def get_db_connection():
    conn = psycopg2.connect(
        dbname=settings.POSTGRES_DB,
        user=settings.POSTGRES_USER,
        password=settings.POSTGRES_PASSWORD,
        host=settings.POSTGRES_SERVER,
        cursor_factory=RealDictCursor
    )
    try:
        yield conn
    finally:
        conn.close()
