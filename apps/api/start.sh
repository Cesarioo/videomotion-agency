#!/bin/sh
set -e

echo "Running database migrations..."
npm run db:push

echo "Starting API..."
exec npm start