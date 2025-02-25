import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { HttpTypes } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { setupTaxStructure } from "../../../../modules/__tests__/fixtures"

jest.setTimeout(300000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let region: HttpTypes.AdminRegion
    let testDraftOrder: HttpTypes.AdminDraftOrder

    beforeEach(async () => {
      const container = getContainer()

      await setupTaxStructure(container.resolve(ModuleRegistrationName.TAX))
      await createAdminUser(dbConnection, adminHeaders, container)

      region = (
        await api.post(
          `/admin/regions`,
          {
            name: "USA",
            currency_code: "usd",
            countries: ["US"],
          },
          adminHeaders
        )
      ).data.region

      testDraftOrder = (
        await api.post(
          "/admin/draft-orders",
          { email: "test@test.com", region_id: region.id },
          adminHeaders
        )
      ).data.draft_order
    })

    describe("GET /draft-orders", () => {
      it("should get a list of draft orders", async () => {
        const response = await api.get("/admin/draft-orders", adminHeaders)

        expect(response.status).toBe(200)
        expect(response.data.draft_orders).toBeDefined()
        expect(response.data.draft_orders.length).toBe(1)
        expect(response.data.draft_orders).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              email: "test@test.com",
            }),
          ])
        )
      })
    })

    describe("POST /draft-orders", () => {
      it("should create a draft order", async () => {
        const response = await api.post(
          "/admin/draft-orders",
          {
            email: "test2@test.com",
            region_id: region.id,
          },
          adminHeaders
        )

        expect(response.status).toBe(200)
        expect(response.data.draft_order.email).toBe("test2@test.com")
        expect(response.data.draft_order.region_id).toBe(region.id)
      })
    })

    describe("GET /draft-orders/:id", () => {
      it("should get a draft order", async () => {
        const response = await api.get(
          `/admin/draft-orders/${testDraftOrder.id}`,
          adminHeaders
        )

        expect(response.status).toBe(200)
        expect(response.data.draft_order.email).toBe("test@test.com")
        expect(response.data.draft_order.region_id).toBe(region.id)
      })
    })

    describe("POST /draft-orders/:id", () => {
      it("should update a draft order", async () => {
        const response = await api.post(
          `/admin/draft-orders/${testDraftOrder.id}`,
          {
            email: "test_new@test.com",
          },
          adminHeaders
        )

        expect(response.status).toBe(200)
        expect(response.data.draft_order.email).toBe("test_new@test.com")
      })
    })
  },
})
