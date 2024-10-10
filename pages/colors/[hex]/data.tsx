import type { StackProps } from "@yamada-ui/react"
import type { FC } from "react"
import type { ColorData } from "./index.page"
import {
  Box,
  Center,
  Divider,
  HStack,
  isString,
  ScrollArea,
  Text,
  VStack,
} from "@yamada-ui/react"
import { ScrollShadow } from "components/data-display"
import { useApp } from "contexts/app-context"
import { f, isLight } from "utils/color"

export interface DataProps extends ColorData {}

export const Data: FC<DataProps> = ({
  name,
  cielab,
  cielch,
  cmyk,
  hex,
  hsl,
  hsv,
  rgb,
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
        bg={hex}
        flexDirection="column"
        gap={{ base: "xs", sm: "0" }}
        h={{ base: "xs", sm: "2xs" }}
        p="md"
        rounded="2xl"
        textAlign="center"
        w="full"
      >
        <Text
          color={isLight(hex) ? "black" : "white"}
          fontSize={{ base: "2xl", sm: "xl" }}
          fontWeight="semibold"
          lineClamp={1}
        >
          {name}
        </Text>

        <Text
          color={isLight(hex) ? "blackAlpha.700" : "whiteAlpha.700"}
          fontSize={{ base: "lg", sm: "md" }}
          lineClamp={1}
        >
          {f(hex, format)}
        </Text>
      </Center>
    </>
  )
}

interface StackItemProps extends StackProps {
  label: string
  value: [number, number, number, number] | [number, number, number] | string
}

const StackItem: FC<StackItemProps> = ({ label, value }) => {
  return (
    <VStack
      as="li"
      alignItems="center"
      gap={{ base: "xs", sm: "0" }}
      px="md"
      w="auto"
    >
      <Text color="muted" fontSize="xs" textTransform="uppercase">
        {label}
      </Text>

      <Text color={["blackAlpha.800", "whiteAlpha.800"]} whiteSpace="nowrap">
        {isString(value) ? value : value.join(", ")}
      </Text>
    </VStack>
  )
}
