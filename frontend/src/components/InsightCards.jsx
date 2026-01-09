import { generateInsights } from "../utils/insights";

export default function InsightCards({ journals }) {
  const insights = generateInsights(journals);

  return (
    <div>
      {insights.map((text, i) => (
        <div key={i}>{text}</div>
      ))}
    </div>
  );
}
