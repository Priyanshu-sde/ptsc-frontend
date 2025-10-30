# Quick Start Guide

## Installation Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

   If you encounter peer dependency issues with React 19, use:
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to `http://localhost:5173`

## Project Overview

### ✅ Completed Features

#### Pages (9 total)
- ✅ **Landing Page** - Hero section with typewriter effect, stats, features
- ✅ **Events Page** - Upcoming/Past events with tabs
- ✅ **Leaderboard Page** - Rankings with charts and pagination
- ✅ **Team Page** - Member cards categorized by role
- ✅ **Media Gallery** - Masonry grid with modal preview
- ✅ **Contact Page** - Form, map, and social links
- ✅ **Login Page** - Admin authentication
- ✅ **Dashboard Page** - Admin panel with user approvals
- ✅ **404 Page** - Not found page

#### Components (8 total)
- ✅ **Navbar** - Responsive navigation with auth state
- ✅ **Footer** - Links, contact info, socials
- ✅ **EventCard** - Event display with registration
- ✅ **MemberCard** - Team member showcase
- ✅ **MediaCard** - Gallery item with modal
- ✅ **LeaderboardTable** - Rankings table with badges
- ✅ **Loader** - Loading states and skeletons
- ✅ **ProtectedRoute** - Auth guard for admin routes

#### Utilities
- ✅ **api.js** - Axios instance with credentials
- ✅ **auth.js** - Authentication helpers

### 🎨 Design Features
- Glassmorphism effects
- Gradient backgrounds
- Smooth animations with Framer Motion
- Custom scrollbar
- Responsive mobile-first design
- Dark theme with neon accents

### 🔌 API Integration
All pages are connected to the backend API:
- Events fetching
- Leaderboard with pagination
- Team members display
- Media gallery
- User approval system
- Leaderboard refresh controls

### 🔐 Authentication
- JWT-based with HTTP-only cookies
- Protected admin dashboard
- Login/Logout functionality
- Role-based access control

## File Structure

```
src/
├── components/
│   ├── EventCard.jsx
│   ├── Footer.jsx
│   ├── LeaderboardTable.jsx
│   ├── Loader.jsx
│   ├── MediaCard.jsx
│   ├── MemberCard.jsx
│   ├── Navbar.jsx
│   └── ProtectedRoute.jsx
├── pages/
│   ├── Contact.jsx
│   ├── Dashboard.jsx
│   ├── Events.jsx
│   ├── Landing.jsx
│   ├── Leaderboard.jsx
│   ├── Login.jsx
│   ├── Media.jsx
│   ├── NotFound.jsx
│   └── Team.jsx
├── utils/
│   ├── api.js
│   └── auth.js
├── App.jsx
└── main.jsx
```

## Routes

- `/` - Landing page
- `/events` - Events listing
- `/leaderboard` - Competitive programming rankings
- `/team` - Team members
- `/media` - Media gallery
- `/contact` - Contact form
- `/login` - Admin login
- `/dashboard` - Admin dashboard (protected)

## Troubleshooting

### Dependency Issues
If you see React 19 peer dependency warnings:
```bash
npm install --legacy-peer-deps
```

### API Connection
The app connects to: `https://programming-club-website.onrender.com`

If you need to change the API URL, edit `src/utils/api.js`:
```javascript
export const BASE_URL = 'your-api-url';
```

### Build for Production
```bash
npm run build
```
Output will be in the `dist/` folder.

### Deploy
Deploy the `dist/` folder to:
- Netlify
- Vercel
- Any static hosting service

## Next Steps

1. Install dependencies with `npm install --legacy-peer-deps`
2. Run `npm run dev` to start the development server
3. Test all pages and features
4. Customize colors in `tailwind.config.js` if needed
5. Update social media links in Footer and Contact pages
6. Add real Google Maps embed URL in Contact page
7. Build and deploy to production

## Support

For issues or questions, contact: ptsc@knit.ac.in

---

Made with ❤️ by PTSC Team
