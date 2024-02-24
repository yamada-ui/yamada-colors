import type { GetServerSidePropsContext } from "next"
import type { ColorFormat } from "./color"
import { getCookie } from "./storage"
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

  return { props: { cookies, format, hex } }
}
