export const shuffleAvoidingBackToBack = (
  matchups: { defenderId: string; opponentId: string }[],
) => {
  const result: typeof matchups = [];
  let pool = [...matchups];

  while (pool.length) {
    const last = result[result.length - 1];

    let candidates = pool;

    if (last) {
      candidates = pool.filter(
        (m) =>
          m.defenderId !== last.defenderId &&
          m.defenderId !== last.opponentId &&
          m.opponentId !== last.defenderId &&
          m.opponentId !== last.opponentId,
      );

      if (candidates.length === 0) {
        candidates = pool;
      }
    }

    const next = candidates[Math.floor(Math.random() * candidates.length)];

    result.push(next);
    pool = pool.filter((m) => m !== next);
  }

  return result;
};
