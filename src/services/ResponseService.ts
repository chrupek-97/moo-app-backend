import { ApiResponse } from "../types/ApiResponse"

export class ResponseService {
    public static createResponse<T>(response: ApiResponse<T>) {
        return ContentService
            .createTextOutput(JSON.stringify(response))
            .setMimeType(ContentService.MimeType.JSON)
    }
}