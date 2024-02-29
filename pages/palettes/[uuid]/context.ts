import { createContext } from "@yamada-ui/react"
import type { Dispatch, SetStateAction } from "react"
import type { OrderColor, OrderColors } from "./index.page"

type PaletteContext = {
  tab: string
  uuid: string
  name: string
  colors: OrderColors
  timestamp: number
  setTab: Dispatch<SetStateAction<string>>
  setName: Dispatch<SetStateAction<string>>
  setColors: Dispatch<SetStateAction<OrderColors>>
}

export const [PaletteProvider, usePalette] = createContext<PaletteContext>()

type HexesContext = {
  onClone: (color: OrderColor) => void
  onEdit: (color: OrderColor) => void
  onDelete: (id: string) => void
}

export const [HexesProvider, useHexes] = createContext<HexesContext>()
