import {
  AspectRatio,
  Grid,
  GridItem,
  Motion,
  Text,
  VStack,
} from "@yamada-ui/react"
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next"
import Link from "next/link"
import { CONSTANT } from "constant"
import { useI18n } from "contexts/i18n-context"
import { AppLayout } from "layouts/app-layout"
import { isLight } from "utils/color"
import { getColorName } from "utils/color-name-list"
import { getServerSideCommonProps } from "utils/next"
import { getCookie } from "utils/storage"

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>

const Page: NextPage<PageProps> = ({ history }) => {
  const { t } = useI18n()

  return (
    <AppLayout
      title={t("history.title")}
      description={t("history.description")}
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
            <AspectRatio as={Link} href={`/colors/${hex.replace("#", "")}`}>
              <Motion
                bg={hex}
                color={isLight(hex) ? "black" : "white"}
                p={{ base: "normal", lg: "md", md: "normal", sm: "md" }}
                rounded="2xl"
                whileHover={{ scale: 0.95 }}
              >
                <VStack
                  boxSize="full"
                  justifyContent="flex-end"
                  gap={{ base: "xs", sm: "0" }}
                >
                  <Text as="span" fontWeight="medium" lineClamp={1}>
                    {name}
                  </Text>

                  <Text as="span" fontSize="sm" lineClamp={1}>
                    {hex}
                  </Text>
                </VStack>
              </Motion>
            </AspectRatio>
          </GridItem>
        ))}
      </Grid>
    </AppLayout>
  )
}

export default Page

export const getServerSideProps = async (req: GetServerSidePropsContext) => {
  const {
    props: { cookies },
  } = await getServerSideCommonProps(req)
  const hexes: string[] = getCookie(cookies, CONSTANT.STORAGE.HISTORY, "[]")
  const history = hexes.map((hex) => ({ hex, name: getColorName(hex) }))

  const props = { cookies, history }

  return { props }
}
