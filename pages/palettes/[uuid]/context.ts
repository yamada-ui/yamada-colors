import type { ColorMode } from "@yamada-ui/react"
import { createContext } from "@yamada-ui/react"
import type { Dispatch, MutableRefObject, SetStateAction } from "react"

type PaletteContext = {
  tab: string
  uuid: string
  name: string
  colors: ReorderColors
  colorMode: ColorMode
  timestamp: number
  setTab: Dispatch<SetStateAction<string>>
  setName: Dispatch<SetStateAction<string>>
  changeColors: (
    valOrFunc: SetStateAction<ReorderColors>,
    isRollback?: boolean,
  ) => void
  indexRef: MutableRefObject<number>
  colorsMapRef: MutableRefObject<ReorderColors[]>
}

export const [PaletteProvider, usePalette] = createContext<PaletteContext>()

type HexesContext = {
  colorMode: ColorMode
  toggleColorMode: () => void
  onClone: (color: ReorderColor) => void
  onEdit: (color: ReorderColor) => void
  onDelete: (id: string) => void
}

export const [HexesProvider, useHexes] = createContext<HexesContext>()
