export interface NewLawnService {
  _id: string;
  slug: string;
  title: string;
  description: string;
  price: string;
  category: 'installation' | 'maintenance' | 'design';
  status: 'active' | 'inactive';
  features: string[];
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewLawnLead {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  service: string;
  propertySize?: string;
  preferredDate?: string;
  message?: string;
  status: 'new' | 'contacted' | 'quoted' | 'won' | 'lost';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewLawnReview {
  _id: string;
  customerName: string;
  rating: number;
  text: string;
  service: string;
  status: 'approved' | 'pending' | 'rejected';
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewLawnFAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface NewLawnArea {
  _id: string;
  name: string;
  region: string;
  description: string;
  status: 'active' | 'inactive';
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewLawnGalleryItem {
  _id: string;
  title: string;
  image: string;
  category: 'artificial' | 'natural' | 'before-after' | 'design' | 'other';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface NewLawnPageContent {
  _id: string;
  page: 'home' | 'services' | 'about' | 'gallery' | 'reviews' | 'areas' | 'contact';
  section: string;
  title: string;
  subtitle?: string;
  content?: string;
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface NewLawnContactInfo {
  _id: string;
  type: 'phone' | 'email' | 'address' | 'social' | 'hours';
  label: string;
  value: string;
  icon?: string;
  order: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface NewLawnTeamMember {
  _id: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
  email: string;
  phone?: string;
  order: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface NewLawnPromotion {
  _id: string;
  title: string;
  description: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder?: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive';
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

export type NewLawnListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort?: string;
};
