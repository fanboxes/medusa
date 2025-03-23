/**
 * The File details.
 */
export interface FileDTO {
  /**
   * The ID of the file. You can use this ID later to
   * retrieve or delete the file.
   */
  id: string
  /**
   * The URL of the file.
   */
  url: string
}

/**
 * @interface
 *
 * Filters to apply on a currency.
 */
export interface FilterableFileProps {
  /**
   * The file ID to filter by.
   */
  id?: string
}
