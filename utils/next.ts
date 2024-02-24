import type { GetServerSidePropsContext } from "next"
import type { ColorFormat } from "./color"
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

  return { props: { cookies, format, hex, palettes } }
}
