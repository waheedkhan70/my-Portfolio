export const apiUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');

  if (baseUrl) {
    return `${baseUrl}/api${normalizedPath}`;
  }

  return `/api${normalizedPath}`;
};