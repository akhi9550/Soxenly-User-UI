/**
 * Resolves an image URL safely.
 * Works seamlessly with local public assets (like /socks/...), external URLs,
 * and remote backend uploads.
 */
export function getImageUrl(path) {
  if (!path) return "/assets/hero.png";
  if (typeof path !== "string") return "/assets/hero.png";

  // External URLs or inline data URIs
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }

  // Local assets served directly from /public (e.g. /socks/..., /images/..., /logo.png)
  if (path.startsWith("/")) {
    return path;
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
  if (!baseUrl) {
    return `/${path}`;
  }

  if (path.includes("uploads/")) {
    const clean = path.replace(/^\//, "");
    return `${baseUrl}/${clean}`;
  }

  return `${baseUrl}/${path.replace(/^\//, "")}`;
}

export default getImageUrl;
