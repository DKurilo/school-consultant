import { z } from "zod";
import { User } from "./user";

export const UserResponseParser = z.object({
  attemptsLeft: z.number(),
  children: z.record(z.string(), z.number()),
});

export type UserResponse = z.infer<typeof UserResponseParser>;

export const userToUserResponse = (user: User): UserResponse => ({
  attemptsLeft: user.attemptsLeft,
  children: Object.entries(user.children).reduce((o, [name, child]) => {
    Object.assign(o, { [name]: Object.keys(child.recommendations).length });
    return o;
  }, {}),
});
