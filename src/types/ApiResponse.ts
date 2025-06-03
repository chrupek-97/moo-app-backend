export type ApiResponse<T = unknown> = {
    status: "success" | "error",
    message: string;
    statusCode: number;
    data: T | null
}