import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'production',
  databaseUrl: process.env.DATABASE_URL,
  clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  clerkSecretKey: process.env.CLERK_SECRET_KEY,
  cloudinaryUrl: process.env.CLOUDINARY_URL,
  groqApiKey: process.env.GROQ_API_KEY,
  clientUrl: process.env.CLIENT_URL,
};

export const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://noventra-1bpu.onrender.com',
];

if (process.env.CLIENT_URL) {
  const formattedClientUrl = process.env.CLIENT_URL.replace(/\/$/, '');
  if (!allowedOrigins.includes(formattedClientUrl)) {
    allowedOrigins.push(formattedClientUrl);
  }
}

export const isAllowedOrigin = (origin: string | undefined): boolean => {
  if (!origin) return true;
  const cleanOrigin = origin.replace(/\/$/, '');
  if (allowedOrigins.includes(cleanOrigin)) return true;
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(cleanOrigin)) return true;
  if (/^https:\/\/.*\.onrender\.com$/.test(cleanOrigin)) return true;
  return false;
};

export const validateEnv = () => {
  const requiredEnvs = [
    'DATABASE_URL',
    'CLERK_SECRET_KEY',
    'CLOUDINARY_URL',
    'GROQ_API_KEY',
  ];

  const missing = requiredEnvs.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(`\n[FATAL] Missing required environment variables:\n  - ${missing.join('\n  - ')}\n`);
    console.error('Please configure these environment variables in your Render environment dashboard or local .env file.');
    process.exit(1);
  }
};
