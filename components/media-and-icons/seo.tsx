import type { NextSeoProps } from "next-seo"
import { CONSTANT } from "constant"
import { NextSeo } from "next-seo"
import React from "react"

export interface SeoProps
  extends Pick<
    NextSeoProps,
    "description" | "nofollow" | "noindex" | "title"
  > {}

export const Seo = ({
  description,
  nofollow = false,
  noindex = false,
  title,
}: SeoProps) => (
  <NextSeo
    description={description}
    title={title}
    {...CONSTANT.SEO.NEXT_SEO_PROPS}
    nofollow={nofollow}
    noindex={noindex}
  />
)
