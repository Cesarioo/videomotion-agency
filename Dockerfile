FROM node:20-bullseye

# Install system dependencies for Remotion (Chromium)
RUN apt-get update && apt-get install -y \
    chromium \
    libnss3 \
    libfreetype6 \
    libfreetype6-dev \
    libharfbuzz-dev \
    ca-certificates \
    fonts-freefont-ttf \
    && rm -rf /var/lib/apt/lists/*

# Set environment variable for Remotion to find Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

COPY package.json ./

RUN npm install

# Copy Prisma schema and generate client
COPY prisma.config.ts ./
COPY core/database ./core/database
RUN npm run db:generate

# Copy source code
COPY . .
RUN chmod +x /app/start.sh

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000
CMD ["/app/start.sh"]