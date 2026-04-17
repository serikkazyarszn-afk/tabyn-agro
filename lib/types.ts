export type Role = 'investor' | 'farmer';

export type AnimalType = 'cow' | 'sheep' | 'horse' | 'goat' | 'camel';

export type AnimalStatus = 'available' | 'growing' | 'ready' | 'sold';

export type InvestmentStatus = 'active' | 'completed';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  balance: number;
  avatar_url: string | null;
  created_at: string;
}

export interface Farmer {
  id: string;
  user_id: string;
  farm_name: string;
  location: string;
  description: string | null;
  verified: boolean;
  profile?: Profile;
}

export interface Animal {
  id: string;
  farmer_id: string;
  name: string;
  type: AnimalType;
  breed?: string;
  price: number;
  expected_return_pct: number;
  duration_months: number;
  status: AnimalStatus;
  image_url: string | null;
  description: string | null;
  slots_total: number;
  slots_filled: number;
  created_at: string;
  farmer?: Farmer;
}

export interface Investment {
  id: string;
  investor_id: string;
  animal_id: string;
  amount: number;
  profit_share_pct: number;
  status: InvestmentStatus;
  expected_return: number;
  actual_return: number | null;
  invested_at: string;
  completed_at: string | null;
  animal?: Animal;
  profile?: Profile;
}
