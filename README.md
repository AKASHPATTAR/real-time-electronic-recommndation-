# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Deployment

### Environment Variables
The application requires the following environment variables to be set:

```env
VITE_GOOGLE_API_KEY=your_google_api_key
VITE_API_URL=your_backend_url
VITE_RECOMMENDATION_URL=your_recommendation_service_url
PORT=5174
```
### Deploying on Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard:
   - Go to Project Settings > Environment Variables
   - Add all required variables
   - Use production URLs for API endpoints
   - Set a production Google API key

### Deploying on Render
1. Push your code to GitHub
2. Create a new Web Service in Render
3. Connect your repository
4. Configure environment variables:
   - Go to Environment tab
   - Add all required variables
   - Use production URLs for API endpoints
   - Set a production Google API key

### Important Notes
- Never commit `.env` files to version control
- Use different API keys for development and production
- Update API URLs to match your deployed backend services
- Make sure CORS is properly configured in your backend services
