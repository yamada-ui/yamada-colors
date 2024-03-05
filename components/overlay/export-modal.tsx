import {
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ScrollArea,
  Select,
  Tag,
  Text,
  useAsync,
  useClipboard,
  useUpdateEffect,
} from "@yamada-ui/react"
import type { ModalProps, SelectItem } from "@yamada-ui/react"
import { memo, useState } from "react"
import type { FC } from "react"
import { Check, Clipboard } from "components/media-and-icons"
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"

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
  ({ isOpen, type: typeProp, onClose, colors, ...rest }) => {
    const { t } = useI18n()
    const [type, setType] = useState(typeProp)
    const { format } = useApp()
    const { value, loading } = useAsync(async () => {
      if (!isOpen) return ""

      const res = await fetch("/api/palettes/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, format, colors }),
      })
      const data = (await res.json()) as string

      return data
    }, [isOpen, type, format, colors])
    const { onCopy, hasCopied } = useClipboard(value, 5000)

    useUpdateEffect(() => {
      setType(typeProp)
    }, [typeProp])

    return (
      <Modal isOpen={isOpen} onClose={onClose} {...rest}>
        <ModalCloseButton rounded="full" colorScheme="neutral" />

        <ModalHeader gap="sm">{t("component.export-modal.title")}</ModalHeader>

        <ModalBody overflow="visible">
          <HStack w="full" gap="sm">
            <Select
              value={type}
              onChange={(value) => setType(value as ColorExport)}
              items={items}
            />

            <IconButton
              bg={hasCopied ? "success" : ["blackAlpha.800", "whiteAlpha.800"]}
              colorScheme="neutral"
              icon={hasCopied ? <Check /> : <Clipboard />}
              pointerEvents={hasCopied ? "none" : "auto"}
              color={["whiteAlpha.900", "blackAlpha.900"]}
              _hover={{
                bg: hasCopied
                  ? "success"
                  : ["blackAlpha.900", "whiteAlpha.900"],
              }}
              borderColor="transparent"
              onClick={onCopy}
            />
          </HStack>

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
        </ModalBody>
      </Modal>
    )
  },
)

ExportModal.displayName = "ExportModal"
