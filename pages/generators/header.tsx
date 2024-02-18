import {
  Box,
  Grid,
  HStack,
  Heading,
  Spacer,
  Text,
  VStack,
} from "@yamada-ui/react"
import Link from "next/link"
import type { FC } from "react"

export type HeaderProps = Color

export const Header: FC<HeaderProps> = ({ hex, name }) => {
  return (
    <HStack as="section">
      <Grid
        as={Link}
        templateColumns={{ base: "auto 1fr" }}
        gap={{ base: "md" }}
        href={`/colors/${hex.replace("#", "")}`}
        outline={0}
        _focusVisible={{ boxShadow: "outline" }}
        rounded="2xl"
      >
        <Box boxSize={{ base: "20", sm: "16" }} bg={hex} rounded="2xl" />

        <VStack gap={{ base: "xs", sm: "0" }} justifyContent="center">
          <Heading fontSize={{ base: "4xl", sm: "2xl" }}>{name}</Heading>

          <Text as="h2" color="muted">
            {hex}
          </Text>
        </VStack>
      </Grid>

      <Spacer />
    </HStack>
  )
}
