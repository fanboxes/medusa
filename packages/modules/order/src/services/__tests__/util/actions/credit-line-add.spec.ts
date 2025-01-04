import { ChangeActionType } from "@medusajs/framework/utils"
import { VirtualOrder } from "@types"
import { calculateOrderChange } from "../../../../utils"

describe("Action: Credit Line Add", function () {
  const originalOrder: VirtualOrder = {
    id: "order_1",
    items: [
      {
        id: "item_1",
        quantity: 1,
        unit_price: 10,
        compare_at_unit_price: null,
        order_id: "1",

        detail: {
          quantity: 1,
          order_id: "1",
          delivered_quantity: 1,
          shipped_quantity: 1,
          fulfilled_quantity: 1,
          return_requested_quantity: 0,
          return_received_quantity: 0,
          return_dismissed_quantity: 0,
          written_off_quantity: 0,
        },
      },
    ],
    shipping_methods: [
      {
        id: "shipping_1",
        amount: 20,
        order_id: "1",
      },
    ],
    credit_lines: [],
    total: 30,
  }

  /*
    We have an original order with a total of 30, the summary would then be the following:

    {
      "transaction_total": 0,
      "original_order_total": 30,
      "current_order_total": 30,
      "pending_difference": 30,
      "difference_sum": 0,
      "paid_total": 0,
      "refunded_total": 0,
      "credit_line_total": 0
    }

    Upon adding a credit line, the order total and the pending difference will increase making it possible for the merchant
    to request the customer for a payment for an arbitrary reason, or prepare the order balance sheet to then allow
    the merchant to provide a refund.

    {
      "transaction_total": 0,
      "original_order_total": 30,
      "current_order_total": 60,
      "pending_difference": 60,
      "difference_sum": 30,
      "paid_total": 0,
      "refunded_total": 0,
      "credit_line_total": 30
    }
  */
  it("should add credit lines", function () {
    const actions = [
      {
        action: ChangeActionType.CREDIT_LINE_ADD,
        reference: "payment",
        reference_id: "payment_1",
        amount: 30,
      },
    ]

    const changes = calculateOrderChange({
      order: originalOrder,
      actions: actions,
      options: { addActionReferenceToObject: true },
    })

    const sumToJSON = JSON.parse(JSON.stringify(changes.summary))

    expect(sumToJSON).toEqual({
      transaction_total: 0,
      original_order_total: 30,
      current_order_total: 60,
      pending_difference: 60,
      difference_sum: 30,
      paid_total: 0,
      refunded_total: 0,
      credit_line_total: 30,
    })

    originalOrder.credit_lines.push({
      id: "credit_line_1",
      order_id: "order_1",
      reference: "payment",
      reference_id: "payment_1",
      amount: 10,
    })

    const actionsSecond = [
      {
        action: ChangeActionType.CREDIT_LINE_ADD,
        reference: "payment",
        reference_id: "payment_2",
        amount: 30,
      },
    ]

    const changesSecond = calculateOrderChange({
      order: originalOrder,
      actions: actionsSecond,
      options: { addActionReferenceToObject: true },
    })

    const sumToJSONSecond = JSON.parse(JSON.stringify(changesSecond.summary))

    expect(sumToJSONSecond).toEqual({
      transaction_total: 0,
      original_order_total: 30,
      current_order_total: 70,
      pending_difference: 70,
      difference_sum: 30,
      paid_total: 0,
      refunded_total: 0,
      credit_line_total: 40,
    })
  })
})
