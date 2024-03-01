import { createContext } from "@yamada-ui/react"
import type { Dispatch, SetStateAction } from "react"

type PaletteContext = {
  tab: string
  uuid: string
  name: string
  colors: ReorderColors
  timestamp: number
  setTab: Dispatch<SetStateAction<string>>
  setName: Dispatch<SetStateAction<string>>
  setColors: Dispatch<SetStateAction<ReorderColors>>
}

export const [PaletteProvider, usePalette] = createContext<PaletteContext>()

type HexesContext = {
  onClone: (color: ReorderColor) => void
  onEdit: (color: ReorderColor) => void
  onDelete: (id: string) => void
}

export const [HexesProvider, useHexes] = createContext<HexesContext>()
