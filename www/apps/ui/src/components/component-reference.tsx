import { Documentation } from "react-docgen"
import { Suspense } from "react"
import { Spinner } from "@medusajs/icons"
import { PropTable } from "./props-table"
import { Container } from "@medusajs/ui"
import { Feedback } from "./feedback"
import { H3, MarkdownContent } from "docs-ui"
import { components } from "./mdx-components"
import slugify from "slugify"

type ComponentReferenceProps = {
  mainComponent: string
  componentsToShow?: string[]
  specsSrc?: string
}

const ComponentReference = ({
  mainComponent,
  componentsToShow = [mainComponent],
  specsSrc,
}: ComponentReferenceProps) => {
  if (!specsSrc) {
    return <></>
  }

  const specs = JSON.parse(specsSrc) as Documentation[]

  return (
    <>
      {componentsToShow.map((component, index) => {
        const componentSpec = specs?.find(
          (spec) => spec.displayName === component
        )
        const hasProps =
          componentSpec?.props && Object.keys(componentSpec.props).length > 0
        const componentName =
          componentsToShow.length > 1
            ? componentSpec?.displayName || component
            : ""
        const componentSlug = slugify(componentName)
        return (
          <Suspense
            fallback={
              <div className="text-medusa-fg-muted flex flex-1 items-center justify-center">
                <Spinner className="animate-spin" />
              </div>
            }
            key={index}
          >
            {componentSpec && (
              <>
                {componentsToShow.length > 1 && (
                  <H3 id={componentSlug}>{componentName}</H3>
                )}
                {componentSpec.description && (
                  <MarkdownContent components={components}>
                    {componentSpec.description}
                  </MarkdownContent>
                )}
                {hasProps && (
                  <>
                    <Container className="mb-6 mt-8 overflow-hidden p-0">
                      <Suspense
                        fallback={
                          <div className="text-medusa-fg-muted flex flex-1 items-center justify-center">
                            <Spinner className="animate-spin" />
                          </div>
                        }
                      >
                        <PropTable props={componentSpec.props!} />
                      </Suspense>
                    </Container>
                    <Feedback
                      title={`props of ${component}`}
                      question="Was this helpful?"
                    />
                  </>
                )}
              </>
            )}
          </Suspense>
        )
      })}
    </>
  )
}

export { ComponentReference }
