/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      BACKEND_URL: process.env.BACKEND_URL,
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
      FIREBASE_VAP_ID_KEY: process.env.FIREBASE_VAP_ID_KEY,
      GOOGLE_MAP_API_KEY: process.env.GOOGLE_MAP_API_KEY,
    },
    images: {
      remotePatterns: [
        {
          protocol: "http",
          hostname: "*",
        },
        {
          protocol: "https",
          hostname: "*",
        }
      ],
    },
  };
  
  module.exports = nextConfig;
  