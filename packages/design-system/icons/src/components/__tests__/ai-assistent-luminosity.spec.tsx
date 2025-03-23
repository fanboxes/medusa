  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import AiAssistentLuminosity from "../ai-assistent-luminosity"

  describe("AiAssistentLuminosity", () => {
    it("should render the icon without errors", async () => {
      render(<AiAssistentLuminosity data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })