import { createContext, useMemo, useContext } from "react"
import type { PropsWithChildren, FC } from "react"
import type { ColorFormat } from "utils/color"

type AppContext = {
  hex?: string | [string, string]
  format?: ColorFormat
}

const AppContext = createContext<AppContext>({
  hex: undefined,
  format: undefined,
})

export type AppProviderProps = PropsWithChildren<{
  hex?: string | [string, string]
  format?: ColorFormat
}>

export const AppProvider: FC<AppProviderProps> = ({
  hex,
  format,
  children,
}) => {
  const value = useMemo(() => ({ hex, format }), [hex, format])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const context = useContext(AppContext)

  return context
}
