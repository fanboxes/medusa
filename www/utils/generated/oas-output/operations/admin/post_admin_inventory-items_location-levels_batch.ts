/**
 * @oas [post] /admin/inventory-items/location-levels/batch
 * operationId: PostInventoryItemsLocationLevelsBatch
 * summary: Manage Inventory Levels
 * description: Manage inventory levels to create, update, or delete them.
 * x-authenticated: true
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminBatchInventoryItemsLocationLevels"
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/inventory-items/location-levels/batch' \
 *       -H 'Authorization: Bearer {access_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "create": [
 *           {
 *             "location_id": "sloc_123",
 *             "inventory_item_id": "iitem_123",
 *             "stocked_quantity": 100,
 *             "incoming_quantity": 50
 *           }
 *         ],
 *         "update": [
 *           {
 *             "location_id": "sloc_456",
 *             "inventory_item_id": "iitem_456",
 *             "stocked_quantity": 200,
 *             "incoming_quantity": 75
 *           }
 *         ],
 *         "delete": [
 *           "iilev_123"
 *         ]
 *       }'
 * tags:
 *   - Inventory Items
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminBatchInventoryItemsLocationLevelsResponse"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 * x-workflow: batchInventoryItemLevelsWorkflow
 * 
*/

