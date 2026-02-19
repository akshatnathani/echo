// server/config/env.js
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET'
];

const validateEnv = () => {
  const missing = [];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    console.error('Please create a .env file based on .env.example');
    process.exit(1);
  }

  // Validate JWT secret length
  if (process.env.JWT_SECRET.length < 32) {
    console.warn('⚠️  Warning: JWT_SECRET should be at least 32 characters for security');
  }

  console.log('✅ Environment variables validated');
};

module.exports = { validateEnv };
