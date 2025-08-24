@@ .. @@
-# NEI-VS AI Education Platform
+# NEI-VS AI Education Platform with Authentication
 
-An interactive AI education platform that makes machine learning concepts accessible through visualizations and hands-on experimentation.
+An interactive AI education platform that makes machine learning concepts accessible through visualizations and hands-on experimentation. Now featuring Google Sign-In authentication via Appwrite.
 
 ## Features
 
+### 🔐 Authentication & User Management
+- **Google Sign-In**: Secure OAuth2 authentication via Appwrite
+- **User Dashboard**: Personalized learning experience with progress tracking
+- **Protected Routes**: Secure access to premium features
+- **Session Management**: Persistent login state across browser sessions
+
 ### 🧠 Interactive AI Sandbox
 - **LLM Transformer Visualization**: Step-by-step breakdown of how language models work
 - **Real-time Processing**: Watch tokens flow through embeddings, attention, and generation
 - **Parameter Controls**: Adjust temperature, top-k, and other hyperparameters
 - **Multiple Visualizations**: Attention heatmaps, embedding projections, probability distributions
 
 ### 📚 Educational Content
 - **Guided Learning Paths**: Structured courses from basics to advanced topics
 - **Interactive Tutorials**: Hands-on lessons with immediate feedback
 - **Visual Explanations**: Complex concepts made simple through animations
 
 ### 🎯 Model Types Supported
 - Large Language Models (LLMs/Transformers)
 - Convolutional Neural Networks (CNNs)
 - Recurrent Neural Networks (RNNs)
 - Classical Machine Learning
 - Reinforcement Learning
 - Graph Neural Networks
 
