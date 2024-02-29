import { Box, Center, Grid, GridItem, Motion } from "@yamada-ui/react"
import Link from "next/link"
import type { FC } from "react"
import { CopyText } from "components/other"
import { useApp } from "contexts/app-context"
import { f } from "utils/color"

export type HexesProps = { hexes: string[] }

export const Hexes: FC<HexesProps> = ({ hexes }) => {
  const { format } = useApp()
  const count = hexes.length

  return (
    <Box as="section">
      <Grid
        as="ul"
        templateColumns={{ base: `repeat(${count}, 1fr)`, md: "1fr" }}
        gap={{ base: "0", md: "md" }}
      >
        {hexes.map((hex, index) => {
          const isStart = !index
          const isEnd = index + 1 === count

          return (
            <GridItem
              key={`${hex}-${index}`}
              as="li"
              display="flex"
              flexDirection="column"
              minW="0"
              gap={{ base: "md", md: "sm" }}
            >
              <Motion
                display={{ base: "block", md: "none" }}
                w="full"
                minH="xs"
                bg={hex}
                boxSize="full"
                initial={{
                  borderStartStartRadius: isStart ? "16px" : "0px",
                  borderEndStartRadius: isStart ? "16px" : "0px",
                  borderStartEndRadius: isEnd ? "16px" : "0px",
                  borderEndEndRadius: isEnd ? "16px" : "0px",
                }}
                whileHover={{ scale: 1.1, borderRadius: "16px" }}
              >
                <LinkBox hex={hex} isStart={isStart} isEnd={isEnd} />
              </Motion>

              <Motion
                display={{ base: "none", md: "block" }}
                minH={{ base: "20", sm: "16" }}
                bg={hex}
                boxSize="full"
                rounded="2xl"
                whileHover={{ scale: 0.95 }}
              >
                <LinkBox hex={hex} isStart={isStart} isEnd={isEnd} />
              </Motion>

              <Center px="xs">
                <CopyText
                  hiddenIcon
                  as="span"
                  color="muted"
                  fontSize="sm"
                  lineClamp={1}
                >
                  {f(hex, format)}
                </CopyText>
              </Center>
            </GridItem>
          )
        })}
      </Grid>
    </Box>
  )
}

type LinkBoxProps = { hex: string; isStart: boolean; isEnd: boolean }

const LinkBox: FC<LinkBoxProps> = ({ hex, isStart, isEnd }) => {
  return (
    <Box
      as={Link}
      display="block"
      boxSize="full"
      href={`/colors/${hex.replace("#", "")}`}
      outline={0}
      position="relative"
      _focusVisible={{
        zIndex: 1,
        _before: {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          boxShadow: "outline",
          roundedLeft: { base: isStart ? "2xl" : "0px", md: "2xl" },
          roundedRight: {
            base: isEnd ? "2xl" : "0px",
            md: "2xl",
          },
        },
      }}
    />
  )
}
