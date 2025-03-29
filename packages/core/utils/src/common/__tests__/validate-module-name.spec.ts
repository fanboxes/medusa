import { validateModuleName } from "../validate-module-name"

describe("validateModuleName", function () {
  it("should disallow variable unsafe module names", function () {
    const expectations = [
      {
        input: "hello-world",
        state: "fail",
      },
      {
        input: "hello_world",
        state: "pass",
      },
      {
        input: "1st_plugin",
        state: "fail",
      },
      {
        input: "plugin_1st",
        state: "pass",
      },
      {
        input: "acme.module",
        state: "fail",
      },
      {
        input: "acme$module",
        state: "fail",
      },
      {
        input: "$module",
        state: "fail",
      },
      {
        input: "_private_module",
        state: "pass",
      },
      {
        input: "acme&corp_module",
        state: "fail",
      },
    ]

    expectations.forEach((expectation) => {
      if (expectation.state === "fail") {
        expect(() => validateModuleName(expectation.input)).toThrow(
          `Invalid module name "${expectation.input}". Module names must be alpha numeric and may contain an underscore`
        )
      } else {
        expect(() => validateModuleName(expectation.input)).not.toThrow()
      }
    })
  })
})
