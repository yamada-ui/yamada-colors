import type { ColorMode } from "@yamada-ui/react"
import type { Dispatch, MutableRefObject, SetStateAction } from "react"
import { createContext } from "@yamada-ui/react"

export interface PaletteContext {
  name: string
  changeColors: (
    valOrFunc: SetStateAction<ReorderColors>,
    isRollback?: boolean,
  ) => void
  colorMode: ColorMode
  colors: ReorderColors
  colorsMapRef: MutableRefObject<ReorderColors[]>
  indexRef: MutableRefObject<number>
  setName: Dispatch<SetStateAction<string>>
  setTab: Dispatch<SetStateAction<string>>
  tab: string
  timestamp: number
  uuid: string
}

export const [PaletteProvider, usePalette] = createContext<PaletteContext>({
  name: "PaletteContext",
})

export interface HexesContext {
  colorMode: ColorMode
  toggleColorMode: () => void
  onClone: (color: ReorderColor) => void
  onDelete: (id: string) => void
  onEdit: (color: ReorderColor) => void
}

export const [HexesProvider, useHexes] = createContext<HexesContext>({
  name: "HexesContext",
})

export interface HexContext extends ReorderColor {}

export const [HexProvider, useHex] = createContext<HexContext>({
  name: "HexContext",
})
