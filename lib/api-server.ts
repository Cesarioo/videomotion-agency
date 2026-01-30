// Server-side API client - calls external API directly (no CORS on server)
// SECRET is only accessed here, never exposed to client

const API_URL = process.env.API_URL || "api.chocomotion.agency"
const API_SECRET = process.env.SECRET || ""

// Types
export interface Company {
  id: string
  name: string
  websiteUrl: string
  employees: number
  industry: string
  campaignId: string
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  logoUrl: string
  valueProp: string
  features: string[]
  targetAudience: string
  voiceTone: string
  videoStatus: "none" | "demo_scheduled" | "demo_started" | "demo_finished" | "final_progress" | "final"
  createdAt: string
  updatedAt: string
}

export interface DemoVideo {
  id: string
  companyId: string
  videoLink: string
  views: number
  lastViewedAt: string | null
  createdAt: string
  updatedAt: string
}

// Server-side fetch - calls external API directly
// This is safe because server-side requests don't have CORS restrictions
export async function serverFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T | null> {
  const url = `https://${API_URL}${endpoint}`
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "x-api-key": API_SECRET,
        ...options.headers,
      },
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText} for ${url}`)
      return null
    }

    const text = await response.text()
    if (!text) return null
    
    return JSON.parse(text)
  } catch (error) {
    console.error("Server fetch error:", error)
    return null
  }
}

// Company API functions
export async function getCompanyByName(name: string): Promise<Company | null> {
  // Use the /api/companies endpoint with name filter (per OpenAPI spec)
  const companies = await serverFetch<Company[]>(`/api/companies?name=${encodeURIComponent(name)}`)
  return companies?.[0] || null
}

export async function getCompanyById(id: string): Promise<Company | null> {
  const companies = await serverFetch<Company[]>(`/api/companies?id=${encodeURIComponent(id)}`)
  return companies?.[0] || null
}

export async function getAllCompanies(): Promise<Company[]> {
  return await serverFetch<Company[]>("/api/companies") || []
}

// Demo Video API functions
export async function getDemoVideo(companyId: string): Promise<DemoVideo | null> {
  return serverFetch<DemoVideo>(`/api/videos/demo/${companyId}`)
}

// Legacy endpoint support (for backward compatibility with existing API structure)
export async function getDemoVideoLegacy(companyId: string): Promise<DemoVideo | null> {
  return serverFetch<DemoVideo>(`/api/companies/${companyId}/demo-video`)
}
