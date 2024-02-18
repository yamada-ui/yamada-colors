import {
  Box,
  Center,
  Grid,
  GridItem,
  Motion,
  Text,
  VStack,
} from "@yamada-ui/react"
import Link from "next/link"
import type { FC } from "react"

export type HexesProps = { hexes: string[] }

export const Hexes: FC<HexesProps> = ({ hexes }) => {
  const count = hexes.length

  return (
    <Grid
      as="section"
      templateColumns={{ base: `repeat(${count}, 1fr)`, md: "1fr" }}
      gap={{ base: "0", md: "md" }}
    >
      {hexes.map((hex, index) => (
        <GridItem
          key={`${hex}-${index}`}
          as={VStack}
          minW="0"
          gap={{ base: "md", md: "sm" }}
        >
          <Box
            as={Link}
            href={`/colors/${hex.replace("#", "")}`}
            boxSize="full"
            minH={{ base: "xs", md: "20", sm: "16" }}
            outline="0"
            position="relative"
            _focusVisible={{
              boxShadow: "outline",
              zIndex: 1,
            }}
            roundedLeft={{ base: !index ? "2xl" : "0", md: "2xl" }}
            roundedRight={{
              base: index + 1 === count ? "2xl" : "0",
              md: "2xl",
            }}
            overflow="hidden"
          >
            <Motion bg={hex} boxSize="full" />
          </Box>

          <Center px="xs">
            <Text as="span" color="muted" fontSize="sm" lineClamp={1}>
              {hex}
            </Text>
          </Center>
        </GridItem>
      ))}
    </Grid>
  )
}
