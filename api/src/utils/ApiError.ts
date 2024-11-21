
export class ApiError extends Error {
  public status: number;
  public details?: any;

  constructor(status: number, message: string, details?: any) {
    super(message);
    this.status = status;
    this.details = details;

    // Ensure the name is set to "ApiError" for easier identification
    this.name = "ApiError";
  }
}
