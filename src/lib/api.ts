export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
}

class ApiClient {
  private baseUrl: string = "/api";

  async request<T>(
    endpoint: string,
    method: string = "GET",
    body?: any,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const config: RequestInit = {
      ...options,
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      return data as T;
    } catch (error: any) {
      console.error(`API Error [${method} ${endpoint}]:`, error.message);
      throw error;
    }
  }

  get<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, "GET", undefined, options);
  }

  post<T>(endpoint: string, body?: any, options?: RequestInit) {
    return this.request<T>(endpoint, "POST", body, options);
  }

  patch<T>(endpoint: string, body?: any, options?: RequestInit) {
    return this.request<T>(endpoint, "PATCH", body, options);
  }

  delete<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, "DELETE", undefined, options);
  }
}

export const api = new ApiClient();
