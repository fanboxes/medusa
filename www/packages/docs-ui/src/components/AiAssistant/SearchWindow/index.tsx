"use client"

import React, { useCallback } from "react"
import { Badge, Button, InputText, Kbd, Tooltip, Link } from "@/components"
import { useSearch } from "@/providers"
import { ArrowUturnLeft } from "@medusajs/icons"
import clsx from "clsx"
import { AiAssistantThreadItem } from "../ThreadItem"
import { AiAssistantSuggestions } from "../Suggestions"
import { useAiAssistantChat } from "../../../providers/AiAssistant/Chat"
import { useSearchNavigation } from "../../.."

export const AiAssistantSearchWindow = () => {
  const {
    handleSubmit,
    getThreadItems: getChatThreadItems,
    question,
    setQuestion,
    inputRef,
    contentRef,
    loading,
    thread,
    answer,
  } = useAiAssistantChat()
  const { setCommand } = useSearch()

  const getThreadItems = useCallback(() => {
    const sortedThread = getChatThreadItems()

    return sortedThread.map((item, index) => (
      <AiAssistantThreadItem item={item} key={index} />
    ))
  }, [getChatThreadItems])

  useSearchNavigation({
    getInputElm: () => inputRef.current as HTMLInputElement | null,
    focusInput: () => inputRef.current?.focus(),
    handleSubmit,
  })

  return (
    <div className="h-full">
      <div className={clsx("px-docs_1 pt-docs_1")}>
        <Tooltip
          tooltipChildren={
            <>
              This site is protected by reCAPTCHA and the{" "}
              <Link href="https://policies.google.com/privacy">
                Google Privacy Policy
              </Link>{" "}
              and <Link href="https://policies.google.com/terms">ToS</Link>{" "}
              apply
            </>
          }
          clickable={true}
        >
          <Badge variant="neutral">AI Assistant</Badge>
        </Tooltip>
      </div>
      <div
        className={clsx(
          "flex gap-docs_1 px-docs_1 py-docs_0.75",
          "h-[57px] w-full md:rounded-t-docs_xl relative border-0 border-solid",
          "border-b border-medusa-border-base relative"
        )}
      >
        <Button
          variant="transparent"
          onClick={() => setCommand(null)}
          className="text-medusa-fg-muted p-[6.5px]"
        >
          <ArrowUturnLeft />
        </Button>
        <InputText
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className={clsx(
            "bg-transparent border-0 focus:outline-none hover:!bg-transparent",
            "!shadow-none flex-1 text-medusa-fg-base",
            "disabled:!bg-transparent disabled:cursor-not-allowed"
          )}
          placeholder="Ask me a question about Medusa..."
          autoFocus={true}
          passedRef={inputRef as React.RefObject<HTMLInputElement | null>}
          disabled={loading}
        />
        <span
          onClick={() => {
            setQuestion("")
            inputRef.current?.focus()
          }}
          className={clsx(
            "text-medusa-fg-muted hover:text-medusa-fg-subtle",
            "absolute top-docs_0.75 right-docs_1",
            "cursor-pointer",
            question.length === 0 && "hidden"
          )}
        >
          Clear
        </span>
      </div>
      <div className="h-[calc(100%-95px)] lg:max-h-[calc(100%-140px)] lg:min-h-[calc(100%-140px)] overflow-auto">
        <div ref={contentRef}>
          {!thread.length && <AiAssistantSuggestions className="mx-docs_0.5" />}
          {getThreadItems()}
          {(answer.length || loading) && (
            <AiAssistantThreadItem
              item={{
                type: "answer",
                content: answer,
                order: 0,
              }}
            />
          )}
        </div>
      </div>
      <div
        className={clsx(
          "py-docs_0.75 hidden md:flex items-center justify-end px-docs_1",
          "border-medusa-border-base border-t",
          "bg-medusa-bg-field-component"
        )}
      >
        <div className="flex items-center gap-docs_0.75">
          <div className="flex items-center gap-docs_0.5">
            {thread.length === 0 && (
              <>
                <span
                  className={clsx(
                    "text-medusa-fg-subtle",
                    "text-compact-x-small"
                  )}
                >
                  Navigate FAQ
                </span>
                <span className="gap-[5px] flex">
                  <Kbd
                    className={clsx(
                      "!bg-medusa-bg-field-component !border-medusa-border-strong",
                      "!text-medusa-fg-subtle h-[18px] w-[18px] p-0"
                    )}
                  >
                    ↑
                  </Kbd>
                  <Kbd
                    className={clsx(
                      "!bg-medusa-bg-field-component !border-medusa-border-strong",
                      "!text-medusa-fg-subtle h-[18px] w-[18px] p-0"
                    )}
                  >
                    ↓
                  </Kbd>
                </span>
              </>
            )}
            {thread.length > 0 && (
              <span
                className={clsx("text-medusa-fg-muted", "text-compact-x-small")}
              >
                Chat is cleared on exit
              </span>
            )}
          </div>
          <div
            className={clsx("h-docs_0.75 w-px bg-medusa-border-strong")}
          ></div>
          <div className="flex items-center gap-docs_0.5">
            <span
              className={clsx("text-medusa-fg-subtle", "text-compact-x-small")}
            >
              Ask Question
            </span>
            <Kbd
              className={clsx(
                "!bg-medusa-bg-field-component !border-medusa-border-strong",
                "!text-medusa-fg-subtle h-[18px] w-[18px] p-0"
              )}
            >
              ↵
            </Kbd>
          </div>
        </div>
      </div>
    </div>
  )
}
