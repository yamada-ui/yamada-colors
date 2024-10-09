import type { ComponentMultiStyle } from "@yamada-ui/react"
import { mergeMultiStyle } from "@yamada-ui/react"
import { Modal } from "./modal"

export const Dialog: ComponentMultiStyle = mergeMultiStyle(Modal)()
