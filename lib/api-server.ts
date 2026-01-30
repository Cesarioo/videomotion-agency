// Server-side API client - uses the proxy route
// SECRET is handled by the proxy, never exposed to client

import type { 
  Company, 
  CompanyInput, 
  Employee, 
  EmployeeInput, 
  DemoVideo, 
  QueueStatus, 
  VideoTemplate,
} from "./types"

// Re-export types for convenience
export type { Company, DemoVideo }

// Get base URL for internal API calls
function getBaseUrl(): string {
  // In production on Vercel
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  // Custom base URL if set
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL
  }
  // Default to localhost in development
  return "http://localhost:3000"
}

const API_URL = "/api/proxy"

class ServerApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const baseUrl = getBaseUrl()
    const url = `${baseUrl}${API_URL}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText} for ${url}`)
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const text = await response.text()
    if (!text) return {} as T
    
    return JSON.parse(text)
  }

  // Health check
  async checkHealth(): Promise<boolean> {
    try {
      await this.request("/health")
      return true
    } catch {
      return false
    }
  }

  // Companies
  async getCompanies(filters?: {
    name?: string
    websiteUrl?: string
    industry?: string
    campaignId?: string
    videoStatus?: string
  }): Promise<Company[]> {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
    }
    const query = params.toString() ? `?${params.toString()}` : ""
    return this.request<Company[]>(`/api/companies${query}`)
  }

  async getCompanyByName(name: string): Promise<Company | null> {
    const companies = await this.getCompanies({ name })
    return companies[0] || null
  }

  async createCompanies(companies: CompanyInput[]): Promise<Company[]> {
    return this.request<Company[]>("/api/companies", {
      method: "POST",
      body: JSON.stringify(companies),
    })
  }

  async updateCompany(id: string, data: Partial<CompanyInput>): Promise<Company> {
    return this.request<Company>(`/api/companies/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async deleteCompany(id: string): Promise<Company> {
    return this.request<Company>(`/api/companies/${id}`, {
      method: "DELETE",
    })
  }

  // Employees
  async getEmployees(filters?: {
    companyId?: string
    firstName?: string
    lastName?: string
    jobTitle?: string
    email?: string
  }): Promise<Employee[]> {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
    }
    const query = params.toString() ? `?${params.toString()}` : ""
    return this.request<Employee[]>(`/api/employees${query}`)
  }

  async createEmployees(employees: EmployeeInput[]): Promise<Employee[]> {
    return this.request<Employee[]>("/api/employees", {
      method: "POST",
      body: JSON.stringify(employees),
    })
  }

  async updateEmployee(id: string, data: Partial<EmployeeInput>): Promise<Employee> {
    return this.request<Employee>(`/api/employees/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async deleteEmployee(id: string): Promise<Employee> {
    return this.request<Employee>(`/api/employees/${id}`, {
      method: "DELETE",
    })
  }

  // Videos
  async getDemoVideo(companyId: string): Promise<DemoVideo | null> {
    try {
      return await this.request<DemoVideo>(`/api/videos/demo/${companyId}`)
    } catch {
      return null
    }
  }

  async getQueueStatus(): Promise<QueueStatus> {
    return this.request<QueueStatus>("/api/videos/queues/status")
  }

  async getVideoTemplates(): Promise<{ templates: VideoTemplate[] }> {
    return this.request<{ templates: VideoTemplate[] }>("/api/videos/templates")
  }

  async retryEnrichmentJob(jobId: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(
      `/api/videos/queues/enrichment/${jobId}/retry`,
      { method: "POST" }
    )
  }

  async retryVideoJob(jobId: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(
      `/api/videos/queues/video/${jobId}/retry`,
      { method: "POST" }
    )
  }
}

// Singleton instance for server-side use
export const serverApi = new ServerApiClient()
