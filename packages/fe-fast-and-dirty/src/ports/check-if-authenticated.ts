export interface ICheckIfAuthenticated {
  check: () => Promise<boolean>;
}
