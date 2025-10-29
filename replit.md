# TikTok Live AI Host V6.2

## Overview
AI-powered Indonesian voice host for TikTok Live streams with natural speech, real-time chat interaction, and automated product showcases. Built with React, TypeScript, Express, and OpenAI APIs.

## Current State
✅ **Fully Functional MVP** - All core features implemented and tested
- Startup greeting plays automatically on load
- Voice testing with 6 different OpenAI voices
- TikTok Live connection with real-time chat monitoring
- AI responses in Indonesian with natural voice synthesis
- Product showcase with metadata extraction
- Subscription plans panel with token tracking
- Developer mode enabled for unlimited testing

## Recent Changes (2025-10-29)
- Implemented complete application with schema-first approach
- Built all React components with Material Design inspired UI
- Added Indonesian text preprocessing for natural speech
- Implemented real product metadata extraction from URLs
- Fixed audio streaming to use proper Node.js Buffer handling
- Added per-product loading states for better UX
- All features tested and working end-to-end

## Architecture

### Frontend (`client/`)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with Shadcn UI components
- **State Management**: React hooks with local state
- **Real-time**: Server-Sent Events (SSE) for live chat
- **Audio**: HTML5 Audio API for TTS playback

### Backend (`server/`)
- **Framework**: Express.js on Node.js
- **AI Integration**: OpenAI GPT-5 for chat, gpt-4o-mini-tts for voice
- **TikTok Integration**: tiktok-live-connector for live stream monitoring
- **Storage**: In-memory storage (MemStorage) for products and config
- **Real-time**: EventEmitter + SSE for broadcasting live events

### Key Files
- `shared/schema.ts` - TypeScript schemas for products, config, chat logs
- `server/routes.ts` - All API endpoints with Indonesian preprocessing
- `client/src/pages/Dashboard.tsx` - Main application page
- `client/src/components/` - Reusable UI components

## API Endpoints

### Audio
- `GET /api/startup` - Initial greeting audio (MP3)
- `POST /api/tts` - Text-to-speech generation
  - Body: `{text: string, voice: "nova"|"alloy"|"echo"|"coral"|"verse"|"flow"}`
  - Returns: MP3 audio stream

### TikTok Live
- `POST /api/live/start` - Connect to TikTok Live
  - Body: `{username: string}`
  - Starts SSE connection and event monitoring
- `GET /api/live/stream` - SSE endpoint for live events
  - Events: `say` (AI speech), `log` (status), `chat` (user messages)

### Products
- `POST /api/products` - Add product with metadata extraction
  - Body: `{id: number, url: string}`
  - Extracts: title, image, price, description from URL
- `GET /api/products` - Get all products

## Environment Variables
Required secrets (configured in Replit Secrets):
- `OPENAI_API_KEY` - OpenAI API key for GPT and TTS
- `TIKTOK_SESSION_ID` - TikTok session ID for live connection
- `SESSION_SECRET` - Express session secret (auto-generated)

## Features

### ✅ AI Voice Host
- Startup greeting: "Selamat datang kembali di live. Sistem host AI sudah aktif."
- Member join: "Halo, selamat datang @username di live kita."
- Chat responses: "@username bilang: [message]. [AI response]"
- Reconnect: "Sinyal stabil, live kembali tersambung."
- 6 voice options: Nova (default), Alloy, Echo, Coral, Verse, Flow

### ✅ Indonesian Text Processing
Automatic preprocessing for natural speech:
- `?` → ` ya?`
- `,` → `, ` (adds pause)
- Common English → Indonesian conversions
- Proper punctuation handling

### ✅ Live Control Panel
- TikTok username input
- Start/Stop live connection
- Status indicators: Idle, Connecting, Online, Reconnecting, Error
- Real-time status updates

### ✅ Chat Log
- Auto-scrolling message feed
- Message types: System, User, AI
- Timestamps in Indonesian format
- Username mentions with badges
- Beautiful empty state

### ✅ Product Showcase
- 10 product slots
- URL metadata extraction (title, image, price, description)
- Fallback to generated data if extraction fails
- Per-slot loading states
- Product cards with images and details
- View product links

### ✅ Idle Timer & Auto-Promotion
- 180-second idle timer
- Automatic product promotion when no chat activity
- Example: "Produk nomor 2 ini lagi banyak dicari. Cek keranjang kuning ya!"

### ✅ Subscription Plans
- Three tiers: Daily (200K tokens), Weekly (1M tokens), Monthly (4M tokens)
- Token usage tracking with progress bar
- Developer mode with unlimited tokens
- Visual plan comparison

## User Preferences
- Clean, modern Material Design inspired interface
- Information-dense dashboard layout
- Responsive design for all screen sizes
- Dark mode support (system preference)
- Consistent spacing and typography

## How to Use

### First Time Setup
1. Add secrets in Replit:
   - OPENAI_API_KEY: Your OpenAI API key
   - TIKTOK_SESSION_ID: Your TikTok session cookie
2. Run `npm run dev` (auto-starts on Replit)
3. Open preview - app loads with greeting

### Using the Application
1. **Test Voice**: Click any voice option, then "Test Voice" to hear sample
2. **Connect to Live**: Enter TikTok username, click "Start Live"
3. **Monitor Chat**: Watch chat log for real-time messages and AI responses
4. **Add Products**: Paste product URLs in showcase slots
5. **AI Auto-Promotion**: Products promoted automatically during idle periods

### TikTok Shop Guidelines
The AI follows TikTok Shop rules:
- Never mentions prices outside keranjang kuning (shopping cart)
- Directs technical questions to link bio
- Keeps responses short and friendly
- Adheres to platform policies

## Development

### Running Locally
```bash
npm install
npm run dev  # Starts Express + Vite on port 5000
```

### Project Structure
```
├── client/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Dashboard page
│   │   └── lib/           # Utilities
│   └── index.html
├── server/
│   ├── routes.ts          # API endpoints
│   ├── storage.ts         # Data storage
│   └── index.ts           # Express server
├── shared/
│   └── schema.ts          # TypeScript schemas
└── design_guidelines.md   # UI design system
```

### Adding New Features
1. Update `shared/schema.ts` with new types
2. Add storage methods in `server/storage.ts`
3. Create API routes in `server/routes.ts`
4. Build UI components in `client/src/components/`
5. Update `Dashboard.tsx` to integrate

## Testing
End-to-end tests verify:
- Startup greeting playback
- Voice option selection and testing
- Product addition with metadata
- UI responsiveness and styling
- No console errors

## Production Deployment
For 24/7 operation:
1. Switch to Always On hosting
2. Disable developer mode
3. Set up payment processing for subscriptions
4. Monitor token usage
5. Consider database migration for persistence

## Known Limitations
- In-memory storage (data lost on restart)
- Metadata extraction may fail for some URLs (uses fallbacks)
- TikTok session ID expires periodically
- Developer mode bypasses token limits

## Future Enhancements
- Persistent database for products and chat history
- Real payment integration for subscriptions
- Analytics dashboard for engagement metrics
- Custom AI personality settings
- Scheduled promotions
- Token usage alerts
