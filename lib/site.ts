/** Single source of truth for the deployed site URL (set NEXT_PUBLIC_SITE_URL in prod). */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://muhammad-hammad.vercel.app";
