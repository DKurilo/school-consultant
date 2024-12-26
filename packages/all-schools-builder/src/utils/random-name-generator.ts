import { randomInt } from "node:crypto";

const asyncRandomInt = (min: number, max: number): Promise<number> =>
  new Promise((resolve, reject) => {
    try {
      randomInt(min, max, (err, n) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(n);
      });
    } catch (e) {
      reject(e);
    }
  });

export const generateName = async (): Promise<string> => {
  const abc = "abcdefghijclmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  const nameArray = await Promise.all(
    new Array(42).fill(0).map(() => asyncRandomInt(0, abc.length - 1)),
  );
  return nameArray.map((n) => abc[n]).join("");
};
