/**
 * Environment variable utility functions
 * This file provides a secure way to access environment variables
 */

/**
 * Function to get a Google API key from environment variables
 * Define the api key in the .env file as GOOGLE_API_KEY, GOOGLE_API_KEY_1, GOOGLE_API_KEY_2, etc.
 * @returns {string} The Google API key
 */
export function getGoogleApiKey(): string {
  // Server-side only function
  if (typeof process === 'undefined') {
    throw new Error('Environment variables can only be accessed server-side')
  }

  // Collect all available API keys from environment variables
  const keys = Object.keys(process.env)
    .filter((key) => key.startsWith('GOOGLE_API_KEY'))
    .map((key) => process.env[key])
    .filter(Boolean) as string[]

  if (keys.length === 0) {
    throw new Error('No Google API keys available in environment variables')
  }

  // Select a random key to distribute usage
  const randomIndex = Math.floor(Math.random() * keys.length)

  return keys[randomIndex]
}

/**
 * Function to get a Groq API key from environment variables
 * Define the api key in the .env file as GROQ_API_KEY, GROQ_API_KEY_1, GROQ_API_KEY_2, etc.
 * @returns {string} The Groq API key
 */
export function getGroqApiKey(): string {
  // Server-side only function
  if (typeof process === 'undefined') {
    throw new Error('Environment variables can only be accessed server-side')
  }

  // Collect all available API keys from environment variables
  const keys = Object.keys(process.env)
    .filter((key) => key.startsWith('GROQ_API_KEY'))
    .map((key) => process.env[key])
    .filter(Boolean) as string[]

  if (keys.length === 0) {
    throw new Error('No Groq API keys available in environment variables')
  }

  // Select a random key to distribute usage
  const randomIndex = Math.floor(Math.random() * keys.length)

  return keys[randomIndex]
}

/**
 * Function to check if we're in a server environment
 * @returns {boolean} True if running on the server, false otherwise
 */
export function isServer(): boolean {
  return typeof window === 'undefined'
}

/**
 * Function to check if we're in a production environment
 * @returns {boolean} True if running in production, false otherwise
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}
