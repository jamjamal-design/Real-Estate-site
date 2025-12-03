// Shared TypeScript types for the application

export type Property = {
  _id?: string;
  id?: number;
  title: string;
  type: string;
  price: number | string;
  location: string;
  size: string;
  description?: string;
  images?: string[];
  image?: string;
  status: string;
  createdAt?: string;
};

export type Project = {
  _id?: string;
  id?: number;
  title: string;
  clientName?: string;
  description: string;
  completionDate?: string | Date;
  gallery?: string[];
  // Legacy fields for compatibility
  client?: string;
  year?: string;
  image?: string;
  createdAt?: string;
};

export type Booking = {
  _id?: string;
  id?: number;
  clientName: string;
  email: string;
  phone: string;
  serviceType?: string;
  message?: string;
  status?: string;
  createdAt?: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};

export type FormErrors = {
  [key: string]: string;
};
