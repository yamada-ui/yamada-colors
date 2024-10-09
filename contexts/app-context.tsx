import type { FC, PropsWithChildren } from "react"
import { noop } from "@yamada-ui/react"
import { CONSTANT } from "constant"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { deleteCookie, generateUUID, getCookie, setCookie } from "utils/storage"

interface AppContext {
  changeFormat: (format: ColorFormat) => void
  changePalette: (palette: ColorPalette) => void
  createPalette: (name: string) => void
  deletePalette: (uuid: string) => void
  format: ColorFormat
  palettes: ColorPalettes
  hex?: [string, string] | string
}

const AppContext = createContext<AppContext>({
  changeFormat: noop,
  changePalette: noop,
  createPalette: noop,
  deletePalette: noop,
  format: "hex",
  hex: undefined,
  palettes: [],
})

export interface AppProviderProps
  extends PropsWithChildren<{
    format?: ColorFormat
    hex?: [string, string] | string
    palettes?: ColorPalettes
  }> {}

export const AppProvider: FC<AppProviderProps> = ({
  children,
  format: formatProp = "hex",
  hex,
  palettes: palettesProp = [],
}) => {
  const [format, setFormat] = useState<ColorFormat>(formatProp)
  const [palettes, setPalettes] = useState<ColorPalettes>(palettesProp)

  const createPalette = useCallback((name: string) => {
    const uuid = generateUUID()
    const timestamp = Date.now()

    setCookie(
      `${CONSTANT.STORAGE.PALETTE}-${uuid}`,
      JSON.stringify({
        name: encodeURIComponent(name),
        colors: [],
        timestamp,
        uuid,
      }),
    )

    setPalettes((prev) => [
      {
        name,
        colors: [],
        timestamp,
        uuid,
      },
      ...prev,
    ])
  }, [])

  const changePalette = useCallback(
    ({ name, colors, timestamp, uuid }: ColorPalette) => {
      setCookie(
        `${CONSTANT.STORAGE.PALETTE}-${uuid}`,
        JSON.stringify({
          name: encodeURIComponent(name),
          colors,
          timestamp,
          uuid,
        }),
      )

      setPalettes((prev) =>
        prev.map((palette) =>
          palette.uuid === uuid ? { ...palette, name, colors } : palette,
        ),
      )
    },
    [],
  )

  const deletePalette = useCallback((uuid: string) => {
    deleteCookie(`${CONSTANT.STORAGE.PALETTE}-${uuid}`)

    setPalettes((prev) => prev.filter((palette) => palette.uuid !== uuid))
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
    () => ({
      changeFormat,
      changePalette,
      createPalette,
      deletePalette,
      format,
      hex,
      palettes,
    }),
    [
      hex,
      format,
      palettes,
      changeFormat,
      createPalette,
      changePalette,
      deletePalette,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const context = useContext(AppContext)

  return context
}
