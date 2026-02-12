/**
 * 🧑‍💼 Represents a user's core profile data.
 * - `firstName`/`lastName`: Required full name parts.
 * - `avatar`: Optional profile image URL (nullable).
 */
export interface User {
  firstName: string;
  lastName: string;
  avatar?: string;
}
