import type { Dict } from "@yamada-ui/react"
import { isObject } from "@yamada-ui/react"
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

  const data = colors.reduce((prev, { name, hex }) => {
    name = parser(name)

    let count = 1

    while (prev.hasOwnProperty(name)) {
      name = `${name}${count}`

      count++
    }

    if (isTones) {
      prev[name] = tone(hex).reduce((prev, hex, index) => {
        prev[tones[index]] = f(hex, format)

        return prev
      }, {} as Dict<string>)
    } else {
      prev[name] = f(hex, format)
    }

    return prev
  }, {} as Dict)

  if (extension === "css") {
    json = Object.entries(data)
      .map(([name, value]) => {
        if (isObject(value)) {
          return Object.entries(value).map(([tone, value]) => {
            return `--${name}-${tone}: ${value};`
          })
        } else {
          return `--${name}: ${value};`
        }
      })
      .flat()
      .join("\n")

    json = `:root {\n${json}\n}`
  } else {
    json = JSON.stringify(data)
  }

  json = await prettier(json, { parser: extension })

  res.status(200).json(json)
}

export default handler
