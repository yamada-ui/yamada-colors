import type { StackProps } from "@yamada-ui/react"
import {
  Box,
  Center,
  Divider,
  HStack,
  ScrollArea,
  Text,
  VStack,
  isString,
} from "@yamada-ui/react"
import type { FC } from "react"
import type { ColorData } from "./index.page"
import { ScrollShadow } from "components/data-display"
import { useApp } from "contexts/app-context"
import { f, isLight } from "utils/color"

export type DataProps = ColorData & {}

export const Data: FC<DataProps> = ({
  name,
  hex,
  rgb,
  hsl,
  hsv,
  cmyk,
  cielab,
  cielch,
}) => {
  const { format } = useApp()

  return (
    <>
      <Box as="section" position="relative">
        <ScrollArea type="never" tabIndex={-1}>
          <HStack
            as="ul"
            divider={<Divider />}
            h={{ base: "46px", sm: "42px" }}
          >
            <StackItem label="name" value={name} />
            <StackItem label="hex" value={hex.replace("#", "")} />
            <StackItem label="rgb" value={rgb} />
            <StackItem label="hsl" value={hsl} />
            <StackItem label="hsv" value={hsv} />
            <StackItem label="cmyk" value={cmyk} />
            <StackItem label="cielab" value={cielab} />
            <StackItem label="cielch" value={cielch} />
          </HStack>
        </ScrollArea>

        <ScrollShadow />
      </Box>

      <Center
        as="section"
        w="full"
        h={{ base: "xs", sm: "2xs" }}
        rounded="2xl"
        flexDirection="column"
        gap={{ base: "xs", sm: "0" }}
        bg={hex}
        p="md"
        textAlign="center"
      >
        <Text
          fontSize={{ base: "2xl", sm: "xl" }}
          fontWeight="semibold"
          color={isLight(hex) ? "black" : "white"}
          lineClamp={1}
        >
          {name}
        </Text>

        <Text
          fontSize={{ base: "lg", sm: "md" }}
          color={isLight(hex) ? "blackAlpha.700" : "whiteAlpha.700"}
          lineClamp={1}
        >
          {f(hex, format)}
        </Text>
      </Center>
    </>
  )
}

type StackItemProps = StackProps & {
  label: string
  value: string | [number, number, number] | [number, number, number, number]
}

const StackItem: FC<StackItemProps> = ({ label, value }) => {
  return (
    <VStack
      as="li"
      w="auto"
      alignItems="center"
      px="md"
      gap={{ base: "xs", sm: "0" }}
    >
      <Text fontSize="xs" color="muted" textTransform="uppercase">
        {label}
      </Text>

      <Text whiteSpace="nowrap" color={["blackAlpha.800", "whiteAlpha.800"]}>
        {isString(value) ? value : value.join(", ")}
      </Text>
    </VStack>
  )
}
