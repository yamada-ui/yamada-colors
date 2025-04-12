import type { NextPage } from "next"
import { Text, VStack } from "@yamada-ui/react"
import { NextLinkButton } from "components/navigation"
import { useI18n } from "contexts/i18n-context"
import { AppLayout } from "layouts/app-layout"

const Page: NextPage = () => {
  const { t, tc } = useI18n()

  return (
    <AppLayout
      description={t("not-found.description")}
      hasSidebar={false}
      title={t("not-found.title")}
    >
      <VStack alignItems="center" gap="xl" py="3xl">
        <VStack alignItems="center">
          <Text
            as="h1"
            fontFamily="heading"
            fontSize={{ base: "5xl", sm: "2xl", md: "3xl" }}
            fontWeight="bold"
            textAlign="center"
          >
            {tc("not-found.heading")}
          </Text>

          <Text
            fontSize={{ base: "xl", sm: "lg" }}
            maxW="2xl"
            textAlign="center"
            w="full"
          >
            {tc("not-found.message")}
          </Text>
        </VStack>

        <NextLinkButton
          href="/"
          colorScheme="neutral"
          size="lg"
          bg={["blackAlpha.100", "whiteAlpha.100"]}
          borderColor="transparent"
          prefetch
        >
          {tc("not-found.back-to-app")}
        </NextLinkButton>
      </VStack>
    </AppLayout>
  )
}

export default Page
