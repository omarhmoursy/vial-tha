#!/bin/bash
set -e

echo "Starting database initialization..."

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Deploy migrations
echo "Deploying database migrations..."
npx prisma migrate deploy

# Seed the database
echo "Seeding database..."
npx prisma db seed

echo "Database initialization complete. Starting application..."
npm start 