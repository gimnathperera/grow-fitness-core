#!/usr/bin/env node

/**
 * Environment Setup Script for Grow Fitness Monorepo
 * 
 * This script helps manage environment variables across the monorepo
 * and ensures both client and server have access to the same configuration.
 */

const fs = require('fs');
const path = require('path');

const ENV_FILE = '.env';
const ENV_EXAMPLE = 'env.example';

// Environment variable categories
const ENV_CATEGORIES = {
  SHARED: 'SHARED CONFIGURATION',
  CLIENT: 'CLIENT CONFIGURATION', 
  SERVER: 'SERVER CONFIGURATION',
  EXTERNAL: 'EXTERNAL SERVICES',
  SECURITY: 'SECURITY & RATE LIMITING',
  DEVELOPMENT: 'DEVELOPMENT TOOLS'
};

// Required environment variables
const REQUIRED_VARS = {
  SHARED: ['NODE_ENV', 'APP_NAME'],
  CLIENT: ['CLIENT_URL', 'API_BASE_URL'],
  SERVER: ['SERVER_PORT', 'MONGO_URI', 'JWT_SECRET'],
  EXTERNAL: [], // Optional
  SECURITY: ['THROTTLE_TTL', 'THROTTLE_LIMIT'],
  DEVELOPMENT: ['ENABLE_SWAGGER', 'ENABLE_DEBUG_LOGS']
};

function checkEnvironmentSetup() {
  console.log('🔍 Checking environment setup...\n');
  
  // Check if .env exists
  if (!fs.existsSync(ENV_FILE)) {
    console.log('❌ .env file not found');
    if (fs.existsSync(ENV_EXAMPLE)) {
      console.log('💡 Run: cp env.example .env');
    }
    return false;
  }
  
  // Load environment variables
  const envContent = fs.readFileSync(ENV_FILE, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      envVars[key.trim()] = value.trim();
    }
  });
  
  // Check required variables
  let allGood = true;
  Object.entries(REQUIRED_VARS).forEach(([category, vars]) => {
    if (vars.length === 0) return;
    
    console.log(`📋 Checking ${ENV_CATEGORIES[category]}:`);
    vars.forEach(varName => {
      if (envVars[varName]) {
        console.log(`  ✅ ${varName}`);
      } else {
        console.log(`  ❌ ${varName} - MISSING`);
        allGood = false;
      }
    });
    console.log('');
  });
  
  return allGood;
}

function generateEnvTemplate() {
  console.log('📝 Generating environment template...\n');
  
  const template = `# ===========================================
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
CLIENT_URL=http://localhost:5173
CLIENT_PORT=5173
API_BASE_URL=http://localhost:3000/api

# ===========================================
# SERVER CONFIGURATION
# ===========================================
SERVER_PORT=3000
SERVER_HOST=localhost
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
ENABLE_SWAGGER=true
ENABLE_DEBUG_LOGS=true`;

  fs.writeFileSync(ENV_EXAMPLE, template);
  console.log(`✅ Generated ${ENV_EXAMPLE}`);
}

// Main execution
const command = process.argv[2];

switch (command) {
  case 'check':
    const isValid = checkEnvironmentSetup();
    process.exit(isValid ? 0 : 1);
    break;
    
  case 'generate':
    generateEnvTemplate();
    break;
    
  default:
    console.log('🔧 Environment Setup Script');
    console.log('');
    console.log('Usage:');
    console.log('  node scripts/env-setup.js check     - Check environment setup');
    console.log('  node scripts/env-setup.js generate  - Generate env.example template');
    console.log('');
    break;
}
