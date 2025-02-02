"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useAnalytics, useSearch } from "@/providers"
import { AiAssistantIcon, AiAssistantSearchWindow } from "@/components"
import { RecaptchaAction, useRecaptcha } from "../../hooks/use-recaptcha"
import { AiAssistantChatProvider } from "./Chat"

export type AiAssistantFeedbackType = "upvote" | "downvote"

export type AiAssistantChatType = "default" | "popover"

export type AiAssistantContextType = {
  getAnswer: (question: string, thread_id?: string) => Promise<Response>
  sendFeedback: (
    questionId: string,
    reaction: AiAssistantFeedbackType
  ) => Promise<Response>
  version: "v1" | "v2"
  chatOpened: boolean
  setChatOpened: React.Dispatch<React.SetStateAction<boolean>>
  chatType: AiAssistantChatType
}

const AiAssistantContext = createContext<AiAssistantContextType | null>(null)

export type AiAssistantProviderProps = {
  children?: React.ReactNode
  apiUrl: string
  recaptchaSiteKey: string
  websiteId: string
  version?: "v1" | "v2"
  type?: "search" | "chat"
  chatType?: AiAssistantChatType
}

export const AiAssistantProvider = ({
  apiUrl,
  recaptchaSiteKey,
  websiteId,
  version = "v2",
  children,
  type = "chat",
  chatType = "default",
}: AiAssistantProviderProps) => {
  const [chatOpened, setChatOpened] = useState(false)
  const { setCommands, setIsOpen, setCommand } = useSearch()
  const { analytics } = useAnalytics()
  const { execute: getReCaptchaToken } = useRecaptcha({
    siteKey: recaptchaSiteKey,
  })

  const sendRequest = async (
    apiPath: string,
    action: RecaptchaAction,
    method = "GET",
    headers?: HeadersInit,
    body?: BodyInit
  ) => {
    return await fetch(`${apiUrl}${apiPath}`, {
      method,
      headers: {
        "X-RECAPTCHA-ENTERPRISE-TOKEN": await getReCaptchaToken(action),
        "X-WEBSITE-ID": websiteId,
        ...headers,
      },
      body,
    })
  }

  const getAnswer = async (question: string, threadId?: string) => {
    const questionParam = encodeURI(question)
    return await sendRequest(
      threadId
        ? `/query/v1/thread/${threadId}/stream?query=${questionParam}`
        : `/query/v1/stream?query=${questionParam}`,
      RecaptchaAction.AskAi
    )
  }

  const sendFeedback = async (
    questionId: string,
    reaction: AiAssistantFeedbackType
  ) => {
    return await sendRequest(
      `/query/v1/question-answer/${questionId}/feedback`,
      RecaptchaAction.FeedbackSubmit,
      "POST",
      {
        "Content-Type": "application/json",
      },
      JSON.stringify({
        question_id: questionId,
        reaction,
        user_identifier: analytics?.user().anonymousId() || "",
      })
    )
  }

  useEffect(() => {
    setCommands((prevCommands) => {
      const newCommands = [...prevCommands]

      if (!newCommands.find((c) => c.name === "ai-assistant")) {
        newCommands.push({
          name: "ai-assistant",
          icon: <AiAssistantIcon />,
          title: "AI Assistant",
          badge: {
            variant: "blue",
            badgeType: "shaded",
            children: "Beta",
          },
          action: () => {
            setIsOpen(false)
            setChatOpened(true)
            setCommand(null)
          },
        })
      }

      return newCommands
    })
  }, [])

  return (
    <AiAssistantContext.Provider
      value={{
        getAnswer,
        sendFeedback,
        version,
        chatOpened,
        setChatOpened,
        chatType,
      }}
    >
      <AiAssistantChatProvider>
        {children}
        {type === "search" && <AiAssistantSearchWindow />}
      </AiAssistantChatProvider>
    </AiAssistantContext.Provider>
  )
}

export const useAiAssistant = () => {
  const context = useContext(AiAssistantContext)

  if (!context) {
    throw new Error("useAiAssistant must be used within a AiAssistantProvider")
  }

  return context
}
