import { useEffect } from "react"
import { CONSTANT } from "constant"
import { getCookie, setCookie } from "utils/storage"

export type UseHistoryProps = { cookies: string; hex: string }

export const useHistory = ({ cookies, hex }: UseHistoryProps) => {
  useEffect(() => {
    const history = getCookie(cookies, CONSTANT.STORAGE.HISTORY, "[]")

    history.unshift(hex)

    const computedHistory = Array.from(new Set(history))

    setCookie(CONSTANT.STORAGE.HISTORY, JSON.stringify(computedHistory))
  }, [cookies, hex])
}
