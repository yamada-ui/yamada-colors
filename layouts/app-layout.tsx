import type { StackProps } from "@yamada-ui/react"
import type { SeoProps } from "components/media-and-icons"
import type { FC, PropsWithChildren } from "react"
import { Center, HStack, VStack } from "@yamada-ui/react"
import { Footer, Header, Sidebar } from "components/layouts"
import { Seo } from "components/media-and-icons"
import { AppProvider } from "contexts/app-context"

interface AppLayoutOptions extends SeoProps {
  format?: ColorFormat
  hasSidebar?: boolean
  hex?: [string, string] | string
  palettes?: ColorPalettes
}

export interface AppLayoutProps
  extends AppLayoutOptions,
    PropsWithChildren,
    StackProps {}

export const AppLayout: FC<AppLayoutProps> = ({
  children,
  description,
  format,
  hasSidebar = true,
  hex,
  nofollow,
  noindex,
  palettes,
  title,
  ...rest
}) => {
  return (
    <AppProvider {...{ format, hex, palettes }}>
      <Seo
        description={description}
        nofollow={nofollow}
        noindex={noindex}
        title={title}
      />

      <Header />

      <Center>
        <HStack
          alignItems="flex-start"
          gap="0"
          maxW="9xl"
          px={{ base: "lg", md: "md" }}
          py={{ base: "lg", sm: "normal" }}
          w="full"
        >
          {hasSidebar ? (
            <Sidebar display={{ base: "flex", lg: "none" }} />
          ) : null}

          <VStack
            as="main"
            flex="1"
            gap="0"
            minW="0"
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
