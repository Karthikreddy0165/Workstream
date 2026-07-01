export function getApiUrl(path) {
  // If we are on the client, relative URLs are fine
  if (typeof window !== "undefined") {
    return path;
  }
  
  // Server-side (during build/ISR/SSR)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                  (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : "http://localhost:3000");
                  
  // Normalize slash paths
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}
