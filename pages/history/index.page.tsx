import { Grid, GridItem } from "@yamada-ui/react"
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next"
import { ColorCard } from "components/data-display"
import { CONSTANT } from "constant"
import { useI18n } from "contexts/i18n-context"
import { AppLayout } from "layouts/app-layout"
import { getColorName } from "utils/color-name-list"
import { getServerSideCommonProps } from "utils/next"
import { getCookie } from "utils/storage"

export const getServerSideProps = async (req: GetServerSidePropsContext) => {
  const {
    props: { hex, cookies, format, palettes },
  } = await getServerSideCommonProps(req)

  const hexes = getCookie<string[]>(cookies, CONSTANT.STORAGE.HISTORY, "[]")
  const history = hexes.map((hex) => ({ hex, name: getColorName(hex) }))

  const props = { cookies, hex, format, history, palettes }

  return { props }
}

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>

const Page: NextPage<PageProps> = ({ hex, history, format, palettes }) => {
  const { t } = useI18n()

  return (
    <AppLayout
      title={t("history.title")}
      description={t("history.description")}
      hex={hex}
      format={format}
      palettes={palettes}
    >
      <Grid
        as="ul"
        templateColumns={{
          base: "repeat(4, 1fr)",
          xl: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
          md: "repeat(2, 1fr)",
        }}
        gap="md"
      >
        {history.map(({ hex, name }, index) => (
          <GridItem key={`${hex}-${index}`} as="li">
            <ColorCard hex={hex} name={name} />
          </GridItem>
        ))}
      </Grid>
    </AppLayout>
  )
}

export default Page
