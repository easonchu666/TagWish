
export enum UserRole {
  BUYER = 'BUYER',
  TRAVELER = 'TRAVELER'
}

export enum WishStatus {
  PENDING = 'Pending',
  MATCHED = 'Matched',
  VERIFYING = 'Verifying',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled'
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Wish {
  id: string;
  itemName: string;
  description: string;
  estimatedPrice: number;
  reward: number;
  location: string;
  image: string;
  status: WishStatus;
  buyerId: string;
  travelerId?: string;
  createdAt: string;
  tag: string;
  chat?: ChatMessage[];
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  balance: number;
  role: UserRole;
}
