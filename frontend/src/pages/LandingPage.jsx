import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

import moodImg from "../assets/mood.jpg";
import journalImg from "../assets/journal.jpg";
import insightImg from "../assets/insights.jpg";

export default function Landing() {
  return (
    <div className="bg-[#FAF7F2] text-[#2F3E34] min-h-screen overflow-hidden">

      {/* NAVBAR */}
      <header className="flex justify-between items-center px-10 py-6">
        <h1 className="text-2xl font-semibold">🌿 Sanara</h1>
        <div className="space-x-4">
          <Link to="/login" className="text-sm font-medium">
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-[#4F6F5B] text-white px-5 py-2 rounded-full text-sm"
          >
            Start Journaling
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="flex flex-col items-center text-center mt-24 px-6">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-serif mb-6"
        >
          See patterns in your emotions <br /> over time.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-xl text-lg text-[#7A8A80] mb-10"
        >
          Sanara is a private journaling system that turns structured
          emotional entries into clear summaries — so you can reflect
          without advice or judgment.
        </motion.p>

        <div className="space-x-4">
          <Link
            to="/signup"
            className="bg-[#4F6F5B] text-white px-8 py-3 rounded-full"
          >
            Start Journaling
          </Link>
          <Link
            to="/login"
            className="border border-[#4F6F5B] px-8 py-3 rounded-full"
          >
            Login
          </Link>
        </div>
      </section>

      {/* WHAT SANARA HELPS YOU NOTICE */}
      <section className="mt-36 px-10">
        <h3 className="text-3xl font-serif text-center mb-14">
          What Sanara Helps You Notice
        </h3>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              title: "Structured Mood Tracking",
              desc: "Log mood, energy, tags, and context — not just free-form text.",
              img: moodImg,
            },
            {
              title: "Connected Journal Entries",
              desc: "Entries don’t stay isolated — they are viewed together over time.",
              img: journalImg,
            },
            {
              title: "Emotional Pattern Summaries",
              desc: "Recurring moods, triggers, and trends surfaced from your data.",
              img: insightImg,
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-6 border border-[#E6EFEA] shadow-sm hover:shadow-md transition"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-40 object-contain mb-6"
              />
              <h4 className="text-xl font-medium mb-2">{item.title}</h4>
              <p className="text-[#7A8A80] text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mt-36 px-10">
        <h3 className="text-3xl font-serif text-center mb-4">
          How Sanara Works
        </h3>
        <p className="text-lg text-[#7A8A80] text-center mb-14">
          From daily entries to long-term emotional awareness
        </p>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              title: "Create Structured Entries",
              desc: "Write journal entries with mood, energy level, emotional tags, and context.",
            },
            {
              title: "Securely Store Your Data",
              desc: "Entries are saved privately and timestamped for long-term reflection.",
            },
            {
              title: "Surface Emotional Patterns",
              desc: "The system highlights recurring moods, triggers, and trends over time.",
            },
            {
              title: "Review & Reflect",
              desc: "Summaries help you notice patterns without interpretation or advice.",
            },
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 border border-[#E6EFEA] shadow-sm"
            >
              <h4 className="text-lg font-medium mb-3">{step.title}</h4>
              <p className="text-sm text-[#7A8A80]">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mt-36 text-center px-6">
        <h3 className="text-3xl font-serif mb-6">
          Start tracking your emotional patterns
        </h3>
        <Link
          to="/signup"
          className="bg-[#4F6F5B] text-white px-10 py-4 rounded-full text-lg"
        >
          Start Journaling
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="mt-36 py-12 px-6 bg-[#F3EFE9] text-sm text-[#7A8A80]">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center md:text-left">
          
          <div>
            <h4 className="font-medium text-[#2F3E34] mb-2">Sanara</h4>
            <p>
              Private journaling for emotional pattern awareness.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-[#2F3E34] mb-2">Contact</h4>
            <p>Email: lincyr.dev@gmail.com</p>
            <p>LinkedIn · GitHub</p>
          </div>

          <div>
            <h4 className="font-medium text-[#2F3E34] mb-2">Project</h4>
            <p>Built as a capstone project</p>
            <p>© 2026 Sanara</p>
          </div>

        </div>
      </footer>

    </div>
  );
}
