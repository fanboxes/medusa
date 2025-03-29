"use client"

import React, { Fragment, useEffect, useMemo, useState } from "react"
import clsx from "clsx"
import {
  Configure,
  ConfigureProps,
  Index,
  Snippet,
  useHits,
  useInstantSearch,
} from "react-instantsearch"
import { SearchNoResult } from "../NoResults"
import { AlgoliaIndex, useSearch } from "@/providers"
import { Link, SearchHitGroupName } from "@/components"

export type Hierarchy = "lvl0" | "lvl1" | "lvl2" | "lvl3" | "lvl4" | "lvl5"

export type HitType = {
  hierarchy: {
    lvl0: string | null
    lvl1: string | null
    lvl2: string | null
    lvl3: string | null
    lvl4: string | null
    lvl5: string | null
  }
  _tags: string[]
  url: string
  url_without_anchor: string
  type?: "lvl1" | "lvl2" | "lvl3" | "lvl4" | "lvl5" | "content"
  content?: string
  __position: number
  __queryID?: string
  objectID: string
  description?: string
}

export type GroupedHitType = {
  [k: string]: HitType[]
}

export type SearchHitWrapperProps = {
  configureProps: ConfigureProps
  indices: AlgoliaIndex[]
} & Omit<SearchHitsProps, "indexName" | "setNoResults">

export type IndexResults = {
  [k: string]: boolean
}

export const SearchHitsWrapper = ({
  configureProps,
  indices,
  ...rest
}: SearchHitWrapperProps) => {
  const { status } = useInstantSearch()
  const [hasNoResults, setHashNoResults] = useState<IndexResults>({
    [indices[0].name]: false,
    [indices[1].name]: false,
  })
  const showNoResults = useMemo(() => {
    return Object.values(hasNoResults).every((value) => value === true)
  }, [hasNoResults])

  const setNoResults = (index: string, value: boolean) => {
    setHashNoResults((prev: IndexResults) => ({
      ...prev,
      [index]: value,
    }))
  }

  return (
    <div className="h-full overflow-auto px-docs_0.5">
      {status !== "loading" && showNoResults && <SearchNoResult />}
      {indices.map((index, key) => (
        // @ts-expect-error React v19 doesn't see this type as a React element
        <Index indexName={index.name} key={key}>
          {!hasNoResults[index.name] && (
            <SearchHitGroupName name={index.title} />
          )}
          <SearchHits
            indexName={index.name}
            setNoResults={setNoResults}
            {...rest}
          />
          <Configure {...configureProps} />
        </Index>
      ))}
    </div>
  )
}

export type SearchHitsProps = {
  indexName: string
  setNoResults: (index: string, value: boolean) => void
  checkInternalPattern?: RegExp
}

export const SearchHits = ({
  indexName,
  setNoResults,
  checkInternalPattern,
}: SearchHitsProps) => {
  const { items: hits } = useHits<HitType>()
  const { status } = useInstantSearch()
  const { setIsOpen } = useSearch()

  useEffect(() => {
    if (status !== "loading" && status !== "stalled") {
      setNoResults(indexName, hits.length === 0)
    }
  }, [hits, status])

  const checkIfInternal = (url: string): boolean => {
    if (!checkInternalPattern) {
      return false
    }
    return checkInternalPattern.test(url)
  }

  return (
    <div
      className={clsx(
        "overflow-auto",
        "[&_mark]:bg-medusa-bg-highlight",
        "[&_mark]:text-medusa-fg-interactive"
      )}
    >
      {hits.map((item, index) => {
        const hierarchies = Object.values(item.hierarchy)
          .filter(Boolean)
          .join(" › ")
        return (
          <div
            className={clsx(
              "gap-docs_0.25 relative flex flex-1 flex-col p-docs_0.5",
              "overflow-x-hidden text-ellipsis whitespace-nowrap break-words",
              "hover:bg-medusa-bg-base-hover",
              "focus:bg-medusa-bg-base-hover",
              "focus:outline-none"
            )}
            key={index}
            tabIndex={index}
            data-hit
            onClick={(e) => {
              const target = e.target as Element
              if (target.tagName.toLowerCase() === "div") {
                target.querySelector("a")?.click()
              }
            }}
          >
            <span
              className={clsx(
                "text-compact-small-plus text-medusa-fg-base",
                "max-w-full"
              )}
            >
              {/* @ts-expect-error React v19 doesn't see this type as a React element */}
              <Snippet attribute={"hierarchy.lvl1"} hit={item} />
            </span>
            <span className="text-compact-small text-medusa-fg-subtle text-ellipsis overflow-hidden">
              {item.type === "content" && (
                <>
                  {/* @ts-expect-error React v19 doesn't see this type as a React element */}
                  <Snippet attribute={"content"} hit={item} />
                </>
              )}
              {item.type !== "content" && item.description}
            </span>

            <span
              className={clsx(
                "text-ellipsis overflow-hidden",
                "text-medusa-fg-muted items-center text-compact-x-small"
              )}
            >
              {hierarchies}
            </span>
            <Link
              href={item.url}
              className="absolute top-0 left-0 h-full w-full"
              target="_self"
              onClick={(e) => {
                if (checkIfInternal(item.url)) {
                  e.preventDefault()
                  window.location.href = item.url
                  setIsOpen(false)
                }
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
