FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# --- THE TRICK ---
# Create a folder named 'backend' and copy everything into IT
# This makes 'from backend.database' work on HF exactly like local
COPY . /app/backend/

# Move main.py back to the root ONLY if you want uvicorn to find it easily,
# OR just point uvicorn to the new location:
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860", "--proxy-headers", "--forwarded-allow-ips=*"]