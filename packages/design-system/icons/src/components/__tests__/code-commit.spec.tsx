  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CodeCommit from "../code-commit"

  describe("CodeCommit", () => {
    it("should render the icon without errors", async () => {
      render(<CodeCommit data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })