# Testing Guide for AlphaBrain AI Recommendations Feature

This guide will help you test the AI recommendations feature to ensure it's working correctly.

## Prerequisites

- Backend server running on port 8082 (configured in application.properties)
- Frontend server running (likely on port 5174)

## Test Steps

### 1. Basic Navigation Test

1. **Open the application** in your browser (http://localhost:5174)
2. **Login** with your test credentials
3. **Verify** that the "AI Recommendations" link appears in the navigation sidebar with a brain icon
4. **Click** on the "AI Recommendations" link
5. **Verify** that you're taken to the AI Recommendations page

### 2. UI Components Test

1. **Check** that the page title "AI Recommendations" is displayed
2. **Verify** that there are three tabs:
   - Learning Paths
   - Roadmap
   - Next Steps
3. **Click** on each tab to confirm they change the content area
4. **Verify** that the UI is responsive and adapts to different screen sizes

### 3. API Integration Test

1. **Open Chrome DevTools** (F12 or right-click → Inspect)
2. **Go to the Network tab**
3. **Reload** the AI Recommendations page
4. **Look for API calls** to the following endpoints:
   - `/api/ai/learning-path`
   - `/api/ai/roadmap`
   - `/api/ai/next-steps`
5. **Check the responses** to see if they're returning valid data

### 4. Mock Data Fallback Test

1. **Temporarily** disconnect from the internet or stop the backend server
2. **Reload** the AI Recommendations page
3. **Verify** that "demo data" is shown with a notification banner
4. **Check** that all three tabs show mock data
5. **Reconnect** to internet or restart the backend
6. **Click** "Retry" to test fetching real data

### 5. Redux Integration Test

1. **Navigate** to the Debug page (/debug)
2. **Check** the Redux store for the aiRecommendations slice
3. **Verify** the structure matches what's expected:
   - learningPaths array
   - roadmap object
   - nextSteps array
   - loading boolean
   - error string

## Troubleshooting Common Issues

### Backend Connection Issues

- Verify the backend is running on port 8082
- Check for CORS errors in browser console
- Ensure JWT token is valid for authenticated requests

### Frontend Rendering Issues

- Check for JavaScript errors in browser console
- Verify all required UI components are imported
- Check that the Redux store is properly configured

### Data Display Issues

- Examine the API responses in Network tab
- Check that data types match expected interfaces
- Verify mock data fallback is working properly

## Next Steps After Testing

Once you've verified the basic functionality, consider these enhancements:

1. Add better error handling and user feedback
2. Implement a more visually appealing roadmap visualization
3. Add user interactions like marking items complete
4. Integrate more deeply with the learning analytics 