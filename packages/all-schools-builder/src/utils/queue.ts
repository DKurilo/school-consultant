type Job<T> = {
  f: () => Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
  repeats: number;
};

export const mkQueue = (
  sameTimeCount: number,
  delay: number,
  maxRepeats: number,
): (<T>(f: () => Promise<T>) => Promise<T>) => {
  const queued: Job<unknown>[] = [];
  const inWork: Job<unknown>[] = [];
  const removeFromInWork = <T>(frr: Job<T>): void => {
    const i = inWork.indexOf(frr as Job<unknown>);
    inWork.splice(i, 1);
    if (inWork.length < sameTimeCount && queued.length > 0) {
      const [newFrr] = queued.splice(0, 1);
      addToInWork(newFrr);
    }
  };
  const addToInWork = <T>(frr: Job<T>): void => {
    inWork.push(frr as Job<unknown>);
    const { f, resolve, reject } = frr;
    f()
      .then((r) => {
        removeFromInWork(frr);
        resolve(r);
      })
      .catch((e) => {
        removeFromInWork(frr);
        if (frr.repeats + 1 < maxRepeats) {
          setTimeout(() => {
            addJob({ ...frr, repeats: frr.repeats + 1 });
          }, delay);

          return;
        }
        reject(e);
      });
  };
  const addJob = <T>(frr: Job<T>): void => {
    if (inWork.length < sameTimeCount) {
      addToInWork(frr);
    } else {
      queued.push(frr as Job<unknown>);
    }
  };
  const queuedF = <T>(f: () => Promise<T>): Promise<T> =>
    new Promise((resolve, reject) => {
      addJob({
        f,
        resolve,
        reject,
        repeats: 0,
      });
    });
  return queuedF;
};
