import type { GetServerSidePropsContext } from "next"
import { getCookie, getCookies } from "./storage"
import { CONSTANT } from "constant"

const randomHex = () =>
  `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`

export const getServerSideCommonProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const cookies = req.headers.cookie ?? ""
  const format = getCookie<ColorFormat>(cookies, CONSTANT.STORAGE.FORMAT, "hex")
  const hex = randomHex()
  const chunk = "[a-zA-Z0-9]{4}"
  const palettes = getCookies<ColorPalette>(
    cookies,
    new RegExp(
      `${CONSTANT.STORAGE.PALETTE}-${chunk}-${chunk}-${chunk}-${chunk}`,
    ),
  )
  const resolvedPalettes = palettes
    .map(({ uuid, name, colors, timestamp }) => ({
      uuid,
      name: decodeURIComponent(name),
      colors,
      timestamp,
    }))
    .sort((a, b) => b.timestamp - a.timestamp)

  return { props: { cookies, format, hex, palettes: resolvedPalettes } }
}
