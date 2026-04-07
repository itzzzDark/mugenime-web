# MugeAnime Database Migration - Deployment Guide

This guide covers the deployment and testing of the database-driven anime management system.

## Prerequisites

- Supabase project setup with environment variables configured
- Next.js 16+ installed and running locally

## Environment Variables

Ensure these are set in your project:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Setup (Already Completed)

The database schema has been created with:
- Users table with role-based access (admin, editor, viewer, user)
- Animes table with full metadata
- Episodes table with episode details
- Genres table and anime_genres junction table
- Download links and streaming links tables
- Analytics and audit logs tables
- Row Level Security (RLS) policies enabled

## Testing Checklist

### 1. Public Pages Testing

- [ ] Home page loads with database animes (ongoing/completed)
- [ ] List anime page shows all animes sorted alphabetically
- [ ] Ongoing anime page displays with pagination
- [ ] Completed anime page displays with pagination
- [ ] Anime cards show correct data from database

### 2. Authentication Testing

- [ ] Admin login page accessible at `/auth/login`
- [ ] Login with test credentials works
- [ ] Invalid credentials show error message
- [ ] Successful login redirects to `/admin`

### 3. Admin Dashboard Testing

- [ ] Admin dashboard displays statistics
- [ ] Dashboard shows anime, episode, user, and view counts
- [ ] Sidebar navigation shows role-appropriate menu items
- [ ] User profile dropdown appears in header

### 4. Anime Management Testing

- [ ] Navigate to `/admin/animes`
- [ ] View list of all animes from database
- [ ] Click "Add Anime" button
- [ ] Fill out anime form and submit
- [ ] New anime appears in list
- [ ] Edit anime - update details and save
- [ ] Delete anime - confirm deletion
- [ ] Verify changes reflected in database

### 5. Other Admin Sections Testing

- [ ] Genres management (`/admin/genres`)
- [ ] Episodes management (`/admin/episodes`)
- [ ] Download links management (`/admin/downloads`)
- [ ] Users list (`/admin/users`) - admin only
- [ ] Analytics dashboard (`/admin/analytics`) - admin only

### 6. Role-Based Access Testing

- [ ] Admin user can access all admin pages
- [ ] Editor user can access animes, episodes, genres, downloads
- [ ] Editor cannot access users or analytics
- [ ] Regular users redirected from admin routes
- [ ] Non-authenticated users redirected to login

## Initial Data Setup

To populate your database with initial anime data:

1. Login to admin dashboard
2. Navigate to Animes section
3. Create sample anime entries manually OR
4. Use the admin API to bulk import data

### Sample Anime Entry

```json
{
  "title": "Example Anime",
  "slug": "example-anime",
  "japanese_title": "サンプルアニメ",
  "synopsis": "An amazing anime series",
  "poster_url": "https://example.com/poster.jpg",
  "banner_url": "https://example.com/banner.jpg",
  "status": "ongoing",
  "type": "TV",
  "episodes_count": 12,
  "score": 8.5,
  "year": 2024,
  "season": "Spring",
  "duration": 24,
  "studios": "Studio A, Studio B",
  "is_featured": true
}
```

## Deployment Steps

### 1. Local Testing

```bash
# Install dependencies
npm install  # or pnpm install

# Run development server
npm run dev

# Test all pages and admin functionality
```

### 2. Vercel Deployment

```bash
# Push to GitHub branch
git add .
git commit -m "feat: database migration complete"
git push origin your-branch

# Deploy to Vercel (automatic on push or manual via Vercel dashboard)
```

### 3. Post-Deployment Verification

- [ ] Home page loads correctly
- [ ] Admin login works
- [ ] Admin dashboard accessible
- [ ] Database queries return data
- [ ] Analytics tracking works
- [ ] Audit logs record changes

## Troubleshooting

### Issue: "Missing environment variables"

**Solution**: Ensure Supabase environment variables are set in Vercel project settings.

### Issue: "Unauthorized" on admin pages

**Solution**: Check user role in database. Ensure user has admin or editor role.

### Issue: "RLS policy violation"

**Solution**: Verify RLS policies are correctly applied. Check user authentication status.

### Issue: Cards showing undefined data

**Solution**: Ensure anime data has all required fields. Check data structure matches expected format.

## API Endpoints

All endpoints require authentication via Supabase session:

- `GET /api/animes` - Fetch all active animes
- `POST /api/animes` - Create new anime (admin/editor)
- `PUT /api/animes/[id]` - Update anime (admin/editor)
- `DELETE /api/animes/[id]` - Delete anime (admin only)
- `GET /api/genres` - Fetch all genres
- `GET /api/episodes?animeId=[id]` - Fetch episodes
- `GET /api/download-links?episodeId=[id]` - Fetch download links

## Performance Optimization

- Database queries cached with `revalidate` tags
- RLS policies prevent unauthorized data access
- Indexes created on frequently queried columns
- Pagination implemented to handle large datasets

## Next Steps

1. Create admin user account
2. Populate database with anime data
3. Test all CRUD operations
4. Configure analytics tracking
5. Monitor audit logs
6. Deploy to production

## Support

For issues or questions, refer to:
- Supabase documentation: https://supabase.com/docs
- Next.js documentation: https://nextjs.org/docs
- Database schema in `/scripts/setup-database.sql`
