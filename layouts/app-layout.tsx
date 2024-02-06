import { Center, HStack, VStack } from "@yamada-ui/react"
import { type FC, type PropsWithChildren } from "react"
import { Footer, Header, Sidebar } from "components/layouts"
import { SEO } from "components/media-and-icons"

type AppLayoutOptions = {
  title: string
  description: string
  hasSidebar?: boolean
}

export type AppLayoutProps = PropsWithChildren & AppLayoutOptions

export const AppLayout: FC<AppLayoutProps> = ({
  title,
  description,
  hasSidebar = true,
  children,
}) => {
  return (
    <>
      <SEO title={title} description={description} />

      <Header />

      <Center as="main">
        <HStack
          alignItems="flex-start"
          w="full"
          maxW="9xl"
          gap="0"
          py={{ base: "lg", md: "normal" }}
          px={{ base: "lg", md: "md" }}
        >
          {hasSidebar ? (
            <Sidebar display={{ base: "flex", lg: "none" }} />
          ) : null}

          <VStack
            flex="1"
            minW="0"
            gap="0"
            px={hasSidebar ? { base: "lg", md: "md" } : undefined}
          >
            {children}
          </VStack>
        </HStack>
      </Center>

      <Footer />
    </>
  )
}
