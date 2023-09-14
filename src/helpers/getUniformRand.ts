// min и max не должны быть больше 255 и меньше 0
const getUniformRand = (min: number, max: number): number => {
  const array = new Uint8Array(1);
  while (true) {
    crypto.getRandomValues(array);
    const rv = array[0];
    // Повторяем получение случайного числа, если результат больше max или меньше min
    if (rv >= min && rv <= max) {
      return rv;
    }
  }
};

export default getUniformRand;
