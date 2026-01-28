import { notFound } from "next/navigation"
import { Metadata } from "next"
import { ProspectLanding } from "@/components/prospect-landing"

interface Company {
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

interface DemoVideo {
  id: string
  companyId: string
  videoLink: string
  createdAt: string
  updatedAt: string
}

const API_URL = process.env.API_URL || "api.chocomotion.agency"

async function getCompanyByName(name: string): Promise<Company | null> {
  try {
    const res = await fetch(
      `https://${API_URL}/api/companies/search?name=${encodeURIComponent(name)}`,
      {
        headers: {
          "x-api-key": process.env.SECRET || "",
        },
        next: { revalidate: 60 },
      }
    )

    if (!res.ok) {
      return null
    }

    return res.json()
  } catch {
    return null
  }
}

async function getDemoVideo(companyId: string): Promise<DemoVideo | null> {
  try {
    const res = await fetch(
      `https://${API_URL}/api/companies/${companyId}/demo-video`,
      {
        headers: {
          "x-api-key": process.env.SECRET || "",
        },
        next: { revalidate: 60 },
      }
    )

    if (!res.ok) {
      return null
    }

    return res.json()
  } catch {
    return null
  }
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const company = await getCompanyByName(decodeURIComponent(slug))

  if (!company) {
    return {
      title: "Company Not Found | Chocomotion",
    }
  }

  return {
    title: `${company.name} | Chocomotion`,
    description: company.valueProp,
    openGraph: {
      title: `${company.name} | Chocomotion`,
      description: company.valueProp,
      images: [{ url: company.logoUrl }],
    },
  }
}

export default async function ProspectPage({ params }: PageProps) {
  const { slug } = await params
  const company = await getCompanyByName(decodeURIComponent(slug))

  if (!company) {
    notFound()
  }

  const demoVideo = await getDemoVideo(company.id)

  return <ProspectLanding company={company} demoVideo={demoVideo} />
}
