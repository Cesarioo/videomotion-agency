FROM node:20-bullseye

# Remotion/Chromium deps
RUN apt-get update && apt-get install -y \
    chromium \
    libnss3 \
    libfreetype6 \
    libharfbuzz-dev \
    ca-certificates \
    fonts-freefont-ttf \
  && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_DOWNLOAD=1

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Copy everything (including prisma schema) then generate
COPY . .
RUN npm run db:generate
RUN npm run build

EXPOSE 3000

# Run migrations at startup (NOT during build), then start app
CMD ["sh", "-c", "npm run db:migrate:deploy && npm start"]