export function isSafeRedirect(url: string | null): url is string {
  return !!url && url.startsWith("/") && !url.startsWith("//")
}
