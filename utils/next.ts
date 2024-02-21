import type { ColorFormat } from "@yamada-ui/react"
import type { GetServerSidePropsContext } from "next"

export const getServerSideCommonProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const cookies = req.headers.cookie ?? ""
  const format = (req.headers.format ?? "hex") as ColorFormat

  return { props: { cookies, format } }
}
