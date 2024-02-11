export const getCookie = (
  cookie: string,
  key: string,
  fallback: string = "{}",
) => {
  const match = cookie.match(new RegExp(`(^| )${key}=([^;]+)`))

  return JSON.parse(match?.[2] ?? fallback)
}

export const setCookie = (key: string, value: string) => {
  document.cookie = `${key}=${value}; max-age=31536000; path=/`
}
