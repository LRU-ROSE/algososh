const wait = (ms: number): Promise<void> => {
  return new Promise((res) => setTimeout(res, ms));
};

export default wait;
