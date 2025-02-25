/**
 * @schema BaseOrderSummary
 * type: object
 * description: The order's summary details.
 * x-schemaName: BaseOrderSummary
 * required:
 *   - pending_difference
 *   - current_order_total
 *   - original_order_total
 *   - transaction_total
 *   - paid_total
 *   - refunded_total
 *   - accounting_total
 * properties:
 *   paid_total:
 *     type: number
 *     title: paid_total
 *     description: The total amount paid.
 *   refunded_total:
 *     type: number
 *     title: refunded_total
 *     description: The total amount refunded.
 *   pending_difference:
 *     type: number
 *     title: pending_difference
 *     description: The difference pending to be processed. If negative, the customer needs a refund. Otherwise, additional payment is required from the customer.
 *   current_order_total:
 *     type: number
 *     title: current_order_total
 *     description: The order's current total, could be the total after a change in the order.
 *   original_order_total:
 *     type: number
 *     title: original_order_total
 *     description: The order's original total.
 *   transaction_total:
 *     type: number
 *     title: transaction_total
 *     description: The total of the transactions made on the order.
 *   accounting_total:
 *     type: number
 *     title: accounting_total
 *     description: The order's total without the credit-line total.
 * 
*/

