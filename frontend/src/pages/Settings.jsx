import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Moon, Sun, Bell, Sparkles, Sliders, Shield, Laptop } from "lucide-react";

export default function Settings() {
  const { theme, toggleTheme } = useAuth();
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [autosave, setAutosave] = useState(true);

  const handleToggleNotifications = () => {
    setNotifications((prev) => !prev);
    showToast(`Reflection notifications ${!notifications ? "enabled" : "disabled"}`, "info");
  };

  const handleToggleAISuggestions = () => {
    setAiSuggestions((prev) => !prev);
    showToast(`AI prompt suggestions ${!aiSuggestions ? "enabled" : "disabled"}`, "info");
  };

  const handleToggleAutosave = () => {
    setAutosave((prev) => !prev);
    showToast(`Writing autosave ${!autosave ? "enabled" : "disabled"}`, "info");
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pt-2">
      {/* Header */}
      <div className="space-y-2">
        <p className="eyebrow-xs text-[var(--sky-deep)] tracking-widest font-extrabold">PREFERENCES</p>
        <h1 className="page-title text-[var(--text-primary)] font-serif font-bold">Settings</h1>
      </div>

      <div className="pinterest-card p-8 bg-[var(--card-bg)] border-[var(--border-subtle)] space-y-6 shadow-sm divide-y divide-[var(--border-subtle)]">
        {/* Appearance Mode */}
        <div className="flex items-center justify-between pb-6">
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              {theme === "light" ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-sky-400" />}
              <span>Appearance Mode</span>
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-bold">
              Current active theme: <span className="capitalize font-extrabold text-[var(--sky-deep)]">{theme}</span>
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="btn-sky-secondary text-xs py-2 px-4 font-bold"
          >
            Switch to {theme === "light" ? "Dark" : "Light"}
          </button>
        </div>

        {/* AI Suggestions Preference */}
        <div className="flex items-center justify-between py-6">
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--sky-deep)]" />
              <span>AI Prompt Suggestions</span>
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-bold">
              Display intelligent starter prompts and contextual suggestions during Untangle writing.
            </p>
          </div>
          <button
            onClick={handleToggleAISuggestions}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
              aiSuggestions ? "bg-[var(--sky-deep)]" : "bg-slate-500/40"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                aiSuggestions ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {/* Reflection Notifications */}
        <div className="flex items-center justify-between py-6">
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Bell className="w-4 h-4 text-[var(--sky-deep)]" />
              <span>Reflection Reminders</span>
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-bold">
              Receive gentle prompts when active threads have decisions pending for over 7 days.
            </p>
          </div>
          <button
            onClick={handleToggleNotifications}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
              notifications ? "bg-[var(--sky-deep)]" : "bg-slate-500/40"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                notifications ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {/* Writing Autosave */}
        <div className="flex items-center justify-between pt-6">
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[var(--sky-deep)]" />
              <span>Writing Autosave</span>
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-bold">
              Automatically persist draft text to local storage as you type.
            </p>
          </div>
          <button
            onClick={handleToggleAutosave}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
              autosave ? "bg-[var(--sky-deep)]" : "bg-slate-500/40"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                autosave ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
