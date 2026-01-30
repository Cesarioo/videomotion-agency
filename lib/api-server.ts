// Server-side API wrapper - uses the same api client with SECRET from env
import { api } from "./api"
import type { Company, DemoVideo } from "./types"

// Re-export types for convenience
export type { Company, DemoVideo }

// Initialize with server SECRET
function getServerApi() {
  const secret = process.env.SECRET || ""
  api.setApiKey(secret)
  return api
}

// Company API functions
export async function getCompanyByName(name: string): Promise<Company | null> {
  const serverApi = getServerApi()
  const companies = await serverApi.getCompanies({ name })
  return companies[0] || null
}

export async function getCompanyById(id: string): Promise<Company | null> {
  const serverApi = getServerApi()
  const companies = await serverApi.getCompanies()
  return companies.find(c => c.id === id) || null
}

export async function getAllCompanies(): Promise<Company[]> {
  const serverApi = getServerApi()
  return serverApi.getCompanies()
}

// Demo Video API functions
export async function getDemoVideo(companyId: string): Promise<DemoVideo | null> {
  const serverApi = getServerApi()
  try {
    return await serverApi.getDemoVideo(companyId)
  } catch {
    return null
  }
}

// Export the configured api for full access if needed
export { getServerApi as serverApi }
