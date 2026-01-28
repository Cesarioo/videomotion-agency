import prisma from '@/core/database/client.js';
import type { Company, EmployeeContact, DemoVideo, FinalVideo, Prisma } from '@prisma/client';
import { VideoStatus } from '@prisma/client';

// ============================================================================
// COMPANY CRUD Operations
// ============================================================================

export async function createCompany(data: {
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
  videoStatus?: VideoStatus;
}): Promise<Company> {
  return prisma.company.create({
    data: {
      name: data.name,
      websiteUrl: data.websiteUrl,
      employees: data.employees,
      industry: data.industry,
      campaignId: data.campaignId,
      primaryColor: data.primaryColor,
      secondaryColor: data.secondaryColor,
      fontFamily: data.fontFamily,
      logoUrl: data.logoUrl,
      valueProp: data.valueProp,
      features: data.features,
      targetAudience: data.targetAudience,
      voiceTone: data.voiceTone,
      videoStatus: data.videoStatus || 'none',
    },
  });
}

export async function getCompany(id: string): Promise<Company | null> {
  return prisma.company.findUnique({
    where: { id },
  });
}

export async function getCompanyByName(name: string): Promise<Company | null> {
  return prisma.company.findFirst({
    where: { 
      name: {
        equals: name,
        mode: 'insensitive', // Case-insensitive search
      },
    },
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

export async function getEmployeeContact(id: string): Promise<EmployeeContact | null> {
  return prisma.employeeContact.findUnique({
    where: { id },
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

