import type { MotionProps } from "@yamada-ui/react"
import type { FC, MutableRefObject } from "react"
import {
  assignRef,
  Box,
  Center,
  Grid,
  GridItem,
  Motion,
  VStack,
} from "@yamada-ui/react"
import { CopyText } from "components/other"
import { ColorCommandMenu } from "components/overlay"
import { useApp } from "contexts/app-context"
import { useRouter } from "next/router"
import { useCallback, useState } from "react"
import { f } from "utils/color"
import { getColorName } from "utils/color-name-list"
import { getHexes } from "./index.page"

export interface HexesProps {
  hexes: Colors
  onSelectRef: MutableRefObject<(tab: string, hex: string) => void>
}

export const Hexes: FC<HexesProps> = ({ hexes: hexesProp, onSelectRef }) => {
  const router = useRouter()
  const [hexes, setHexes] = useState(hexesProp)
  const { format } = useApp()
  const count = hexes.length

  const onSelect = useCallback(
    (tab: string, hex: string) => {
      const hexes = getHexes(tab, hex).map((hex) => ({
        name: getColorName(hex),
        hex,
      }))

      setHexes(hexes)

      router.push(
        `/generators?hex=${hex.replace("#", "")}&tab=${tab}`,
        undefined,
        { shallow: true },
      )
    },
    [router],
  )

  assignRef(onSelectRef, onSelect)

  return (
    <Box as="section">
      <Grid
        as="ul"
        gap={{ base: "0", md: "md" }}
        templateColumns={{ base: `repeat(${count}, 1fr)`, md: "1fr" }}
      >
        {hexes.map(({ name, hex }, index) => {
          const isStart = !index
          const isEnd = index + 1 === count

          return (
            <GridItem key={`${hex}-${index}`} as="li">
              <ColorCommandMenu name={name} hiddenGenerators value={hex}>
                <VStack gap={{ base: "md", md: "sm" }} minW="0">
                  <LinkBox
                    display={{ base: "block", md: "none" }}
                    hex={hex}
                    initial={{
                      borderEndEndRadius: isEnd ? "16px" : "0px",
                      borderEndStartRadius: isStart ? "16px" : "0px",
                      borderStartEndRadius: isEnd ? "16px" : "0px",
                      borderStartStartRadius: isStart ? "16px" : "0px",
                    }}
                    isEnd={isEnd}
                    isStart={isStart}
                    minH="xs"
                    whileHover={{ borderRadius: "16px", scale: 1.1, zIndex: 1 }}
                  />

                  <LinkBox
                    display={{ base: "none", md: "block" }}
                    hex={hex}
                    isEnd={isEnd}
                    isStart={isStart}
                    minH={{ base: "20", sm: "16" }}
                    rounded="2xl"
                    whileHover={{ scale: 0.95 }}
                  />

                  <Center px="xs">
                    <CopyText
                      as="span"
                      color="muted"
                      fontSize="sm"
                      hiddenIcon
                      lineClamp={1}
                    >
                      {f(hex, format)}
                    </CopyText>
                  </Center>
                </VStack>
              </ColorCommandMenu>
            </GridItem>
          )
        })}
      </Grid>
    </Box>
  )
}

interface LinkBoxProps extends MotionProps<"a"> {
  hex: string
  isEnd: boolean
  isStart: boolean
}

const LinkBox: FC<LinkBoxProps> = ({ hex, isEnd, isStart, ...rest }) => {
  return (
    // @ts-ignore
    <Motion
      as="a"
      href={`/colors/${hex.replace("#", "")}`}
      bg={hex}
      boxSize="full"
      outline={0}
      position="relative"
      _focusVisible={{
        zIndex: 1,
        _before: {
          bottom: 0,
          boxShadow: "outline",
          content: '""',
          left: 0,
          position: "absolute",
          right: 0,
          roundedLeft: { base: isStart ? "2xl" : "0px", md: "2xl" },
          roundedRight: {
            base: isEnd ? "2xl" : "0px",
            md: "2xl",
          },
          top: 0,
        },
      }}
      {...rest}
    />
  )
}
