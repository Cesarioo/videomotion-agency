import prisma from '@/core/database/client.js';
import type { Company, EmployeeContact, DemoVideo, FinalVideo, Prisma } from '@prisma/client';
import { VideoStatus } from '@prisma/client';

// ============================================================================
// COMPANY CRUD Operations
// ============================================================================

export async function createCompany(data: {
  // Required fields
  name: string;
  websiteUrl: string;
  campaignId: string;
  industry: string;
  // Optional fields (have defaults in DB)
  employees?: number;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  logoUrl?: string;
  valueProp?: string;
  features?: Prisma.InputJsonValue;
  targetAudience?: string;
  voiceTone?: string;
  videoStatus?: VideoStatus;
}): Promise<Company> {
  return prisma.company.create({
    data: {
      name: data.name,
      websiteUrl: data.websiteUrl,
      campaignId: data.campaignId,
      industry: data.industry,
      // Optional fields - only include if provided
      ...(data.employees !== undefined && { employees: data.employees }),
      ...(data.primaryColor !== undefined && { primaryColor: data.primaryColor }),
      ...(data.secondaryColor !== undefined && { secondaryColor: data.secondaryColor }),
      ...(data.fontFamily !== undefined && { fontFamily: data.fontFamily }),
      ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl }),
      ...(data.valueProp !== undefined && { valueProp: data.valueProp }),
      ...(data.features !== undefined && { features: data.features }),
      ...(data.targetAudience !== undefined && { targetAudience: data.targetAudience }),
      ...(data.voiceTone !== undefined && { voiceTone: data.voiceTone }),
      ...(data.videoStatus !== undefined && { videoStatus: data.videoStatus }),
    },
  });
}

