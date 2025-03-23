  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ArrowRight from "../arrow-right"

  describe("ArrowRight", () => {
    it("should render the icon without errors", async () => {
      render(<ArrowRight data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })