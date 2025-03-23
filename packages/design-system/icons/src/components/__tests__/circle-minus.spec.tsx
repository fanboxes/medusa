  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CircleMinus from "../circle-minus"

  describe("CircleMinus", () => {
    it("should render the icon without errors", async () => {
      render(<CircleMinus data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })