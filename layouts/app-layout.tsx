import type { StackProps } from "@yamada-ui/react"
import { Center, HStack, VStack } from "@yamada-ui/react"
import { type FC, type PropsWithChildren } from "react"
import { Footer, Header, Sidebar } from "components/layouts"
import { SEO } from "components/media-and-icons"
import { AppProvider } from "contexts/app-context"

type AppLayoutOptions = {
  title: string
  description: string
  hex?: string | [string, string]
  palettes?: ColorPalettes
  format?: ColorFormat
  hasSidebar?: boolean
}

export type AppLayoutProps = PropsWithChildren & StackProps & AppLayoutOptions

export const AppLayout: FC<AppLayoutProps> = ({
  title,
  description,
  hex,
  format,
  palettes,
  hasSidebar = true,
  children,
  ...rest
}) => {
  return (
    <AppProvider {...{ hex, format, palettes }}>
      <SEO title={title} description={description} />

      <Header />

      <Center>
        <HStack
          alignItems="flex-start"
          w="full"
          maxW="9xl"
          gap="0"
          py={{ base: "lg", sm: "normal" }}
          px={{ base: "lg", md: "md" }}
        >
          {hasSidebar ? (
            <Sidebar display={{ base: "flex", lg: "none" }} />
          ) : null}

          <VStack
            as="main"
            flex="1"
            minW="0"
            gap="0"
            ps={hasSidebar ? { base: "lg", lg: "0" } : undefined}
            {...rest}
          >
            {children}
          </VStack>
        </HStack>
      </Center>

      <Footer />
    </AppProvider>
  )
}
