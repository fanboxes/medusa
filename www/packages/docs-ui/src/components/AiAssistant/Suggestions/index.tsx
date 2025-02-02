"use client"

import React, { useMemo } from "react"
import { SearchSuggestionType } from "../../Search/Suggestions"
import { useAiAssistant } from "../../../providers"
import { SearchHitGroupName } from "../../Search/Hits/GroupName"
import { SearchSuggestionItem } from "../../Search/Suggestions/Item"
import { useAiAssistantChat } from "../../../providers/AiAssistant/Chat"

type AiAssistantSuggestionsProps = React.AllHTMLAttributes<HTMLDivElement>

export const AiAssistantSuggestions = (props: AiAssistantSuggestionsProps) => {
  const { version } = useAiAssistant()
  const { setQuestion, handleSubmit } = useAiAssistantChat()
  const suggestions: SearchSuggestionType[] = useMemo(() => {
    return version === "v2"
      ? [
          {
            title: "FAQ",
            items: [
              "What is Medusa?",
              "How can I create a module?",
              "How can I create a data model?",
              "How do I create a workflow?",
              "How can I extend a data model in the Product Module?",
            ],
          },
          {
            title: "Recipes",
            items: [
              "How do I build a marketplace with Medusa?",
              "How do I build digital products with Medusa?",
              "How do I build subscription-based purchases with Medusa?",
              "What other recipes are available in the Medusa documentation?",
            ],
          },
        ]
      : [
          {
            title: "FAQ",
            items: [
              "What is Medusa?",
              "How can I create an ecommerce store with Medusa?",
              "How can I build a marketplace with Medusa?",
              "How can I build subscription-based purchases with Medusa?",
              "How can I build digital products with Medusa?",
              "What can I build with Medusa?",
              "What is Medusa Admin?",
              "How do I configure the database in Medusa?",
            ],
          },
        ]
  }, [version])

  return (
    <div {...props}>
      {suggestions.map((suggestion, index) => (
        <React.Fragment key={index}>
          <SearchHitGroupName name={suggestion.title} />
          {suggestion.items.map((item, itemIndex) => (
            <SearchSuggestionItem
              onClick={() => {
                setQuestion(item)
                handleSubmit(item)
              }}
              key={itemIndex}
              tabIndex={itemIndex}
            >
              {item}
            </SearchSuggestionItem>
          ))}
        </React.Fragment>
      ))}
    </div>
  )
}
