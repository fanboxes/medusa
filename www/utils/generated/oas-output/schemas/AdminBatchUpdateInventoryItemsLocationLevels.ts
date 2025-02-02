/**
 * @schema AdminBatchUpdateInventoryItemsLocationLevels
 * type: object
 * description: The details of an inventory level to update.
 * required:
 *   - location_id
 *   - inventory_item_id
 * properties:
 *   location_id:
 *     type: string
 *     title: location_id
 *     description: The ID of the associated stock location.
 *   inventory_item_id:
 *     type: string
 *     title: inventory_item_id
 *     description: The ID of the associated inventory item.
 *   stocked_quantity:
 *     type: number
 *     title: stocked_quantity
 *     description: The stocked quantity.
 *   incoming_quantity:
 *     type: number
 *     title: incoming_quantity
 *     description: The incoming quantity to be added to stock.
 *   id:
 *     type: string
 *     title: id
 *     description: The update's ID.
 * x-schemaName: AdminBatchUpdateInventoryItemsLocationLevels
 * 
*/

