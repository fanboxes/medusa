"use client"

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useAiAssistant } from ".."
import useResizeObserver from "@react-hook/resize-observer"

export type AiAssistantChatContextType = {
  handleSubmit: (selectedQuestion?: string) => void
  getThreadItems: () => AiAssistantThread[]
  question: string
  setQuestion: React.Dispatch<React.SetStateAction<string>>
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>
  contentRef: React.RefObject<HTMLDivElement | null>
  loading: boolean
  thread: AiAssistantThread[]
  answer: string
}

const AiAssistantChatContext = createContext<AiAssistantChatContextType | null>(
  null
)

export type AiAssistantChunk = {
  stream_end: boolean
} & (
  | {
      type: "relevant_sources"
      content: {
        relevant_sources: AiAssistantRelevantSources[]
      }
    }
  | {
      type: "partial_answer"
      content: AiAssistantPartialAnswer
    }
  | {
      type: "identifiers"
      content: AiAssistantIdentifier
    }
  | {
      type: "error"
      content: AiAssistantError
    }
)

export type AiAssistantRelevantSources = {
  title: string
  source_url: string
}

export type AiAssistantPartialAnswer = {
  text: string
}

export type AiAssistantIdentifier = {
  thread_id: string
  question_answer_id: string
}

export type AiAssistantError = {
  reason: string
}

export type AiAssistantThread = {
  type: "question" | "answer" | "error"
  content: string
  question_id?: string
  sources?: AiAssistantRelevantSources[]
  // for some reason, items in the array get reordered
  // sometimes, so this is one way to avoid it
  order: number
}

type AiAssistantChatProvider = {
  children: React.ReactNode
}

