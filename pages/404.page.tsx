import { Text, VStack } from "@yamada-ui/react"
import type { NextPage } from "next"
import { NextLinkButton } from "components/navigation"
import { useI18n } from "contexts/i18n-context"
import { AppLayout } from "layouts/app-layout"

const Page: NextPage = ({}) => {
  const { t, tc } = useI18n()

  return (
    <AppLayout
      title={t("not-found.title")}
      description={t("not-found.description")}
      hasSidebar={false}
    >
      <VStack alignItems="center" py="3xl" gap="xl">
        <VStack alignItems="center">
          <Text
            as="h1"
            fontSize={{ base: "5xl", md: "3xl", sm: "2xl" }}
            fontFamily="heading"
            fontWeight="bold"
            textAlign="center"
          >
            {tc("not-found.heading")}
          </Text>

          <Text
            w="full"
            maxW="2xl"
            fontSize={{ base: "xl", sm: "lg" }}
            textAlign="center"
          >
            {tc("not-found.message")}
          </Text>
        </VStack>

        <NextLinkButton
          href="/"
          size="lg"
          colorScheme="neutral"
          bg={["blackAlpha.100", "whiteAlpha.100"]}
          borderColor="transparent"
        >
          {tc("not-found.back-to-app")}
        </NextLinkButton>
      </VStack>
    </AppLayout>
  )
}

export default Page
