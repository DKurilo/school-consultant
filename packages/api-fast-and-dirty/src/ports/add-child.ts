export interface IAddChild {
  execute: (token: string, name: string) => Promise<void | "no access" | "user not found" | "child already exists">;
}
