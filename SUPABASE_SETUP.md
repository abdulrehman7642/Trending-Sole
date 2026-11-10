# Supabase setup

The existing Trending Sole Supabase project already contains the database objects and policies used by this app. Do not recreate them in that project: doing so may overwrite existing data or access rules.

## Application configuration

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in a local `.env` file. For Vercel, set the same variables in the project settings for each deployment environment you use, and redeploy after changing them. These values are included in the browser bundle: use only the project's publishable key, never a service-role key or a Resend key.

## Existing database and access

The app uses `products`, `product_ratings`, `newsletter_subscribers`, `admin_users`, `orders`, and `promotions`, plus the `product_rating_summary` view and `create_store_order` database function. The existing project has row-level security enabled on the six tables. Public access is limited to the existing catalog, ratings and newsletter policies; administrator operations use authenticated membership in `admin_users`. Order creation and tracking use the existing Edge Functions. Product uploads use the configured Storage bucket and admin upload policy.

To use a different or newly created Supabase project, first restore the existing project's complete schema, functions, Storage configuration, grants and RLS policies from a trusted backup or migrations. This repository does not currently contain a complete database migration history, so the frontend alone cannot safely create an equivalent database. Verify the copied policies and admin membership before using it with customer data. Do not grant public access to orders, subscribers, or admin-only operations. See [Supabase's RLS guide](https://supabase.com/docs/guides/database/postgres/row-level-security) and [Data API access guide](https://supabase.com/docs/guides/api/securing-your-api).

## Order services

The existing `place-order` and `track-order` Edge Functions must be deployed to the selected project. Configure order notification secrets in Supabase Edge Function secrets, not Vercel's public `VITE_` variables. The store-owner notification relies on the existing Resend configuration. A verified sending domain is needed for general production delivery.
