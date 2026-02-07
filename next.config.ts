import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "*.supabase.co" },
      { hostname: "images.unsplash.com" },
      { hostname: "i.pravatar.cc" },
    ],
  },
  typescript: {
    // Temporarily ignore build errors until Supabase types are generated
    // Run: npx supabase gen types typescript --project-id YOUR_ID > src/types/database.types.ts
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
