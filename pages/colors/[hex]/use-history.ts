import { CONSTANT } from "constant"
import { useEffect } from "react"
import { getCookie, setCookie } from "utils/storage"

export interface UseHistoryProps {
  cookies: string
  hex: string
}

export const useHistory = ({ cookies, hex }: UseHistoryProps) => {
  useEffect(() => {
    const history = getCookie<string[]>(cookies, CONSTANT.STORAGE.HISTORY, "[]")

    history.unshift(hex)

    const omittedHistory = history.slice(0, 100)
    const computedHistory = Array.from(new Set(omittedHistory))

    setCookie(CONSTANT.STORAGE.HISTORY, JSON.stringify(computedHistory))
  }, [cookies, hex])
}
