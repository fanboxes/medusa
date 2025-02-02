"use client"

import React from "react"
import { useAiAssistant, useSiteConfig } from "../../../../providers"
import { useAiAssistantChat } from "../../../../providers/AiAssistant/Chat"
import clsx from "clsx"
import { Tooltip } from "../../../Tooltip"
import Image from "next/image"

export type CodeBlockCopyActionProps = {
  source: string
  inHeader: boolean
}

export const CodeBlockAskAiAction = ({
  source,
  inHeader,
}: CodeBlockCopyActionProps) => {
  const { setChatOpened } = useAiAssistant()
  const { setQuestion, loading } = useAiAssistantChat()
  const { config } = useSiteConfig()

  const handleClick = () => {
    if (loading) {
      return
    }
    setQuestion(`\`\`\`tsx\n${source.trim()}\n\`\`\`\n\nExplain the code above`)
    setChatOpened(true)
  }

  return (
    <Tooltip
      text="Ask AI"
      tooltipClassName="font-base"
      className={clsx("group")}
      innerClassName={clsx(
        inHeader && "flex",
        "h-fit rounded-docs_sm",
        "group-hover:bg-medusa-contrast-bg-base-hover group-focus:bg-medusa-contrast-bg-base-hover"
      )}
    >
      <span
        className={clsx(
          !inHeader && "p-[6px]",
          inHeader && "p-[4.5px]",
          "cursor-pointer"
        )}
        onClick={handleClick}
      >
        <Image
          src={`${config.basePath}/images/ai-assistent-luminosity.png`}
          width={15}
          height={15}
          alt="Ask AI"
        />
      </span>
    </Tooltip>
  )
}
