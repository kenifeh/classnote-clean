// Configuration for ClassNote AI
// For production, use environment variables instead of hardcoding API keys

require('dotenv').config();

module.exports = {
  // Get your API key from: https://platform.openai.com/api-keys
  // Set OPENAI_API_KEY in your .env file for production use
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'your_openai_api_key_here',
  PORT: process.env.PORT || 3001
};