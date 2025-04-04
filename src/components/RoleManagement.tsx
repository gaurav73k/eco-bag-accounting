
// Fix the TypeScript error on line 119
interface UserRoleData {
  id: string;
  user_id: string;
  role_id: string;
  created_at: string | null;
  user: {
    id: string;
    email: string;
    name: string | null;
  } | null;
  role: {
    id: string;
    name: string;
    permissions: string[];
  } | null;
}
