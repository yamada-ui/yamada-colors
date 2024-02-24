export const getCookie = <T extends any>(
  cookie: string,
  key: string,
  fallback: string = "{}",
) => {
  const match = cookie.match(new RegExp(`(^| )${key}=([^;]+)`))
  const value = match?.[2] ?? fallback

  return (
    /^\{.*\}$|^\[.*\]$/.test(value) ? JSON.parse(match?.[2] ?? fallback) : value
  ) as T
}

export const setCookie = (key: string, value: string) => {
  document.cookie = `${key}=${value}; max-age=31536000; path=/`
}

export const generateUUID = () => {
  const chunk = () => Math.random().toString(36).substring(2, 6)

  return `${chunk()}-${chunk()}-${chunk()}-${chunk()}`
}
