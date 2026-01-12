export default function InsightCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl px-6 py-5 flex items-start gap-4">
      <div className="w-9 h-9 flex items-center justify-center rounded-full bg-green-50 text-green-700">
        📈
      </div>

      <div>
        <h3 className="font-semibold text-gray-800">
          Recent Patterns
        </h3>
        <p className="text-sm text-gray-600 mt-1 max-w-2xl">
          Sleep-related entries were commonly associated with lower moods.
        </p>
      </div>
    </div>
  );
}
