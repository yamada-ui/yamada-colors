import { createContext, useMemo, useContext } from "react"
import type { PropsWithChildren, FC } from "react"

type AppContext = {}

const AppContext = createContext<AppContext>({})

export type AppProviderProps = PropsWithChildren

export const AppProvider: FC<AppProviderProps> = ({ children }) => {
  const value = useMemo(() => ({}), [])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const context = useContext(AppContext)

  return context
}
