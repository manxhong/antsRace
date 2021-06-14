export function generateAntWinLikelihoodCalculator() {
  const delay = 7000 + Math.random() * 7000;
  const likelihoodOfAntWinning = Math.random();

  return callback => {
    setTimeout(() => {
      callback(likelihoodOfAntWinning);
    }, delay);
  };
}

export const sortAnts = ants => {
  if (ants.length > 0) {
    const sortedAnt = ants.slice().sort((a, b) => {
      const rateA = a?.winningRate || 0;
      const rateB = b?.winningRate || 0;
      return rateB - rateA;
    });
    return sortedAnt;
  }
  return ants;
};