+## Quick Start
+
+### Prerequisites
+- Node.js 18+ and npm
+- Appwrite account (free at https://appwrite.io)
+- Google Cloud Console project with OAuth2 configured
+- Gemini API key (optional, for enhanced LLM features)
+
+### Environment Setup
+
+1. **Clone and install dependencies**:
+```bash
+git clone <your-repo-url>
+cd neivs-platform
+npm install
+```
+
+2. **Configure environment variables**:
+```bash
+cp .env.example .env.local
+```
+
+Edit `.env.local` with your credentials:
+```env
+VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
+VITE_APPWRITE_PROJECT_ID=68aae65f003b57c70a64
+VITE_GEMINI_API_KEY=your_gemini_api_key_here
+```
+
+3. **Configure Appwrite OAuth2**:
+   - Go to https://fra.cloud.appwrite.io/console
+   - Select project "NEIVS" (ID: `68aae65f003b57c70a64`)
+   - Navigate to **Auth > Settings > OAuth2 Providers**
+   - Enable "Google" provider
+   - Add your Google OAuth2 Client ID
+   - Set redirect URI to: `https://neivs.vercel.app/` (or your domain)
+   - Set success URL to: `https://neivs.vercel.app/dashboard`
+
+4. **Configure Google OAuth2**:
+   - Go to https://console.cloud.google.com/apis/credentials
+   - Create or select your OAuth2 Client ID
+   - Add authorized redirect URIs:
+     - `https://fra.cloud.appwrite.io/v1/account/sessions/oauth2/callback/google/68aae65f003b57c70a64`
+     - `https://neivs.vercel.app/`
+
+5. **Start development server**:
+```bash
+npm run dev
+```
+
+### Deployment
+
+**Deploy to Vercel**:
+```bash
+npm run build
+vercel --prod
+```
+
+**Environment Variables in Vercel**:
+- Add all environment variables from `.env.local` to your Vercel project settings
+- Ensure redirect URIs match your production domain
+
 ## Technology Stack
 
+### Frontend
 - **React 18** with TypeScript
 - **Vite** for fast development and building
 - **Tailwind CSS** for styling
 - **Framer Motion** for animations
 - **Lucide React** for icons
 - **Zustand** for state management
 
+### Backend & Authentication
+- **Appwrite** for authentication and user management
+- **Google OAuth2** for secure sign-in
+- **Vercel** for hosting and deployment
+
+### AI & Visualization
 - **Google Gemini API** for LLM inference
 - **Custom Transformer Implementation** for educational purposes
 - **WebGL/Canvas** for high-performance visualizations
 - **Web Workers** for background processing
 
+## User Flow
+
+1. **Landing Page**: Users see the marketing page with feature highlights
+2. **Sign In**: Click "Sign In with Google" → Appwrite OAuth2 flow
+3. **Dashboard**: Authenticated users land on personalized dashboard
+4. **Sandbox Access**: Full access to interactive AI tools and visualizations
+5. **Learning Tracks**: Structured courses and tutorials
+6. **Progress Tracking**: Personal learning analytics and achievements
+
+## Architecture Overview
+
+### Authentication Flow
+```
+User → Landing Page → Google OAuth2 → Appwrite → Dashboard → Sandbox
+```
+
+### Component Structure
+```
+src/
+├── components/
+│   ├── auth/           # Authentication components
+│   ├── landing/        # Landing page sections
+│   ├── sandbox/        # AI sandbox components
+│   └── Dashboard.tsx   # User dashboard
+├── lib/
+│   ├── appwrite.ts     # Appwrite client setup
+│   ├── gemini.ts       # Gemini API integration
+│   └── tiny-transformer.ts # Educational transformer
+└── store/
+    ├── useAuthStore.ts # Authentication state
+    └── useSandboxStore.ts # Sandbox state
+```
+
 ## Development
 
-### Prerequisites
-- Node.js 18+
-- npm or yarn
+### Local Development
+```bash
+# Install dependencies
+npm install
 
-### Setup
-1. Clone the repository
-2. Install dependencies: `npm install`
-3. Create `.env.local` with your Gemini API key:
-   ```
-   VITE_GEMINI_API_KEY=your_api_key_here
-   ```
-4. Start development server: `npm run dev`
+# Start development server
+npm run dev
+
+# Build for production
+npm run build
+
+# Preview production build
+npm run preview
+```
+
+### Testing Authentication
+1. Ensure Appwrite project is configured correctly
+2. Test Google OAuth2 flow in development
+3. Verify redirect URIs match your local/production domains
+4. Check browser console for any authentication errors
 
 ### Key Components
 
+- **LandingPage**: Marketing page with sign-in flow
+- **Dashboard**: Authenticated user home page
+- **ProtectedRoute**: HOC for securing components
 - **LLMSandbox**: Interactive transformer visualization
 - **Controls**: Parameter adjustment interface
 - **Heatmap**: Attention pattern visualization
 - **EmbeddingProjector**: High-dimensional vector visualization
 - **ProbBar**: Token probability distribution
 
+## Troubleshooting
+
+### Common Issues
+
+**OAuth2 Redirect Mismatch**:
+- Ensure redirect URIs in Google Console match Appwrite configuration
+- Check that success URL points to `/dashboard`
+
+**Appwrite Connection Issues**:
+- Verify project ID and endpoint in environment variables
+- Check Appwrite console for project status
+
+**Authentication State Issues**:
+- Clear browser localStorage and cookies
+- Check network tab for failed API calls
+
+### Debug Mode
+Enable debug logging by adding to `.env.local`:
+```env
+VITE_DEBUG=true
+```
+
 ## Contributing
 
 1. Fork the repository
 2. Create a feature branch
 3. Make your changes
 4. Add tests if applicable
 5. Submit a pull request
 
+## Security
+
+- All authentication is handled server-side by Appwrite
+- OAuth2 tokens are never exposed to client-side JavaScript
+- HTTPS enforced in production
+- CORS properly configured for API endpoints
+
 ## License
 
 MIT License - see LICENSE file for details.
 
+## Support
+
+- **Documentation**: [Appwrite Docs](https://appwrite.io/docs)
+- **Community**: [Discord](https://discord.gg/appwrite)
+- **Issues**: GitHub Issues for bug reports and feature requests
+
 ---
 
-Built with ❤️ for AI education. Navigate • Explain • Interact • Visualize • Simulate.
+Built with ❤️ for AI education. Navigate • Explain • Interact • Visualize • Simulate.
+
+**Live Demo**: https://neivs.vercel.app/