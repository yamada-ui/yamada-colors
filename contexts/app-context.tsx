import { noop } from "@yamada-ui/react"
import {
  createContext,
  useMemo,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react"
import type { PropsWithChildren, FC } from "react"
import { CONSTANT } from "constant"
import type { ColorFormat } from "utils/color"
import { getCookie, setCookie } from "utils/storage"

type AppContext = {
  hex?: string | [string, string]
  format?: ColorFormat
  changeFormat: (format: ColorFormat) => void
}

const AppContext = createContext<AppContext>({
  hex: undefined,
  format: undefined,
  changeFormat: noop,
})

export type AppProviderProps = PropsWithChildren<{
  hex?: string | [string, string]
  format?: ColorFormat
}>

export const AppProvider: FC<AppProviderProps> = ({
  hex,
  format: formatProp,
  children,
}) => {
  const [format, setFormat] = useState<ColorFormat>(formatProp)

  const changeFormat = useCallback((format: ColorFormat) => {
    setFormat(format)
    setCookie(CONSTANT.STORAGE.FORMAT, format)
  }, [])

  useEffect(() => {
    const format = getCookie(document.cookie, CONSTANT.STORAGE.FORMAT, "hex")

    if (formatProp !== format) setFormat(format)
  }, [formatProp])

  const value = useMemo(
    () => ({ hex, format, changeFormat }),
    [hex, format, changeFormat],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const context = useContext(AppContext)

  return context
}
