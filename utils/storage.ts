export const getCookie = <T>(
  cookie: string,
  key: string,
  fallback: any = "{}",
) => {
  const match = cookie.match(new RegExp(`(^| )${key}=([^;]+)`))
  const value = match?.[2] ?? fallback

  return (
    /^\{.*\}$|^\[.*\]$/.test(value) ? JSON.parse(match?.[2] ?? fallback) : value
  ) as T
}

export const getCookies = <T>(cookie: string, reg: RegExp) => {
  const matches = [
    ...cookie.matchAll(new RegExp(`(?:^| )(${reg.source})=([^;]+)`, "g")),
  ]

  return matches.map((match) => JSON.parse(match[2]!)) as T[]
}

export const setCookie = (key: string, value: string) => {
  document.cookie = `${key}=${value}; max-age=31536000; path=/`
}

export const deleteCookie = (key: string) => {
  document.cookie = `${key}=; max-age=0; path=/`
}

export const generateUUID = () => {
  const chunk = () => Math.random().toString(36).substring(2, 6)

  return `${chunk()}-${chunk()}-${chunk()}-${chunk()}`
}
