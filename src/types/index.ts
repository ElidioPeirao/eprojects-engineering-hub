
export interface User {
  id: string;
  username: string;
  email: string;
  isPro: boolean;
  proExpiryDate?: Date;
  isAdmin: boolean;
  createdAt: Date;
  toolAccess: string[]; // IDs das ferramentas que o usuário tem acesso
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  link: string;
  icon: string;
  isPro: boolean;
  category: 'engineering' | 'electrical' | 'custom';
  createdAt: Date;
}
