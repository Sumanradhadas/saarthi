
# SAARthi - Smart AI Test & Learning Companion

SAARthi is an intelligent learning platform designed to help nursing students practice and prepare for their Pharmacology, Pathology, and Genetics exams. The application provides an interactive testing environment with AI-powered feedback and analysis.

## Features

- **Interactive MCQ Testing**: Practice multiple-choice questions with instant AI feedback
- **Handwritten Answer Analysis**: Upload images of handwritten answers for AI evaluation
- **Smart Grading**: AI-powered assessment using Google Gemini and OCR.space
- **Progress Tracking**: Monitor your learning progress with detailed analytics
- **Mobile Responsive**: Optimized for both desktop and mobile devices
- **Real-time Feedback**: Get instant, personalized feedback on your answers

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Shadcn/ui** components
- **TanStack React Query** for state management

### Backend
- **Node.js** with Express.js
- **TypeScript** with ES modules
- **PostgreSQL** with Drizzle ORM
- **Multer** for file uploads

### AI Services
- **Google Gemini AI** for text analysis and MCQ feedback
- **OCR.space API** for handwritten text extraction

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Google Gemini API key
- OCR.space API key (optional, has fallback)

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=your_postgresql_database_url

# AI Services
GEMINI_API_KEY=your_google_gemini_api_key
GOOGLE_AI_API_KEY=your_google_ai_api_key

# OCR Service (optional)
OCR_SPACE_API_KEY=your_ocr_space_api_key

# Application
PORT=5000
NODE_ENV=production
```

## Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd saarthi
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your actual values
```

4. **Set up the database**
```bash
npm run db:push
```

## Development

1. **Start the development server**
```bash
npm run dev
```

2. **Access the application**
   - Open http://localhost:5000 in your browser
   - The app runs both frontend and backend on the same port

## Production Deployment

### Build the application
```bash
npm run build
```

### Start production server
```bash
npm start
```

## Deployment Platforms

### Deploy on Render

1. **Connect your GitHub repository** to Render
2. **Create a new Web Service**
3. **Configure build and start commands**:
   - Build Command: `npm run build`
   - Start Command: `npm start`
4. **Add environment variables** in Render dashboard
5. **Deploy**

### Deploy on Railway

1. **Connect your GitHub repository** to Railway
2. **Configure deployment**:
   - Build Command: `npm run build`
   - Start Command: `npm start`
3. **Add environment variables**
4. **Deploy**

### Deploy on Vercel

1. **Connect your GitHub repository** to Vercel
2. **Configure build settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
3. **Add environment variables**
4. **Deploy**

### Deploy on Heroku

1. **Create a new Heroku app**
2. **Connect your GitHub repository**
3. **Add environment variables** in Heroku Config Vars
4. **Deploy from GitHub**

## Project Structure

```
saarthi/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utilities
│   │   └── types/          # TypeScript types
│   └── index.html
├── server/                 # Express backend
│   ├── services/           # Business logic
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   └── storage.ts         # Data layer
├── shared/                 # Shared types and schemas
├── .env.example           # Environment variables template
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## API Endpoints

- `POST /api/sessions` - Create a new test session
- `POST /api/questions/:id/submit` - Submit an answer
- `POST /api/upload` - Upload images for analysis

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - Type check
- `npm run db:push` - Push database schema

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@saarthi.com or open an issue in the repository.
