"use client"

import { Tooltip as RadixTooltip } from "radix-ui"
import * as React from "react"

import { clx } from "@/utils/clx"

interface TooltipProps
  extends Omit<RadixTooltip.TooltipContentProps, "content" | "onClick">,
    Pick<
      RadixTooltip.TooltipProps,
      "open" | "defaultOpen" | "onOpenChange" | "delayDuration"
    > {
  content: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  side?: "bottom" | "left" | "top" | "right"
  maxWidth?: number
}

/**
 * This component is based on the [Radix UI Tooltip](https://www.radix-ui.com/primitives/docs/components/tooltip) primitive.
 *
 * @excludeExternal
 */
const Tooltip = ({
  children,
  content,
  open,
  defaultOpen,
  onOpenChange,
  delayDuration,
  /**
   * The maximum width of the tooltip.
   */
  maxWidth = 220,
  className,
  side,
  sideOffset = 8,
  onClick,
  ...props
}: TooltipProps) => {
  return (
      <RadixTooltip.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        delayDuration={delayDuration}
      >
        <RadixTooltip.Trigger onClick={onClick} asChild>
          {children}
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            sideOffset={sideOffset}
            align="center"
            className={clx(
              "txt-compact-xsmall text-ui-fg-subtle bg-ui-bg-base shadow-elevation-tooltip rounded-lg px-2.5 py-1",
              "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
              className
            )}
            {...props}
            style={{ ...props.style, maxWidth }}
          >
            {content}
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
  )
}

interface TooltipProviderProps extends RadixTooltip.TooltipProviderProps {}

const TooltipProvider = ({ children, delayDuration = 100, skipDelayDuration = 300, ...props }: TooltipProviderProps) => {
  return (
    <RadixTooltip.TooltipProvider delayDuration={delayDuration} skipDelayDuration={skipDelayDuration} {...props}>
      {children}
    </RadixTooltip.TooltipProvider>
  )
}


export { Tooltip, TooltipProvider }
