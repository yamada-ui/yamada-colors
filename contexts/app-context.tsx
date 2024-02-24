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
import { generateUUID, getCookie, setCookie } from "utils/storage"

type AppContext = {
  hex?: string | [string, string]
  format?: ColorFormat
  palettes: ColorPalettes
  changeFormat: (format: ColorFormat) => void
  createPalette: (name: string) => void
}

const AppContext = createContext<AppContext>({
  hex: undefined,
  format: undefined,
  palettes: [],
  changeFormat: noop,
  createPalette: noop,
})

export type AppProviderProps = PropsWithChildren<{
  hex?: string | [string, string]
  format?: ColorFormat
  palettes?: ColorPalettes
}>

export const AppProvider: FC<AppProviderProps> = ({
  hex,
  format: formatProp,
  palettes: palettesProp = [],
  children,
}) => {
  const [format, setFormat] = useState<ColorFormat>(formatProp)
  const [palettes, setPalettes] = useState<ColorPalettes>(palettesProp)

  const createPalette = useCallback((name: string) => {
    const uuid = generateUUID()

    const palette: ColorPalette = {
      uuid,
      name,
      colors: [],
    }

    setCookie(`${CONSTANT.STORAGE.PALETTE}-${uuid}`, JSON.stringify(palette))

    setPalettes((prev) => [palette, ...prev])
  }, [])

  const changeFormat = useCallback((format: ColorFormat) => {
    setFormat(format)
    setCookie(CONSTANT.STORAGE.FORMAT, format)
  }, [])

  useEffect(() => {
    const format = getCookie<ColorFormat>(
      document.cookie,
      CONSTANT.STORAGE.FORMAT,
      "hex",
    )

    if (formatProp !== format) setFormat(format)
  }, [formatProp])

  const value = useMemo(
    () => ({ hex, format, palettes, changeFormat, createPalette }),
    [hex, format, palettes, changeFormat, createPalette],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const context = useContext(AppContext)

  return context
}
