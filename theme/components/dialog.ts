import { type ComponentMultiStyle, mergeMultiStyle } from "@yamada-ui/react"
import { Modal } from "./modal"

export const Dialog: ComponentMultiStyle = mergeMultiStyle(Modal)()
