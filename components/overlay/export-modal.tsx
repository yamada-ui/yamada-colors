import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ScrollArea,
  Select,
  Tag,
  Text,
  useAsync,
  useUpdateEffect,
} from "@yamada-ui/react"
import type { ModalProps, SelectItem } from "@yamada-ui/react"
import { memo, useState } from "react"
import type { FC } from "react"
import { useApp } from "contexts/app-context"

const items: SelectItem[] = [
  {
    label: (
      <>
        <Text as="span">JSON</Text>
        <Tag size="sm" variant="muted" ms="sm">
          Tones
        </Tag>
      </>
    ),
    value: "json.token",
  },
  {
    label: "JSON",
    value: "json",
  },
  {
    label: (
      <>
        <Text as="span">CSS</Text>
        <Tag size="sm" variant="muted" ms="sm">
          Tones
        </Tag>
      </>
    ),
    value: "css.token",
  },
  {
    label: "CSS",
    value: "css",
  },
]

export type ExportModalProps = ModalProps & {
  type: ColorExport
  colors: Colors | ReorderColors
}

export const ExportModal: FC<ExportModalProps> = memo(
  ({ type: typeProp, onClose, colors, ...rest }) => {
    const [type, setType] = useState(typeProp)

    useUpdateEffect(() => {
      setType(typeProp)
    }, [typeProp])

    return (
      <Modal onClose={onClose} {...rest}>
        <ModalCloseButton rounded="full" colorScheme="neutral" />

        <ModalHeader gap="sm">
          <ExportModalTitle type={type} />
        </ModalHeader>

        <ModalBody>
          <Select
            value={type}
            onChange={(value) => setType(value as ColorExport)}
            items={items}
          />

          <ExportModalData type={type} colors={colors} />
        </ModalBody>
      </Modal>
    )
  },
)

ExportModal.displayName = "ExportModal"

type ExportModalTitleProps = { type: ColorExport }

const ExportModalTitle: FC<ExportModalTitleProps> = ({ type }) => {
  const [extension, isTones] = type.split(".")

  return (
    <>
      <Text as="h1" textTransform="uppercase">
        {extension}
      </Text>

      {isTones ? (
        <Tag size="sm" variant="muted">
          Tones
        </Tag>
      ) : null}
    </>
  )
}

type ExportModalDataProps = {
  type: ColorExport
  colors: Colors | ReorderColors
}

const ExportModalData: FC<ExportModalDataProps> = ({ type, colors }) => {
  const { format } = useApp()
  const { value, loading } = useAsync(async () => {
    const res = await fetch("/api/palettes/export", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type, format, colors }),
    })
    const data = (await res.json()) as string

    return data
  }, [type, format, colors])

  return (
    <ScrollArea
      type="scroll"
      w="full"
      h={{ base: "4xl" }}
      p="md"
      whiteSpace="pre"
      rounded="md"
      bg={["blackAlpha.50", "whiteAlpha.100"]}
      color="muted"
      position="relative"
    >
      {!loading ? value : "Loading…"}
    </ScrollArea>
  )
}
