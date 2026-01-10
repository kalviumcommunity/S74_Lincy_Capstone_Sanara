export function generateInsights(journals) {
  if (!journals || journals.length === 0) {
    return ["No insights yet. Start journaling."];
  }

  const moodCount = {};

  journals.forEach(j => {
    moodCount[j.mood] = (moodCount[j.mood] || 0) + 1;
  });

  const mostCommonMood = Object.keys(moodCount).reduce((a, b) =>
    moodCount[a] > moodCount[b] ? a : b
  );

  return [
    `Most recent entries were marked as ${journals[0].mood}.`,
    `Your most frequent mood is ${mostCommonMood}.`
  ];
}
