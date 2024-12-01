# Set up Python
FROM python:3.12-slim AS backend

# Set working directory for backend
WORKDIR /app/UBReads_backend

# Install dependencies for FastAPI
COPY UBReads_backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY UBReads_backend /app/UBReads_backend

# Run backend
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# Build frontend
FROM node:20.18.0 AS frontend

# Set working directory for frontend
WORKDIR /app/UBReads_frontend

# Copy frontend code
COPY UBReads_frontend /app/UBReads_frontend

# Install dependencies and build React app
RUN rm -rf dist node_modules package-lock.json
RUN npm install
RUN npm install
RUN npm run build

# Final stage: Combine both frontend and backend
FROM python:3.12-slim AS final

# Copy backend
COPY --from=backend /app/UBReads_backend /app/UBReads_backend

# Install backend dependencies
WORKDIR /app/UBReads_backend
COPY UBReads_backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy frontend build
COPY --from=frontend /app/UBReads_frontend/dist /app/UBReads_frontend

# Expose port
EXPOSE 8000

# Run
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]