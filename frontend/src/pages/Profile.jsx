import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { situationService } from "../services/situationService";
import { useToast } from "../context/ToastContext";
import { motion } from "framer-motion";
import { User, Mail, Calendar, Layers, CheckCircle2, Brain, Compass, Save } from "lucide-react";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);

  const [stats, setStats] = useState({
    situations: 0,
    activeThreads: 0,
    resolved: 0,
    patterns: 0,
  });

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [sits, pats] = await Promise.allSettled([
          situationService.getSituations(),
          situationService.getPatterns(),
        ]);
        if (isMounted) {
          if (sits.status === "fulfilled" && Array.isArray(sits.value)) {
            const all = sits.value;
            setStats((prev) => ({
              ...prev,
              situations: all.length,
              activeThreads: all.filter((s) => s.status !== "resolved").length,
              resolved: all.filter((s) => s.status === "resolved").length,
            }));
          }
          if (pats.status === "fulfilled" && pats.value?.patterns) {
            setStats((prev) => ({ ...prev, patterns: pats.value.patterns.length }));
          }
        }
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await updateProfile({ name });
      showToast("Profile name updated successfully", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pt-2">
      {/* Header */}
      <div className="space-y-2">
        <p className="eyebrow-xs text-[var(--sky-deep)] tracking-widest font-extrabold">YOUR SPACE</p>
        <h1 className="page-title text-[var(--text-primary)] font-serif font-bold">Profile & Reflection Journey</h1>
      </div>

      {/* User Profile Card */}
      <div className="pinterest-card p-8 bg-[var(--card-bg)] border-[var(--border-subtle)] space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-[var(--sky-soft)] border-2 border-[var(--sky-primary)] text-[var(--sky-deep)] flex items-center justify-center font-serif text-2xl font-bold shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
          </div>

          <div className="space-y-1 min-w-0 flex-1">
            <h2 className="font-serif text-2xl font-bold text-[var(--text-primary)]">
              {user?.name || "Thoughtful User"}
            </h2>
            <p className="text-xs text-[var(--text-secondary)] font-bold flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[var(--sky-deep)]" />
              <span>{user?.email || "user@domain.com"}</span>
            </p>
            <p className="text-xs text-[var(--text-muted)] font-bold flex items-center gap-1.5 pt-1">
              <Calendar className="w-3.5 h-3.5 text-[var(--sky-deep)]" />
              <span>Member of private thinking space</span>
            </p>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="pt-4 border-t border-[var(--border-subtle)] space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--text-primary)]">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-sky text-xs max-w-md font-bold"
            />
          </div>

          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="btn-sky-primary text-xs py-2.5 px-6 font-bold shadow-xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Saving..." : "Save changes"}</span>
          </button>
        </form>
      </div>

      {/* YOUR JOURNEY REFLECTION STATISTICS */}
      <section className="space-y-4">
        <h3 className="eyebrow-xs text-[var(--text-muted)] font-extrabold">YOUR THINKING JOURNEY</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="pinterest-card p-5 bg-[var(--card-bg)] border-[var(--border-subtle)] space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-[var(--sky-soft)] text-[var(--sky-deep)] flex items-center justify-center font-bold">
              <Compass className="w-4 h-4" />
            </div>
            <p className="text-3xl font-serif font-bold text-[var(--text-primary)]">{stats.situations}</p>
            <p className="text-xs text-[var(--text-secondary)] font-bold">Situations explored</p>
          </div>

          <div className="pinterest-card p-5 bg-[var(--card-bg)] border-[var(--border-subtle)] space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <p className="text-3xl font-serif font-bold text-[var(--text-primary)]">{stats.activeThreads}</p>
            <p className="text-xs text-[var(--text-secondary)] font-bold">Active threads</p>
          </div>

          <div className="pinterest-card p-5 bg-[var(--card-bg)] border-[var(--border-subtle)] space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="text-3xl font-serif font-bold text-[var(--text-primary)]">{stats.resolved}</p>
            <p className="text-xs text-[var(--text-secondary)] font-bold">Resolved chapters</p>
          </div>

          <div className="pinterest-card p-5 bg-[var(--card-bg)] border-[var(--border-subtle)] space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Brain className="w-4 h-4" />
            </div>
            <p className="text-3xl font-serif font-bold text-[var(--text-primary)]">{stats.patterns}</p>
            <p className="text-xs text-[var(--text-secondary)] font-bold">Patterns discovered</p>
          </div>
        </div>
      </section>
    </div>
  );
}
