export function getSafeRedirectUrl(url: string | null | undefined): string {
  if (!url) return "/internal";
  
  // Must start with /internal and must not start with // (protocol-relative)
  if (url.startsWith("/internal") && !url.startsWith("//")) {
    return url;
  }
  
  return "/internal";
}
