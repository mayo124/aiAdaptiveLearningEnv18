# Biology RAG System Dockerfile
FROM node:18-alpine AS frontend-builder

# Install Python and build dependencies
RUN apk add --no-cache python3 py3-pip python3-dev build-base

# Set working directory
WORKDIR /app

# Copy frontend package files
COPY biology-ui/package*.json ./biology-ui/
WORKDIR /app/biology-ui
RUN npm ci

# Copy frontend source
COPY biology-ui/ ./
RUN npm run build

# Production stage
FROM python:3.11-slim

# Install Node.js and system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    build-essential \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy Python RAG scripts
COPY *.py ./
COPY *.txt ./
COPY *.md ./

# Copy vector database files
COPY chroma.sqlite3 ./
COPY 780cc6b5-0f2f-4a78-ab79-e390b14d1cdf/ ./780cc6b5-0f2f-4a78-ab79-e390b14d1cdf/
COPY 7fa06425-293e-41d2-9b4a-14546609bf63/ ./7fa06425-293e-41d2-9b4a-14546609bf63/

# Copy frontend build and server
COPY --from=frontend-builder /app/biology-ui/dist ./biology-ui/dist
COPY biology-ui/server.js ./biology-ui/
COPY biology-ui/package.json ./biology-ui/

# Install production dependencies for server
WORKDIR /app/biology-ui
RUN npm ci --only=production

# Install Ollama
WORKDIR /app
RUN curl -fsSL https://ollama.ai/install.sh | sh

# Expose ports
EXPOSE 3001 8080

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3001/api/health || exit 1

# Start script
COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

CMD ["./docker-entrypoint.sh"]
