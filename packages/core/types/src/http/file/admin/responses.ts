import { DeleteResponse } from "../../common"
import { AdminFile } from "./entities"

export interface AdminFileResponse {
  /**
   * The file's details.
   */
  file: AdminFile
}

export interface AdminFileListResponse {
  /**
   * The list of uploaded files.
   */
  files: AdminFile[]
}

export type AdminFileDeleteResponse = DeleteResponse<"file">
