export const getCookie = (
  cookie: string,
  key: string,
  fallback: string = "{}",
) => {
  const match = cookie.match(new RegExp(`(^| )${key}=([^;]+)`))
  const value = match?.[2] ?? fallback

  return /^\{.*\}$|^\[.*\]$/.test(value)
    ? JSON.parse(match?.[2] ?? fallback)
    : value
}

export const setCookie = (key: string, value: string) => {
  document.cookie = `${key}=${value}; max-age=31536000; path=/`
}
