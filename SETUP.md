# Oyero Ibrahim — Portfolio setup

Includes a responsive Next.js portfolio, two project categories, a Supabase-powered admin dashboard, project create/edit/delete, multi-file image/video upload, and editable contact/social links.

## 1. Create Supabase backend (free tier, usage limits apply)
1. Create a project at https://supabase.com.
2. Open SQL Editor, paste all of `supabase/schema.sql`, and run it.
3. Open Authentication → Users and create your own email/password account. Confirm the email if required.
4. Copy that user's UUID. In SQL Editor run `insert into public.admin_users(user_id) values('PASTE-THE-UUID-HERE');`.
5. In Project Settings → API, copy the Project URL and publishable/anon key. Never use a service-role/secret key in browser variables.

## 2. Set environment variables
Copy `.env.example` to `.env.local` and replace placeholders:
```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
```
Keep `.env.local` private and do not upload it to GitHub.

## 3. Run locally (optional)
Install Node.js LTS from https://nodejs.org, then in this project folder:
```
npm install
npm run dev
```
Visit http://localhost:3000 and http://localhost:3000/admin.

## 4. Deploy free
1. Create a GitHub repository and upload the project files (not `.env.local`).
2. Sign in to https://vercel.com using GitHub and import the repository.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel project Environment Variables.
4. Deploy. Your site gets a `*.vercel.app` URL; `/admin` is the private login page.

## 5. Add your projects and contact details
Sign in at `/admin`. Add title, category, summary, description, cover URL, and extra media URLs, or upload multiple image/video files. Save/publish. Update email, WhatsApp (include country code; Nigeria format e.g. 2348012345678, without leading 0), and social profile URLs in the Contact form.

## Notes
- Replace the three demo cards with accurate descriptions and your actual project media before promoting the site.
- Public portfolio content and uploaded media are public. Do not upload private client files.
- Storage has a 100 MiB per-file cap in this starter; compress video or use a hosted video URL for larger files.
- Removing a project/media link does not automatically delete its old file from Storage; clean up unused files in Supabase manually.
- Free hosting/database/storage tiers have quotas and provider terms can change. A custom domain is optional.
