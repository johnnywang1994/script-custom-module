export const count = (callback) => new Promise((resolve) => {
  const now = performance.now();
  const res = () => {
    resolve(performance.now() - now);
  };
  callback(res);
});

export {};
