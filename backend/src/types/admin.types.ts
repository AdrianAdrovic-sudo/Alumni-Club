export interface CreateUserInput {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  username: string;
  enrollment_year: number;
  role?: string;
  occupation?: string;
  profile_picture?: string;
}

export interface UpdateUserInput {
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
  occupation?: string;
  profile_picture?: string;
  is_active?: boolean;
}

export interface UserFilters {
  role?: string;
  enrollment_year?: number;
  is_active?: boolean;
  search?: string;
}