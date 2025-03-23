  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Expand from "../expand"

  describe("Expand", () => {
    it("should render the icon without errors", async () => {
      render(<Expand data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })