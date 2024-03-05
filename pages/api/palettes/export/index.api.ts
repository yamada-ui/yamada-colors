import type { Dict } from "@yamada-ui/react"
import { isArray } from "@yamada-ui/react"
import type { NextApiRequest, NextApiResponse } from "next"
import { prettier } from "libs/prettier"
import { f, tone, tones } from "utils/color"

const toCamelCase = (value: string & {}) =>
  value
    .replace(/[-\s](.)/g, (_, group1) => group1.toUpperCase())
    .replace(/^(.)/, (_, group1) => group1.toLowerCase())

const toKebabCase = (value: string & {}) =>
  value
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/^-/, "")
    .replace(/\s/, "")

type RequestBody = {
  type?: ColorExport
  format?: ColorFormat
  colors?: Colors | ReorderColors
}

type ResponseData = string

const handler = async (
  { body }: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) => {
  const {
    type = "json",
    format = "hex",
    colors = [],
  } = (body ?? {}) as RequestBody
  const [extension, isTones] = type.split(".")
  const isJson = extension === "json"
  const parser = isJson ? toCamelCase : toKebabCase

  let json: string = ""

  if (extension === "css") {
    const data = colors.reduce(
      (prev, { name, hex }) => {
        name = generateName(prev.light, name, parser)

        if (isTones) {
          if (isArray(hex)) {
            const [light, dark] = hex

            prev.light[name] = tone(light).map(
              (hex, index) => `--${name}-${tones[index]}: ${f(hex, format)};`,
            )

            if (light !== dark) {
              prev.dark[name] = tone(dark).map(
                (hex, index) => `--${name}-${tones[index]}: ${f(hex, format)};`,
              )
            }
          } else {
            prev.light[name] = tone(hex).map(
              (hex, index) => `--${name}-${tones[index]}: ${f(hex, format)};`,
            )
          }
        } else {
          if (isArray(hex)) {
            const [light, dark] = hex

            prev.light[name] = `--${name}: ${f(light, format)};`

            if (light !== dark) {
              prev.dark[name] = `--${name}: ${f(dark, format)};`
            }
          } else {
            prev.light[name] = `--${name}: ${f(hex, format)};`
          }
        }

        return prev
      },
      { light: {}, dark: {} } as {
        light: Dict<string | string[]>
        dark: Dict<string | string[]>
      },
    )

    const lightJson = Object.values(data.light).flat().join("\n")

    json = `:root {\n${lightJson}\n}`

    if (!!Object.values(data.dark).length) {
      const darkJson = Object.values(data.dark).flat().join("\n")

      json += `\n\n@media (prefers-color-scheme: dark) {\n:root {\n${darkJson}\n}\n}`
    }
  } else {
    const data = colors.reduce(
      (prev, { name, hex }) => {
        name = generateName(prev, name, parser)

        if (isTones) {
          if (isArray(hex)) {
            const [light, dark] = hex

            const lightTones = tone(light)

            if (light === dark) {
              prev[name] = lightTones.reduce(
                (prev, hex, index) => {
                  prev[tones[index]] = f(hex, format)

                  return prev
                },
                {} as Dict<string | [string, string]>,
              )
            } else {
              const darkTones = tone(dark)

              prev[name] = lightTones.reduce(
                (prev, hex, index) => {
                  prev[tones[index]] = [
                    f(hex, format),
                    f(darkTones[index], format),
                  ]

                  return prev
                },
                {} as Dict<string | [string, string]>,
              )
            }
          } else {
            prev[name] = tone(hex).reduce((prev, hex, index) => {
              prev[tones[index]] = f(hex, format)

              return prev
            }, {} as Dict<string>)
          }
        } else {
          if (isArray(hex)) {
            const [light, dark] = hex

            if (light === dark) {
              prev[name] = f(light, format)
            } else {
              prev[name] = [f(light, format), f(dark, format)]
            }
          } else {
            prev[name] = f(hex, format)
          }
        }

        return prev
      },
      {} as Dict<string | [string, string] | Dict<string | [string, string]>>,
    )

    json = JSON.stringify(data)
  }

  json = await prettier(json, {
    parser: extension,
    ...(isJson ? { printWidth: 0 } : {}),
  })

  res.status(200).json(json)
}

export default handler

const generateName = (
  values: Dict,
  name: string,
  parser?: (value: string & {}) => string,
) => {
  if (parser) name = parser(name)

  let count = 1

  while (values.hasOwnProperty(name)) {
    name = `${name}${count}`

    count++
  }

  return name
}
