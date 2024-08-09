import {
  assignRef,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  useDisclosure,
} from "@yamada-ui/react"
import type { DialogProps } from "@yamada-ui/react"
import { memo, useRef, useState } from "react"
import type { FC, RefObject } from "react"
import { useI18n } from "contexts/i18n-context"

export type PaletteRenameModalProps = Omit<
  DialogProps,
  "isOpen" | "onClose" | "onSubmit"
> & {
  value: string
  onSubmit: (value: string) => void
  onOpenRef: RefObject<() => void>
}

export const PaletteRenameModal: FC<PaletteRenameModalProps> = memo(
  ({ value: valueProp, onSubmit, onOpenRef, ...rest }) => {
    const { t } = useI18n()
    const [value, setValue] = useState<string>(valueProp)
    const { isOpen, onOpen, onClose } = useDisclosure({
      onClose: () => {
        setValue((prev) => (!prev.length ? valueProp : prev))
      },
    })
    const isComposition = useRef<boolean>(false)

    assignRef(onOpenRef, onOpen)

    return (
      <Dialog
        isOpen={isOpen}
        onClose={onClose}
        withCloseButton={false}
        {...rest}
      >
        <DialogHeader>{t("palettes.rename.title")}</DialogHeader>

        <DialogBody>
          <Input
            value={value}
            onChange={(ev) => setValue(ev.target.value)}
            placeholder={t("palettes.rename.placeholder")}
            onCompositionStart={() => {
              isComposition.current = true
            }}
            onCompositionEnd={() => {
              isComposition.current = false
            }}
            onKeyDown={(ev) => {
              if (ev.key !== "Enter") return
              if (isComposition.current) return
              if (!value.length) return

              onClose()
              onSubmit(value)
            }}
          />
        </DialogBody>

        <DialogFooter>
          <Button variant="ghost" colorScheme="neutral" onClick={onClose}>
            {t("palettes.rename.cancel")}
          </Button>

          <Button
            isDisabled={!value.length}
            colorScheme="primary"
            onClick={() => {
              onClose()
              onSubmit(value)
            }}
          >
            {t("palettes.rename.submit")}
          </Button>
        </DialogFooter>
      </Dialog>
    )
  },
)

PaletteRenameModal.displayName = "PaletteRenameModal"
