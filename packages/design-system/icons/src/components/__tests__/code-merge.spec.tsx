  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CodeMerge from "../code-merge"

  describe("CodeMerge", () => {
    it("should render the icon without errors", async () => {
      render(<CodeMerge data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })