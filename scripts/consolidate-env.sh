#!/bin/bash

# ===========================================
# CONSOLIDATE ENVIRONMENT FILES
# ===========================================

echo "🔧 Consolidating environment files..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Create consolidated .env file
cat > .env << 'EOF'
# ===========================================
# GROW FITNESS MONOREPO - ENVIRONMENT CONFIG
# ===========================================

# ===========================================
# SHARED CONFIGURATION
# ===========================================
NODE_ENV=development
APP_NAME=Grow Fitness
APP_VERSION=1.0.0

# ===========================================
# CLIENT CONFIGURATION
# ===========================================
# Frontend URL
CLIENT_URL=http://localhost:5173
CLIENT_PORT=5173

# API Base URL (for client to connect to server)
VITE_API_BASE_URL=http://localhost:3001
API_BASE_URL=http://localhost:3001

# ===========================================
# SERVER CONFIGURATION
# ===========================================
# Server Port
PORT=3001
SERVER_PORT=3001
SERVER_HOST=localhost

# Database
MONGO_URI=mongodb://localhost:27017/grow-fitness

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGINS=http://localhost:5173,http://localhost:3001

# ===========================================
# EXTERNAL SERVICES
# ===========================================
# Google Calendar Integration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

# Payment Gateway (Stripe)
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Email Configuration (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@growfitness.com

# SMS Configuration (Twilio)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# File Storage (AWS S3)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=grow-fitness-uploads

# ===========================================
# SECURITY & RATE LIMITING
# ===========================================
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# ===========================================
# DEVELOPMENT TOOLS
# ===========================================
# Enable/disable features in development
ENABLE_SWAGGER=true
ENABLE_DEBUG_LOGS=true
EOF

print_status "Created consolidated .env file"

# Remove individual .env files
if [ -f "client/.env" ]; then
    rm client/.env
    print_status "Removed client/.env"
fi

if [ -f "server/.env" ]; then
    rm server/.env
    print_status "Removed server/.env"
fi

# Remove old lock files and node_modules
if [ -f "client/pnpm-lock.yaml" ]; then
    rm client/pnpm-lock.yaml
    print_status "Removed client/pnpm-lock.yaml"
fi

if [ -f "server/package-lock.json" ]; then
    rm server/package-lock.json
    print_status "Removed server/package-lock.json"
fi

if [ -d "client/node_modules" ]; then
    rm -rf client/node_modules
    print_status "Removed client/node_modules"
fi

if [ -d "server/node_modules" ]; then
    rm -rf server/node_modules
    print_status "Removed server/node_modules"
fi

print_status "🎉 Environment consolidation complete!"
echo ""
echo "Next steps:"
echo "1. Run 'pnpm install' to install dependencies in the workspace"
echo "2. Edit .env file with your specific configuration"
echo "3. Run 'pnpm dev' to start all services"