export const AiAssistantChatProvider = ({
  children,
}: AiAssistantChatProvider) => {
  const [question, setQuestion] = useState("")
  // this helps set the `order` field of the threadtype
  const [messagesCount, setMessagesCount] = useState(0)
  const [thread, setThread] = useState<AiAssistantThread[]>([])
  const [answer, setAnswer] = useState("")
  const [answerSources, setAnswerSources] = useState<
    AiAssistantRelevantSources[]
  >([])
  const [identifiers, setIdentifiers] = useState<AiAssistantIdentifier | null>(
    null
  )
  const [loading, setLoading] = useState(false)
  const [preventAutoScroll, setPreventAutoScroll] = useState(false)
  const { getAnswer } = useAiAssistant()
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const handleSubmit = (selectedQuestion?: string) => {
    if (!selectedQuestion?.length && !question.length) {
      return
    }
    setLoading(true)
    setPreventAutoScroll(false)
    setAnswer("")
    setThread((prevThread) => [
      ...prevThread,
      {
        type: "question",
        content: selectedQuestion || question,
        order: getNewOrder(prevThread),
      },
    ])
    setMessagesCount((prev) => prev + 1)
  }

  const sortThread = (threadArr: AiAssistantThread[]) => {
    const sortedThread = [...threadArr]
    sortedThread.sort((itemA, itemB) => {
      if (itemA.order < itemB.order) {
        return -1
      }

      return itemA.order < itemB.order ? 1 : 0
    })
    return sortedThread
  }

  const getNewOrder = (prevThread: AiAssistantThread[]) => {
    const sortedThread = sortThread(prevThread)

    return sortedThread.length === 0
      ? messagesCount + 1
      : sortedThread[prevThread.length - 1].order + 1
  }

  const setError = (logMessage?: string) => {
    if (logMessage?.length) {
      console.error(`[AI ERROR]: ${logMessage}`)
    }
    setThread((prevThread) => [
      ...prevThread,
      {
        type: "error",
        content:
          "I'm sorry, but I'm having trouble connecting to my knowledge base. Please try again. If the issue keeps persisting, please consider reporting an issue.",
        order: getNewOrder(prevThread),
      },
    ])
    setMessagesCount((prev) => prev + 1)
    setLoading(false)
    setQuestion("")
    setAnswer("")
    inputRef.current?.focus()
  }

  const scrollToBottom = () => {
    if (preventAutoScroll) {
      return
    }
    const parent = contentRef.current?.parentElement as HTMLElement

    parent.scrollTop = parent.scrollHeight
  }

  const lastAnswerIndex = useMemo(() => {
    const index = thread.reverse().findIndex((item) => item.type === "answer")
    return index !== -1 ? index : 0
  }, [thread])

  const process_stream = useCallback(async (response: Response) => {
    const reader = response.body?.getReader()
    if (!reader) {
      return
    }
    const decoder = new TextDecoder("utf-8")
    const delimiter = "\u241E"
    const delimiterBytes = new TextEncoder().encode(delimiter)
    let buffer = new Uint8Array()

    const findDelimiterIndex = (arr: Uint8Array) => {
      for (let i = 0; i < arr.length - delimiterBytes.length + 1; i++) {
        let found = true
        for (let j = 0; j < delimiterBytes.length; j++) {
          if (arr[i + j] !== delimiterBytes[j]) {
            found = false
            break
          }
        }
        if (found) {
          return i
        }
      }
      return -1
    }

    let result
    let loop = true
    while (loop) {
      result = await reader.read()
      if (result.done) {
        loop = false
        continue
      }
      buffer = new Uint8Array([...buffer, ...result.value])
      let delimiterIndex
      while ((delimiterIndex = findDelimiterIndex(buffer)) !== -1) {
        const chunkBytes = buffer.slice(0, delimiterIndex)
        const chunkText = decoder.decode(chunkBytes)
        buffer = buffer.slice(delimiterIndex + delimiterBytes.length)
        const chunk = JSON.parse(chunkText).chunk as AiAssistantChunk

        switch (chunk.type) {
          case "partial_answer":
            setAnswer((prevAnswer) => prevAnswer + chunk.content.text)
            break
          case "identifiers":
            setIdentifiers(chunk.content)
            break
          case "error":
            setError(chunk.content.reason)
            loop = false
            return
          case "relevant_sources":
            setAnswerSources((prev) => [
              ...prev,
              ...chunk.content.relevant_sources,
            ])
            break
        }
      }
    }

    setLoading(false)
    setQuestion("")
  }, [])

  const fetchAnswer = useCallback(async () => {
    try {
      const response = await getAnswer(question, identifiers?.thread_id)

      if (response.status === 200) {
        await process_stream(response)
      } else {
        const message = await response.text()
        setError(message)
      }
    } catch (error: any) {
      setError(JSON.stringify(error))
    }
  }, [question, identifiers, process_stream])

  useEffect(() => {
    if (loading && !answer) {
      void fetchAnswer()
    }
  }, [loading, fetchAnswer])

  useEffect(() => {
    if (
      loading ||
      !answer.length ||
      thread[lastAnswerIndex]?.content === answer
    ) {
      return
    }

    const uniqueAnswerSources = answerSources
      .filter(
        (source, index) =>
          answerSources.findIndex((s) => s.source_url === source.source_url) ===
          index
      )
      .map((source) => {
        const separatorIndex = source.title.indexOf("|")
        return {
          ...source,
          title:
            separatorIndex !== -1
              ? source.title.slice(0, separatorIndex)
              : source.title,
        }
      })
    setThread((prevThread) => [
      ...prevThread,
      {
        type: "answer",
        content: answer,
        question_id: identifiers?.question_answer_id,
        order: getNewOrder(prevThread),
        sources:
          uniqueAnswerSources.length > 3
            ? uniqueAnswerSources.slice(0, 3)
            : uniqueAnswerSources,
      },
    ])
    setAnswer("")
    setAnswerSources([])
    setMessagesCount((prev) => prev + 1)
    inputRef.current?.focus()
    scrollToBottom()
  }, [loading, answer, thread, lastAnswerIndex, inputRef.current])

  useResizeObserver(contentRef as React.RefObject<HTMLDivElement>, () => {
    if (!loading) {
      return
    }

    scrollToBottom()
  })

  const handleUserScroll = useCallback(() => {
    if (!question.length || preventAutoScroll) {
      return
    }

    setPreventAutoScroll(true)
  }, [question, preventAutoScroll])

  const handleUserScrollEnd = useCallback(() => {
    if (preventAutoScroll) {
      setPreventAutoScroll(false)
    }
  }, [preventAutoScroll])

  useEffect(() => {
    if (!contentRef.current?.parentElement) {
      return
    }

    contentRef.current.parentElement.addEventListener("wheel", handleUserScroll)
    contentRef.current.parentElement.addEventListener(
      "touchmove",
      handleUserScroll
    )

    return () => {
      contentRef.current?.parentElement?.removeEventListener(
        "wheel",
        handleUserScroll
      )
      contentRef.current?.parentElement?.removeEventListener(
        "touchmove",
        handleUserScroll
      )
    }
  }, [contentRef.current, handleUserScroll])

  const getThreadItems = useCallback(() => {
    return sortThread(thread)
  }, [thread])

  return (
    <AiAssistantChatContext.Provider
      value={{
        handleSubmit,
        getThreadItems,
        question,
        setQuestion,
        inputRef,
        contentRef,
        loading,
        thread,
        answer,
      }}
    >
      {children}
    </AiAssistantChatContext.Provider>
  )
}

export const useAiAssistantChat = () => {
  const context = useContext(AiAssistantChatContext)

  if (!context) {
    throw new Error(
      "useAiAssistantChat must be used within a AiAssistantChatContext"
    )
  }

  return context
}
