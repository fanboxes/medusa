import React, { useState } from "react"
import clsx from "clsx"
import { Badge, Button, Link, type ButtonProps } from "@/components"
import { ThumbDown, ThumbUp } from "@medusajs/icons"
import { AiAssistantFeedbackType, useAiAssistant } from "@/providers"
import { AiAssistantThread } from "../../../../providers/AiAssistant/Chat"

export type AiAssistantThreadItemActionsProps = {
  item: AiAssistantThread
}

export const AiAssistantThreadItemActions = ({
  item,
}: AiAssistantThreadItemActionsProps) => {
  const [feedback, setFeedback] = useState<AiAssistantFeedbackType | null>(null)
  const { sendFeedback } = useAiAssistant()

  const handleFeedback = async (
    reaction: AiAssistantFeedbackType,
    question_id?: string
  ) => {
    try {
      if (!question_id || feedback) {
        return
      }
      setFeedback(reaction)
      const response = await sendFeedback(question_id, reaction)

      if (response.status !== 200) {
        console.error("Error sending feedback:", response.status)
      }
    } catch (error) {
      console.error("Error sending feedback:", error)
    }
  }

  return (
    <div className={clsx("flex gap-docs_0.75 justify-between items-center")}>
      {item.sources !== undefined && item.sources.length > 0 && (
        <div className="flex gap-[6px] items-center flex-wrap">
          {item.sources.map((source) => (
            <Badge key={source.source_url} variant="neutral">
              <Link href={source.source_url} className="!text-inherit">
                {source.title}
              </Link>
            </Badge>
          ))}
        </div>
      )}
      <div className="flex gap-docs_0.25 items-center text-medusa-fg-muted">
        {(feedback === null || feedback === "upvote") && (
          <ActionButton
            onClick={async () => handleFeedback("upvote", item.question_id)}
            className={clsx(feedback === "upvote" && "!text-medusa-fg-muted")}
          >
            <ThumbUp />
          </ActionButton>
        )}
        {(feedback === null || feedback === "downvote") && (
          <ActionButton
            onClick={async () => handleFeedback("downvote", item.question_id)}
            className={clsx(feedback === "downvote" && "!text-medusa-fg-muted")}
          >
            <ThumbDown />
          </ActionButton>
        )}
      </div>
    </div>
  )
}

const ActionButton = ({ children, className, ...props }: ButtonProps) => {
  return (
    <Button
      variant="transparent"
      className={clsx(
        "text-medusa-fg-muted hover:text-medusa-fg-muted",
        "hover:bg-medusa-bg-subtle-hover",
        "!p-[4.5px] rounded-docs_sm",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
}
