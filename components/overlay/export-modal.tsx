import type { ModalProps, SelectItem } from "@yamada-ui/react"
import type { FC } from "react"
import { Check, Clipboard } from "@yamada-ui/lucide"
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
import { useApp } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"
import { memo, useState } from "react"

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

export interface ExportModalProps extends ModalProps {
  type: ColorExport
  colors: Colors | ReorderColors
}

export const ExportModal: FC<ExportModalProps> = memo(
  ({ type: typeProp, colors, isOpen, onClose, ...rest }) => {
    const { t } = useI18n()
    const [type, setType] = useState(typeProp)
    const { format } = useApp()
    const { loading, value } = useAsync(async () => {
      if (!isOpen) return ""

      const res = await fetch("/api/palettes/export", {
        body: JSON.stringify({ type, colors, format }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      })
      const data = (await res.json()) as string

      return data
    }, [isOpen, type, format, colors])
    const { hasCopied, onCopy } = useClipboard(value, 5000)

    useUpdateEffect(() => {
      setType(typeProp)
    }, [typeProp])

    return (
      <Modal isOpen={isOpen} onClose={onClose} {...rest}>
        <ModalCloseButton colorScheme="neutral" rounded="full" />

        <ModalHeader gap="sm">{t("component.export-modal.title")}</ModalHeader>

        <ModalBody overflow="visible">
          <HStack gap="sm" w="full">
            <Select
              items={items}
              value={type}
              onChange={(value) => setType(value as ColorExport)}
            />

            <IconButton
              colorScheme="neutral"
              bg={hasCopied ? "success" : ["blackAlpha.800", "whiteAlpha.800"]}
              borderColor="transparent"
              color={["whiteAlpha.900", "blackAlpha.900"]}
              icon={
                hasCopied ? (
                  <Check fontSize="1.25rem" />
                ) : (
                  <Clipboard fontSize="1.25rem" />
                )
              }
              pointerEvents={hasCopied ? "none" : "auto"}
              _hover={{
                bg: hasCopied
                  ? "success"
                  : ["blackAlpha.900", "whiteAlpha.900"],
              }}
              onClick={onCopy}
            />
          </HStack>

          <ScrollArea
            type="scroll"
            bg={["blackAlpha.50", "whiteAlpha.100"]}
            color="muted"
            h={{ base: "4xl" }}
            p="md"
            position="relative"
            rounded="md"
            w="full"
            whiteSpace="pre"
          >
            {!loading ? value : "Loading…"}
          </ScrollArea>
        </ModalBody>
      </Modal>
    )
  },
)

ExportModal.displayName = "ExportModal"
