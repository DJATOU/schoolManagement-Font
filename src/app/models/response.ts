// models/response.ts
export interface ApiResponse {
    message: string;
  }
  
  export interface ApiError {
    status: number;
    error: {
      alreadyAssociatedGroups?: string[];
      message?: string;
    };
  }