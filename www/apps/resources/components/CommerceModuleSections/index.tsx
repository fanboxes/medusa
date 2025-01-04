"use client"

import { H2, Hr, useChildDocs } from "docs-ui"
import React, { useMemo } from "react"

type CommerceModuleSectionsProps = {
  name: string
}

export const CommerceModuleSections = ({
  name,
}: CommerceModuleSectionsProps) => {
  const guideComponents: (JSX.Element | JSX.Element[])[] = []
  const referenceComponents: (JSX.Element | JSX.Element[])[] = []
  const { items: workflowItems, component: workflowsComponent } = useChildDocs({
    showItems: ["Workflows"],
    titleLevel: 3,
    itemsPerRow: 2,
  })
  const { items: stepItems, component: stepsComponent } = useChildDocs({
    showItems: ["Steps"],
    titleLevel: 3,
    itemsPerRow: 2,
  })

  const hideWorkflowsSection = useMemo(() => {
    return !workflowItems?.default.length && !stepItems?.default.length
  }, [workflowItems, stepItems])

  const { items: serverGuideItems, component: serverGuidesComponent } =
    useChildDocs({
      showItems: ["Server Guides"],
      itemsPerRow: 2,
    })
  if (serverGuideItems?.default.length) {
    guideComponents.push(serverGuidesComponent)
  }
  const { items: storefrontGuideItems, component: storefrontGuidesComponent } =
    useChildDocs({
      showItems: ["Storefront Guides"],
      itemsPerRow: 2,
    })
  if (storefrontGuideItems?.default.length) {
    guideComponents.push(storefrontGuidesComponent)
  }
  const { items: adminGuideItems, component: adminGuidesComponent } =
    useChildDocs({
      showItems: ["Admin Guides"],
      itemsPerRow: 2,
    })
  if (adminGuideItems?.default.length) {
    guideComponents.push(adminGuidesComponent)
  }
  const { items: userGuideItems, component: userGuidesComponent } =
    useChildDocs({
      showItems: ["User Guides"],
      itemsPerRow: 2,
    })
  if (userGuideItems?.default.length) {
    guideComponents.push(userGuidesComponent)
  }
  const { items: jsSdkItems, component: jsSdkComponent } = useChildDocs({
    showItems: ["JS SDK"],
    itemsPerRow: 2,
  })
  if (jsSdkItems?.default.length) {
    referenceComponents.push(jsSdkComponent)
  }
  const { items: referenceItems, component: referencesComponent } =
    useChildDocs({
      showItems: ["References"],
      itemsPerRow: 2,
    })
  if (referenceItems?.default.length) {
    referenceComponents.push(referencesComponent)
  }

  return (
    <>
      {guideComponents.map((component, i) => (
        <React.Fragment key={i}>
          <>
            {i !== 0 && <Hr />}
            {component}
          </>
        </React.Fragment>
      ))}
      {!hideWorkflowsSection && (
        <>
          {guideComponents.length > 0 && <Hr />}
          <H2 id="medusa-workflows-and-steps">Medusa Workflows and Steps</H2>
          <p>
            Medusa provides the following workflows and steps that use the{" "}
            {name} Module. You can use these workflows and steps in your
            customizations:
          </p>
          {workflowsComponent}
          {stepsComponent}
        </>
      )}
      {referenceComponents.map((component, i) => (
        <React.Fragment key={i}>
          <>
            {(i !== 0 || !hideWorkflowsSection) && <Hr />}
            {component}
          </>
        </React.Fragment>
      ))}
    </>
  )
}
