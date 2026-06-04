export interface NewLawnService {
  _id: string;
  title: string;
  description: string;
  image?: string;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NewLawnGalleryItem {
  _id: string;
  image: string;
  beforeImage?: string;
  afterImage?: string;
  category: string;
  isBeforeAfter: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewLawnReview {
  _id: string;
  reviewerName: string;
  location: string;
  rating: number;
  comment: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteConfigBanner {
  image: string;
  title: string;
  description: string;
}

export interface WebsiteConfigFeature {
  title: string;
  description: string;
}

export interface WebsiteConfigStat {
  value: string;
  label: string;
}

export interface WebsiteContactDetails {
  email: string;
  phone: string;
  businessHours: string;
  city: string;
  address: string;
  provinces: string;
  country: string;
  countryCode: string;
}

export interface WebsiteAboutUs {
  title: string;
  description: string;
  image: string;
  features: WebsiteConfigFeature[];
  stats: WebsiteConfigStat[];
}

export interface WebsiteConfig {
  _id: string;
  websiteName: string;
  websiteLogo: string;
  websiteBannerList: WebsiteConfigBanner[];
  websiteContactDetails: WebsiteContactDetails;
  websiteAboutUs: WebsiteAboutUs;
  footerElement: any[];
  createdAt: string;
  updatedAt: string;
}

export type NewLawnListResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export interface ContactInquiryReply {
  _id: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface ContactInquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  isRead: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  replies: ContactInquiryReply[];
  createdAt: string;
  updatedAt: string;
}

export type NewLawnListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort?: string;
  startDate?: string;
  endDate?: string;
};
