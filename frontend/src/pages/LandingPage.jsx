import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

import heroBg from "../assets/hero-bg.jpg";
import moodImg from "../assets/mood.png";
import journalImg from "../assets/journal.png";
import insightImg from "../assets/insight.png";

/* ---------------- MOTION PRESETS ---------------- */

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#D2E3DA] text-[#2F3E35]">

      {/* ================= NAVBAR ================= */}
      <header className="fixed top-0 left-0 w-full z-20 bg-[#F6F3EE]/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-xl font-medium tracking-wide">Sanara</h1>

          <nav className="flex items-center gap-6 text-sm">
            <a href="#how">How it works</a>
            <a href="#features">Features</a>
            <Link to="/login">Log in</Link>
            <Link
              to="/signup"
              className="bg-[#5F7F6B] text-white px-5 py-2 rounded-full"
            >
              Begin
            </Link>
          </nav>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section
        className="min-h-screen flex items-center justify-center relative pt-24"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#D2E3DA]/30" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative max-w-2xl text-center bg-[#F6F3EE] px-14 py-16 rounded-[36px] shadow-md"
        >
          <h2 className="text-5xl font-serif leading-tight mb-6">
            Notice how you feel.
            <br />
            Understand it over time.
          </h2>

          <p className="text-lg text-[#7B877E] mb-10">
            Sanara is a private journaling space that helps you turn
            emotions into patterns — not noise.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              to="/signup"
              className="bg-[#5F7F6B] text-white px-8 py-3 rounded-full"
            >
              Start your first reflection
            </Link>
            <Link
              to="/login"
              className="border border-[#5F7F6B] px-8 py-3 rounded-full"
            >
              Log in
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <motion.section
        id="how"
        className="py-32 px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
      >
        <motion.h3
          variants={fadeUp}
          className="text-3xl font-serif text-center mb-20"
        >
          A simple rhythm for reflection
        </motion.h3>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          {[
            {
              title: "Write freely",
              desc: "No pressure. No performance. Just your thoughts as they are.",
              bg: "bg-[#E7EFEA]",
            },
            {
              title: "Mark how you feel",
              desc: "Add mood and context to capture emotional signals over time.",
              bg: "bg-[#ECEEF1]",
            },
            {
              title: "Reflect over time",
              desc: "Notice patterns that are invisible in day-to-day moments.",
              bg: "bg-[#F3EFE9]",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className={`${card.bg} rounded-3xl p-10 text-center`}
            >
              <h4 className="text-xl font-medium mb-4">
                {card.title}
              </h4>
              <p className="text-sm text-[#7B877E] leading-relaxed">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ================= FEATURES ================= */}
      <motion.section
        id="features"
        className="py-32 px-6 bg-[#F6F3EE]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
      >
        <motion.h3
          variants={fadeUp}
          className="text-3xl font-serif text-center mb-20"
        >
          What Sanara helps you notice
        </motion.h3>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          {[
            {
              title: "Emotional signals",
              desc: "Stop guessing why your mood shifts.",
              img: moodImg,
            },
            {
              title: "Connected reflections",
              desc: "Your thoughts stop feeling scattered.",
              img: journalImg,
            },
            {
              title: "Patterns over time",
              desc: "See trends that are invisible day-to-day.",
              img: insightImg,
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-white rounded-3xl p-6 border border-[#E5DED5]"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-40 object-contain mb-6"
              />
              <h4 className="text-xl font-medium mb-2">
                {item.title}
              </h4>
              <p className="text-sm text-[#7B877E]">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ================= PRIVACY ================= */}
      <motion.section
        className="py-32 px-6 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
      >
        <h3 className="text-3xl font-serif mb-6">
          Private by design
        </h3>
        <p className="max-w-xl mx-auto text-[#7B877E]">
          Your entries are not social content.
          No feeds. No likes. No algorithms.
          Just a space built for honesty.
        </p>
      </motion.section>

      {/* ================= FINAL CTA ================= */}
      <motion.section
        className="pb-32 px-6 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
      >
        <h3 className="text-3xl font-serif mb-8">
          Start reflecting today
        </h3>
        <Link
          to="/signup"
          className="bg-[#5F7F6B] text-white px-10 py-4 rounded-full text-lg"
        >
          Create your journal
        </Link>
      </motion.section>

      {/* ================= FOOTER ================= */}
      <motion.footer
        className="bg-[#F6F3EE] py-12 px-6 text-sm text-[#7B877E]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-medium text-[#2F3E35] mb-2">
              Sanara
            </h4>
            <p>Designed for reflection, not performance.</p>
          </div>
          <div>
            <h4 className="font-medium text-[#2F3E35] mb-2">
              Project
            </h4>
            <p>Built as a full-stack journaling system.</p>
          </div>
          <div>
            <h4 className="font-medium text-[#2F3E35] mb-2">
              © 2026
            </h4>
            <p>All thoughts remain private.</p>
          </div>
        </div>
      </motion.footer>

    </div>
  );
}