export async function getAllCompanies(): Promise<Company[]> {
  return prisma.company.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getCompany(id: string): Promise<Company | null> {
  return prisma.company.findUnique({
    where: { id },
  });
}

export async function searchCompanies(filters: Partial<{
  name: string;
  websiteUrl: string;
  industry: string;
  campaignId: string;
  videoStatus: VideoStatus;
}>): Promise<Company[]> {
  const where: Prisma.CompanyWhereInput = {};
  
  if (filters.name) where.name = filters.name;
  if (filters.websiteUrl) where.websiteUrl = filters.websiteUrl;
  if (filters.industry) where.industry = filters.industry;
  if (filters.campaignId) where.campaignId = filters.campaignId;
  if (filters.videoStatus) where.videoStatus = filters.videoStatus;

  return prisma.company.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateCompany(
  id: string,
  data: Partial<{
    name: string;
    websiteUrl: string;
    employees: number;
    industry: string;
    campaignId: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    logoUrl: string;
    valueProp: string;
    features: Prisma.InputJsonValue;
    targetAudience: string;
    voiceTone: string;
    videoStatus: VideoStatus;
  }>
): Promise<Company> {
  return prisma.company.update({
    where: { id },
    data,
  });
}

export async function deleteCompany(id: string): Promise<Company> {
  return prisma.company.delete({
    where: { id },
  });
}

// ============================================================================
// EMPLOYEE CONTACT CRUD Operations
// ============================================================================

export async function createEmployeeContact(data: {
  companyId: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  avatarUrl: string;
  linkedinUrl: string;
}): Promise<EmployeeContact> {
  return prisma.employeeContact.create({
    data: {
      companyId: data.companyId,
      firstName: data.firstName,
      lastName: data.lastName,
      jobTitle: data.jobTitle,
      email: data.email,
      avatarUrl: data.avatarUrl,
      linkedinUrl: data.linkedinUrl,
    },
  });
}

export async function createManyEmployeeContacts(data: Array<{
  companyId: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  avatarUrl: string;
  linkedinUrl: string;
}>): Promise<EmployeeContact[]> {
  // Prisma createMany doesn't return the created records, so we use a transaction
  return prisma.$transaction(
    data.map((employee) =>
      prisma.employeeContact.create({
        data: {
          companyId: employee.companyId,
          firstName: employee.firstName,
          lastName: employee.lastName,
          jobTitle: employee.jobTitle,
          email: employee.email,
          avatarUrl: employee.avatarUrl,
          linkedinUrl: employee.linkedinUrl,
        },
      })
    )
  );
}

export async function searchEmployeeContacts(filters: Partial<{
  companyId: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
}>): Promise<EmployeeContact[]> {
  const where: Prisma.EmployeeContactWhereInput = {};
  
  if (filters.companyId) where.companyId = filters.companyId;
  if (filters.firstName) where.firstName = filters.firstName;
  if (filters.lastName) where.lastName = filters.lastName;
  if (filters.jobTitle) where.jobTitle = filters.jobTitle;
  if (filters.email) where.email = filters.email;

  return prisma.employeeContact.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateEmployeeContact(
  id: string,
  data: Partial<{
    companyId: string;
    firstName: string;
    lastName: string;
    jobTitle: string;
    email: string;
    avatarUrl: string;
    linkedinUrl: string;
  }>
): Promise<EmployeeContact> {
  return prisma.employeeContact.update({
    where: { id },
    data,
  });
}

export async function deleteEmployeeContact(id: string): Promise<EmployeeContact> {
  return prisma.employeeContact.delete({
    where: { id },
  });
}

// ============================================================================
// DEMO VIDEO CRUD Operations
// ============================================================================

export async function createDemoVideo(data: {
  companyId: string;
  videoLink: string;
}): Promise<DemoVideo> {
  return prisma.demoVideo.create({
    data: {
      companyId: data.companyId,
      videoLink: data.videoLink,
    },
  });
}

export async function getDemoVideo(id: string): Promise<DemoVideo | null> {
  return prisma.demoVideo.findUnique({
    where: { id },
  });
}

export async function getDemoVideoByCompanyId(companyId: string): Promise<DemoVideo | null> {
  return prisma.demoVideo.findFirst({
    where: { companyId },
    orderBy: { createdAt: 'desc' }, // Get the most recent demo video
  });
}

export async function incrementDemoVideoViews(companyId: string): Promise<DemoVideo | null> {
  const demoVideo = await prisma.demoVideo.findFirst({
    where: { companyId },
    orderBy: { createdAt: 'desc' },
  });

  if (!demoVideo) {
    return null;
  }

  return prisma.demoVideo.update({
    where: { id: demoVideo.id },
    data: {
      views: { increment: 1 },
      lastViewedAt: new Date(),
    },
  });
}

export async function updateDemoVideo(
  id: string,
  data: Partial<{
    companyId: string;
    videoLink: string;
  }>
): Promise<DemoVideo> {
  return prisma.demoVideo.update({
    where: { id },
    data,
  });
}

export async function deleteDemoVideo(id: string): Promise<DemoVideo> {
  return prisma.demoVideo.delete({
    where: { id },
  });
}

// ============================================================================
// FINAL VIDEO CRUD Operations
// ============================================================================

export async function createFinalVideo(data: {
  companyId: string;
  videoLink: string;
}): Promise<FinalVideo> {
  return prisma.finalVideo.create({
    data: {
      companyId: data.companyId,
      videoLink: data.videoLink,
    },
  });
}

export async function getFinalVideo(id: string): Promise<FinalVideo | null> {
  return prisma.finalVideo.findUnique({
    where: { id },
  });
}

export async function updateFinalVideo(
  id: string,
  data: Partial<{
    companyId: string;
    videoLink: string;
  }>
): Promise<FinalVideo> {
  return prisma.finalVideo.update({
    where: { id },
    data,
  });
}

export async function deleteFinalVideo(id: string): Promise<FinalVideo> {
  return prisma.finalVideo.delete({
    where: { id },
  });
}

