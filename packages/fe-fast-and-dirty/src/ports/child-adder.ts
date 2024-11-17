export interface IChildAdder {
  addChild: (token: string, name: string) => Promise<void>;
}
