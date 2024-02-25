import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next"
import { useRouter } from "next/router"
import { useCallback, useState } from "react"
import { Header } from "./header"
import { Hexes } from "./hexes"
import { CONSTANT } from "constant"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"
import { AppLayout } from "layouts/app-layout"
import { getServerSideCommonProps } from "utils/next"
import { getCookie } from "utils/storage"

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>

const Page: NextPage<PageProps> = ({ hex, format, palettes, palette }) => {
  const { changePalette, deletePalette } = useApp()
  const { t } = useI18n()
  const router = useRouter()
  const [{ uuid, name, colors }, setPalette] = useState<ColorPalette>(palette)

  const onAdd = useCallback(() => {}, [])

  const onEdit = useCallback(
    (name: string) => {
      const palette: ColorPalette = { uuid, name, colors }

      setPalette((prev) => ({ ...prev, name }))

      changePalette(palette)
    },
    [uuid, colors, changePalette],
  )

  const onDelete = useCallback(() => {
    deletePalette(uuid)

    router.push("/palettes")
  }, [deletePalette, uuid, router])

  return (
    <AppLayout
      title={palette.name}
      description={t("palettes.description")}
      hex={hex}
      format={format}
      palettes={palettes}
      gap={{ base: "lg", sm: "normal" }}
    >
      <Header name={name} onEdit={onEdit} onDelete={onDelete} />

      <Hexes colors={colors} onAdd={onAdd} />
    </AppLayout>
  )
}

export default Page

export const getServerSideProps = async (req: GetServerSidePropsContext) => {
  const {
    props: { cookies, format, hex, palettes },
  } = await getServerSideCommonProps(req)
  const uuid = req.query.uuid as string
  const palette = getCookie<ColorPalette | null>(
    cookies,
    `${CONSTANT.STORAGE.PALETTE}-${uuid}`,
    null,
  )

  if (!palette) return { notFound: true }

  const props = {
    cookies,
    format,
    hex,
    uuid,
    palettes,
    palette,
  }

  return { props }
}
