# Ignitia - AI-Powered Startup Builder

Transform your startup ideas into complete brands with AI-generated landing pages.

![Homepage screenshot]([https://github.com/ChickenOnFloor/Ignitia-IdeaPitch/blob/main/public/ScreenShot.png?raw=true])

## Deployment (Vercel)
Live site: https://ignitia-idea-pitch.vercel.app


## Features

- 🤖 AI-powered startup concept generation
- 🎨 Beautiful, professional landing page creation
- 💾 Save and manage all your generated ideas
- 📄 Export as PDF pitch documents
- 💻 Download HTML landing pages
- 🔐 Secure authentication with Supabase

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- An OpenRouter API key (free tier available)

### Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`env
# Supabase (provided by Supabase integration)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key


# OpenRouter API
OPENROUTER_API_KEY=your_openrouter_api_key

# AI Model Configuration (optional)
# Default: meta-llama/llama-4-maverick:free
# Other free options:
# - meta-llama/llama-4-scout:free
# - moonshotai/kimi-vl-a3b-thinking:free
# Paid options (better quality):
# - openai/gpt-3.5-turbo
# - anthropic/claude-3-haiku
# - mistralai/mixtral-8x7b-instruct
AI_MODEL=meta-llama/llama-4-maverick:free

# Development redirect URL for email verification
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

### Getting API Keys

#### OpenRouter API Key (Free)
1. Go to [OpenRouter](https://openrouter.ai/)
2. Sign up for a free account
3. Navigate to [API Keys](https://openrouter.ai/keys)
4. Create a new API key
5. Add it to your `.env.local` as `OPENROUTER_API_KEY`

**Free Models Available (2025):**
- `meta-llama/llama-4-maverick:free` (recommended, default - best for general tasks)
- `meta-llama/llama-4-scout:free` (good alternative)
- `moonshotai/kimi-vl-a3b-thinking:free` (supports vision and reasoning tasks)

**Note:** Free models have rate limits. For production use, consider paid models for better reliability and quality.

#### Supabase Setup
1. Go to [Supabase](https://supabase.com/)
2. Create a new project (free tier available)
3. Get your project URL and anon key from Settings > API
4. Run the SQL scripts in the `scripts` folder to set up the database

### Installation

\`\`\`bash
# Install dependencies
npm install

# Run database migrations
# Execute the SQL scripts in /scripts folder in your Supabase SQL editor

# Start development server
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the app.

### Database Setup

Run these SQL scripts in your Supabase SQL editor (in order):

1. `scripts/001_create_generations_table.sql`
2. `scripts/002_create_profiles_table.sql`

These scripts will create the necessary tables and set up Row Level Security.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add all environment variables in Vercel project settings
4. Deploy!

### Environment Variables for Production

Make sure to add all the environment variables listed above in your Vercel project settings. For production, update `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` to your production URL.

## Customizing the AI Model

You can change the AI model by setting the `AI_MODEL` environment variable. Here are some options:

**Free Models (No cost):**
- `meta-llama/llama-4-maverick:free` - Best free option, good for general tasks
- `meta-llama/llama-4-scout:free` - Good alternative to Maverick
- `moonshotai/kimi-vl-a3b-thinking:free` - Supports vision and reasoning tasks

**Paid Models (Better quality):**
- `openai/gpt-3.5-turbo` - Reliable, fast, affordable (~$0.002/request)
- `anthropic/claude-3-haiku` - High quality, fast (~$0.003/request)
- `mistralai/mixtral-8x7b-instruct` - Excellent quality (~$0.005/request)
- `openai/gpt-4` - Best quality, slower, expensive (~$0.03/request)

Check [OpenRouter pricing](https://openrouter.ai/docs#models) for current rates.

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **AI:** OpenRouter API (multiple model support)
- **Deployment:** Vercel

## License

MIT
