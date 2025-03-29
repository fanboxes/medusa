"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react"
import { BadgeProps, Modal, Search, SearchProps } from "@/components"
import { checkArraySameElms } from "../../utils"
import {
  liteClient as algoliasearch,
  LiteClient as SearchClient,
} from "algoliasearch/lite"
import clsx from "clsx"
// @ts-expect-error can't install the types package because it doesn't support React v19
import { CSSTransition, SwitchTransition } from "react-transition-group"

export type SearchCommand = {
  name: string
  component?: React.ReactNode
  action?: () => void
  icon?: React.ReactNode
  title: string
  badge?: BadgeProps
}

export type SearchContextType = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  defaultFilters: string[]
  setDefaultFilters: (value: string[]) => void
  searchClient: SearchClient
  commands: SearchCommand[]
  command: SearchCommand | null
  setCommand: React.Dispatch<React.SetStateAction<SearchCommand | null>>
  setCommands: React.Dispatch<React.SetStateAction<SearchCommand[]>>
  modalRef: React.MutableRefObject<HTMLDialogElement | null>
}

const SearchContext = createContext<SearchContextType | null>(null)

export type AlgoliaIndex = {
  name: string
  title: string
}

export type AlgoliaProps = {
  appId: string
  apiKey: string
  mainIndexName: string
  indices: AlgoliaIndex[]
}

export type SearchProviderProps = {
  children: React.ReactNode
  initialDefaultFilters?: string[]
  algolia: AlgoliaProps
  searchProps: Omit<SearchProps, "algolia">
  commands?: SearchCommand[]
  modalClassName?: string
}

