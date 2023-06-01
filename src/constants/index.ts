import dotenv from 'dotenv'

dotenv.config()

export const {
  FB_DATABASE_URL,
  FB_API_KEY,
  FB_APP_ID,
  FB_AUTH_DOMAIN,
  FB_MESSAGIN_SENDER_ID,
  FB_PROJECT_ID,
  FB_STORAGE_BUCKET,
  PORT
} = process.env