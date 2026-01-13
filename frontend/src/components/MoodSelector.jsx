// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const moods = [
  { label: "Overwhelmed", emoji: "😵" },
  { label: "Sad", emoji: "☹️" },
  { label: "Calm", emoji: "😌" },
  { label: "Happy", emoji: "😄" },
];

export default function MoodSelector({ value, onChange }) {
  return (
    <div className="space-y-3">
      <label className="block text-sm text-[#2F3E34]">
        How did you feel today?
      </label>

      <div className="flex flex-wrap gap-3">
        {moods.map((mood) => {
          const selected = value === mood.label;

          return (
            <motion.button
              key={mood.label}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => onChange(mood.label)}
              className={`
                flex flex-col items-center justify-center
                w-28 h-20 rounded-xl border text-sm
                transition-colors
                ${
                  selected
                    ? "bg-[#4F6F5B] text-white border-[#4F6F5B]"
                    : "bg-[#FAF7F2] text-[#2F3E34] border-[#D8E3DD] hover:bg-[#E6EFEA]"
                }
              `}
            >
              <span className="text-xl">{mood.emoji}</span>
              <span className="mt-1">{mood.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
