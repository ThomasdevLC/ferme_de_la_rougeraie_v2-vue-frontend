export interface UserProfileUpdate {
  oldPhone?: string | null;
  phone: string;
  oldPassword?: string | null;
  plainPassword?: string | null;
}