export const SearchProvider = ({
  children,
  initialDefaultFilters = [],
  searchProps,
  algolia,
  commands: initialCommands = [],
  modalClassName,
}: SearchProviderProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [defaultFilters, setDefaultFilters] = useState<string[]>(
    initialDefaultFilters
  )
  const [commands, setCommands] = useState<SearchCommand[]>(initialCommands)
  const [command, setCommand] = useState<SearchCommand | null>(null)

  const modalRef = useRef<HTMLDialogElement | null>(null)

  const searchClient: SearchClient = useMemo(() => {
    const algoliaClient = algoliasearch(algolia.appId, algolia.apiKey)
    return {
      ...algoliaClient,
      // async search(searchParams) {
      //   const requests =
      //     "requests" in searchParams ? searchParams.requests : searchParams
      //   // always send this request, which is the main request with no filters
      //   const mainRequest = requests[0]
      //   const params = (mainRequest.params || {}) as Record<string, unknown>
      //   if (!params.query) {
      //     return Promise.resolve({
      //       results: requests.map(() => ({
      //         hits: [],
      //         nbHits: 0,
      //         nbPages: 0,
      //         page: 0,
      //         processingTimeMS: 0,
      //         hitsPerPage: 0,
      //         exhaustiveNbHits: false,
      //         query: "",
      //         params: "",
      //       })),
      //     })
      //   }

      //   // retrieve only requests that have filters
      //   // this is to ensure that we show no result if no filter is selected
      //   const requestsWithFilters = requests.filter((item) => {
      //     if (
      //       !item.params ||
      //       typeof item.params !== "object" ||
      //       !("facetFilters" in item.params)
      //     ) {
      //       return false
      //     }

      //     const facetFilters = item.params.facetFilters as string[]

      //     // if no tag filters are specified, there's still one item,
      //     // which is an empty array
      //     return facetFilters.length >= 1 && facetFilters[0].length > 0
      //   })

      //   // check whether a query is entered in the search box
      //   const noQueries = requestsWithFilters.every(
      //     (item) =>
      //       !item.facetQuery &&
      //       (!item.params ||
      //         typeof item.params !== "object" ||
      //         !("query" in item.params) ||
      //         !item.params.query)
      //   )

      //   const newRequests: typeof requestsWithFilters = [mainRequest]
      //   if (!noQueries) {
      //     // split requests per tags
      //     for (const request of requestsWithFilters) {
      //       const params = request.params as Record<string, unknown>
      //       const facetFilters = (params.facetFilters as string[][])[0]

      //       // if only one tag is selected, keep the request as-is
      //       if (facetFilters.length === 1) {
      //         newRequests.push(request)

      //         continue
      //       }

      //       // if multiple tags are selected, split the tags
      //       // to retrieve a small subset of results per each tag.
      //       newRequests.push(
      //         ...facetFilters.map((tag) => {
      //           // get the filter's details in case it has custom hitsPerPage
      //           const filterDetails = searchFilters.find(
      //             (item) => `_tags:${item.value}` === tag
      //           )
      //           return {
      //             ...request,
      //             params: {
      //               ...params,
      //               facetFilters: [tag],
      //             },
      //             hitsPerPage: filterDetails?.hitsPerPage || 3,
      //           }
      //         })
      //       )
      //     }
      //   }

      //   return algoliaClient
      //     .search<ExpandedHits>(newRequests)
      //     .then((response) => {
      //       if (newRequests.length === 1) {
      //         return response
      //       }
      //       // combine results of the same index and return the results
      //       const resultsByIndex: {
      //         [indexName: string]: SearchResponse<ExpandedHits>
      //       } = {}
      //       // extract the response of the main request
      //       const mainResult = response.results[0]

      //       response.results.forEach((result, indexNum) => {
      //         if (indexNum === 0) {
      //           // ignore the main request's result
      //           return
      //         }
      //         const resultIndex = "index" in result ? result.index : undefined
      //         const resultHits = "hits" in result ? result.hits : []

      //         if (!resultIndex) {
      //           return
      //         }

      //         resultsByIndex[resultIndex] = {
      //           ...result,
      //           ...(resultsByIndex[resultIndex] || {}),
      //           hits: [
      //             ...(resultsByIndex[resultIndex]?.hits || []),
      //             ...resultHits,
      //           ],
      //           nbHits:
      //             (resultsByIndex[resultIndex]?.nbHits || 0) +
      //             resultHits.length,
      //         }
      //       })

      //       const newResults = Object.values(resultsByIndex).flatMap(
      //         (result) => ({
      //           ...result,
      //           hits: ("hits" in result ? result.hits : []).sort((a, b) => {
      //             const typosA = a._rankingInfo?.nbTypos || 0
      //             const typosB = b._rankingInfo?.nbTypos || 0
      //             const tagASortOrder =
      //               searchFilters.find((item) =>
      //                 a._tags.find((tag) => tag === item.value)
      //               )?.internalSortOrder || 0
      //             const tagBSortorder =
      //               searchFilters.find((item) =>
      //                 b._tags.find((tag) => tag === item.value)
      //               )?.internalSortOrder || 0
      //             if (
      //               a.type === "lvl1" &&
      //               typosA <= typosB &&
      //               tagASortOrder >= tagBSortorder
      //             ) {
      //               return -1
      //             }

      //             if (
      //               b.type === "lvl1" &&
      //               typosB <= typosA &&
      //               tagBSortorder >= tagASortOrder
      //             ) {
      //               return 1
      //             }

      //             return 0
      //           }),
      //         })
      //       )

      //       return {
      //         // append the results with the main request's results
      //         results: [mainResult, ...newResults],
      //       } as SearchResponses<any>
      //     })
      // },
    }
  }, [algolia.appId, algolia.apiKey])

  useEffect(() => {
    if (
      initialDefaultFilters.length &&
      !checkArraySameElms(defaultFilters, initialDefaultFilters)
    ) {
      setDefaultFilters(initialDefaultFilters)
    }
  }, [initialDefaultFilters])

  const componentWrapperRef = useRef(null)

  useEffect(() => {
    command?.action?.()
  }, [command])

  return (
    <SearchContext.Provider
      value={{
        isOpen,
        setIsOpen,
        defaultFilters,
        setDefaultFilters,
        searchClient,
        commands,
        command,
        setCommand,
        modalRef,
        setCommands,
      }}
    >
      {children}
      <Modal
        contentClassName={clsx(
          "!p-0 overflow-hidden relative h-full",
          "flex flex-col justify-between"
        )}
        modalContainerClassName="!h-[95%] max-h-[95%] md:!h-[480px] md:max-h-[480px]"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        passedRef={modalRef}
        className={modalClassName}
      >
        <SwitchTransition>
          <CSSTransition
            classNames={{
              enter:
                command === null || !command.component
                  ? "animate-fadeInLeft animate-fast"
                  : "animate-fadeInRight animate-fast",
              exit:
                command === null || !command.component
                  ? "animate-fadeOutLeft animate-fast"
                  : "animate-fadeOutRight animate-fast",
            }}
            timeout={250}
            key={command?.component ? command.name : "search"}
            nodeRef={componentWrapperRef}
          >
            <div ref={componentWrapperRef} className="h-full">
              {!command?.component && (
                <Search {...searchProps} algolia={algolia} />
              )}
              {command?.component}
            </div>
          </CSSTransition>
        </SwitchTransition>
      </Modal>
    </SearchContext.Provider>
  )
}

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext)

  if (!context) {
    throw new Error("useSearch must be used inside a SearchProvider")
  }

  return context
}
