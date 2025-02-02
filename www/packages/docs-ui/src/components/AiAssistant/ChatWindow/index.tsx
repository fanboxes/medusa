"use client"

import clsx from "clsx"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useAiAssistant, useIsBrowser } from "../../../providers"
import { AiAssistantChatWindowHeader } from "./Header"
import { useAiAssistantChat } from "../../../providers/AiAssistant/Chat"
import { AiAssistantSuggestions } from "../Suggestions"
import { AiAssistantThreadItem } from "../ThreadItem"
import { AiAssistantChatWindowInput } from "./Input"
import { useAiAssistantChatNavigation, useKeyboardShortcut } from "../../.."
import { AiAssistantChatWindowFooter } from "./Footer"

const DEFAULT_HEIGHT = "calc(100% - 8px)"

export const AiAssistantChatWindow = () => {
  const { chatOpened, setChatOpened, chatType: type } = useAiAssistant()
  const [height, setHeight] = useState(DEFAULT_HEIGHT)
  const [showFade, setShowFade] = useState(false)
  const { isBrowser } = useIsBrowser()
  const {
    inputRef,
    thread,
    getThreadItems: getChatThreadItems,
    answer,
    loading,
    contentRef,
  } = useAiAssistantChat()
  const chatWindowRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (chatOpened) {
      inputRef.current?.focus({
        preventScroll: true,
      })
    } else {
      inputRef.current?.blur()
    }
  }, [chatOpened])

  const getThreadItems = useCallback(() => {
    const sortedThread = getChatThreadItems()

    return sortedThread.map((item, index) => (
      <AiAssistantThreadItem item={item} key={index} />
    ))
  }, [getChatThreadItems])

  useAiAssistantChatNavigation({
    getChatWindowElm: () => chatWindowRef.current as HTMLElement | null,
    getInputElm: () => inputRef.current as HTMLTextAreaElement | null,
    focusInput: () =>
      inputRef.current?.focus({
        preventScroll: true,
      }),
  })

  useKeyboardShortcut({
    metakey: false,
    shortcutKeys: ["escape"],
    checkEditing: false,
    action: () => {
      if (!chatWindowRef.current?.contains(document.activeElement)) {
        return
      }

      setChatOpened(false)
    },
  })

  const checkShowFade = () => {
    const parentElm = contentRef.current?.parentElement
    if (!parentElm) {
      return
    }
    setShowFade(
      !loading &&
        parentElm.offsetHeight + parentElm.scrollTop < parentElm.scrollHeight
    )
  }

  useEffect(() => {
    if (!contentRef.current?.parentElement) {
      return
    }
    contentRef.current.parentElement.addEventListener("scroll", checkShowFade)

    return () => {
      contentRef.current?.parentElement?.removeEventListener(
        "scroll",
        checkShowFade
      )
    }
  }, [contentRef.current])

  useEffect(() => {
    if (loading) {
      setShowFade(false)
    } else {
      checkShowFade()
    }
  }, [loading])

  const changeHeightForViewport = () => {
    if (!window.visualViewport?.height) {
      setHeight(DEFAULT_HEIGHT)
      return
    }

    setHeight(`${window.visualViewport.height - 8}px`)
  }

  useEffect(() => {
    if (!isBrowser) {
      return
    }

    window.visualViewport?.addEventListener("resize", changeHeightForViewport)

    return () => {
      window.visualViewport?.removeEventListener(
        "resize",
        changeHeightForViewport
      )
    }
  }, [isBrowser])

  useEffect(() => {
    checkShowFade()
  }, [height])

  return (
    <>
      <div
        className={clsx(
          "fixed top-0 left-0 h-screen w-screen z-50 bg-medusa-bg-overlay",
          !chatOpened && "hidden",
          chatOpened && "block",
          type === "default" && "xxl:hidden"
        )}
        onClick={() => setChatOpened(false)}
      />
      <div
        className={clsx(
          "flex z-50 w-[calc(100%-8px)] md:w-ai-assistant transition-[height,right]",
          "absolute -right-[150%] sm:-right-full top-0",
          type === "default" && [
            "xxl:w-0 xxl:relative xxl:transition-[height,right,width]",
            "xxl:shadow-elevation-card-rest xxl:dark:shadow-elevation-card-rest-dark",
            chatOpened && "xxl:!w-ai-assistant",
          ],
          "shadow-elevation-modal dark:shadow-elevation-modal-dark",
          "bg-medusa-bg-base rounded-docs_DEFAULT overflow-x-hidden",
          "flex-col justify-between m-docs_0.25 max-w-ai-assistant",
          chatOpened && ["!right-0"],
          !chatOpened && ["!fixed"]
        )}
        style={{
          height,
        }}
        ref={chatWindowRef}
      >
        <AiAssistantChatWindowHeader />
        <div className="flex flex-auto overflow-auto relative">
          <div
            className={clsx(
              "overflow-y-auto flex-auto px-docs_0.5 pt-docs_0.25 pb-docs_2"
            )}
          >
            <div ref={contentRef}>
              {!thread.length && <AiAssistantSuggestions />}
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
          <span
            className={clsx(
              "bg-ai-assistant-bottom content-[''] absolute pointer-events-none",
              "bottom-0 left-0 w-full h-docs_6 z-10 opacity-0 transition-opacity",
              showFade && "opacity-100"
            )}
          ></span>
        </div>
        <AiAssistantChatWindowInput />
        <AiAssistantChatWindowFooter />
      </div>
    </>
  )
}
