import { z } from "zod";
import { User } from "./user";

export const UserResponseParser = z.object({
  attemptsLeft: z.number(),
  children: z.array(z.string()),
});

export type UserResponse = z.infer<typeof UserResponseParser>;

export const userToUserResponse = (user: User): UserResponse => ({
  attemptsLeft: user.attemptsLeft,
  children: Object.keys(user.children),
});
