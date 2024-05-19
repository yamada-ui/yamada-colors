import type { Path, StringLiteral } from "@yamada-ui/react"
import {
  getMemoizedObject as get,
  isString,
  Text,
  noop,
  isObject,
  isUndefined
} from "@yamada-ui/react"
import { useRouter } from "next/router"
import {
  createContext,
  useMemo,
  useContext,
  useCallback,
  Fragment,
} from "react"
import type { PropsWithChildren, FC, ReactNode } from "react"
import { CONSTANT } from "constant"
import UI_EN from "i18n/ui.en.json"
import UI_JA from "i18n/ui.ja.json"
import type { Locale } from "utils/i18n"

type UIData = typeof UI_EN

const uiData = { ja: UI_JA, en: UI_EN }

type I18nContext = {
  locale: Locale
  t: (
    path: Path<UIData> | StringLiteral,
    replaceValue?: string | number | Record<string, string | number>,
    pattern?: string,
  ) => string
  tc: (
    path: Path<UIData> | StringLiteral,
    callback?: (str: string, index: number) => ReactNode,
  ) => ReactNode
  changeLocale: (locale: Locale & StringLiteral) => void
}

const I18nContext = createContext<I18nContext>({
  locale: CONSTANT.I18N.DEFAULT_LOCALE as Locale,
  t: () => "",
  tc: () => "",
  changeLocale: noop,
})

export type I18nProviderProps = PropsWithChildren

export const I18nProvider: FC<I18nProviderProps> = ({ children }) => {
  const { locale, asPath, push } = useRouter()

  const changeLocale = useCallback(
    (locale: Locale & StringLiteral) => {
      push(asPath, asPath, { locale })
    },
    [push, asPath],
  )

  const t = useCallback(
    (
      path: Path<UIData> | StringLiteral,
      replaceValue?: string | number | Record<string, string | number>,
      pattern: string = "label",
    ) => {
      let value = get<string>(uiData[locale], path, "")

      if (isUndefined(replaceValue)) return value

      if (!isObject(replaceValue)) {
        value = value.replace(
          new RegExp(`{${pattern}}`, "g"),
          `${replaceValue}`,
        )
      } else {
        value = Object.entries(replaceValue).reduce(
          (prev, [pattern, value]) =>
            prev.replace(new RegExp(`{${pattern}}`, "g"), `${value}`),
          value,
        )
      }

      return value
    },
    [locale],
  )

  const tc = useCallback(
    (
      path: Path<UIData> | StringLiteral,
      callback?: (str: string, index: number) => ReactNode,
    ) => {
      const strOrArray = get<string | string[]>(uiData[locale], path, "")

      if (isString(strOrArray)) {
        const match = strOrArray.match(/`([^`]+)`/)

        if (!match) {
          return strOrArray
        } else {
          return renderElement(strOrArray, callback)
        }
      } else {
        return strOrArray.map((str, index) => (
          <Text key={index} as="span" display="block">
            {renderElement(str, callback)}
          </Text>
        ))
      }
    },
    [locale],
  )

  const value = useMemo(
    () => ({ locale: locale as Locale, t, tc, changeLocale }),
    [changeLocale, locale, t, tc],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

const renderElement = (
  str: string,
  callback?: (str: string, index: number) => ReactNode,
) => {
  const array = str.split(/(`[^`]+`)/)

  return array.map((str, index) => {
    if (str.startsWith("`") && str.endsWith("`")) {
      return (
        <Fragment key={index}>
          {callback ? callback(str.replace(/`/g, ""), index) : str}
        </Fragment>
      )
    } else {
      return <Fragment key={index}>{str}</Fragment>
    }
  })
}

export const useI18n = () => {
  const context = useContext(I18nContext)

  return context
}
