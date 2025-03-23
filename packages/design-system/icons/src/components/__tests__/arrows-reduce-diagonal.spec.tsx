  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ArrowsReduceDiagonal from "../arrows-reduce-diagonal"

  describe("ArrowsReduceDiagonal", () => {
    it("should render the icon without errors", async () => {
      render(<ArrowsReduceDiagonal data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })