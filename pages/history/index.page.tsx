import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next"
import { Grid, GridItem } from "@yamada-ui/react"
import { ColorCard } from "components/data-display"
import { CONSTANT } from "constant"
import { useI18n } from "contexts/i18n-context"
import { AppLayout } from "layouts/app-layout"
import { getColorName } from "utils/color-name-list"
import { getServerSideCommonProps } from "utils/next"
import { getCookie } from "utils/storage"

export const getServerSideProps = (req: GetServerSidePropsContext) => {
  const {
    props: { cookies, format, hex, palettes },
  } = getServerSideCommonProps(req)

  const hexes = getCookie<string[]>(cookies, CONSTANT.STORAGE.HISTORY, "[]")
  const history = hexes.map((hex) => ({ name: getColorName(hex), hex }))

  const props = { cookies, format, hex, history, palettes }

  return { props }
}

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>

const Page: NextPage<PageProps> = ({ format, hex, history, palettes }) => {
  const { t } = useI18n()

  return (
    <AppLayout
      description={t("history.description")}
      format={format}
      hex={hex}
      palettes={palettes}
      title={t("history.title")}
    >
      <Grid
        as="ul"
        gap="md"
        templateColumns={{
          base: "repeat(4, 1fr)",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
          xl: "repeat(2, 1fr)",
        }}
      >
        {history.map(({ name, hex }, index) => (
          <GridItem key={`${hex}-${index}`} as="li">
            <ColorCard name={name} hex={hex} />
          </GridItem>
        ))}
      </Grid>
    </AppLayout>
  )
}

export default Page
