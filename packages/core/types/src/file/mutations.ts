/**
 * The File to be created.
 */
export interface CreateFileDTO {
  /**
   * The name of the uploaded file
   */
  filename: string

  /**
   * The mimetype of the uploaded file
   * 
   * @example
   * image/png
   */
  mimeType: string

  /**
   * The file content as a binary-encoded string (For example, base64).
   */
  content: string

  /**
   * The access level of the file. Defaults to private if not passed
   */
  access?: "public" | "private"
}
