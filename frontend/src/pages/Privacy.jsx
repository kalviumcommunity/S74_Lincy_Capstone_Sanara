import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import { useToast } from "../context/ToastContext";
import { ShieldCheck, Download, Lock, Trash2, Cpu, FileSpreadsheet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Privacy() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleExportData = async () => {
    setExporting(true);
    try {
      await authService.exportData();
      showToast("Data export file created & downloaded", "success");
    } catch (err) {
      console.error("Export error:", err);
      showToast("Failed to export data", "error");
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmText = prompt(
      'Type "DELETE MY SANARA MEMORY" to permanently erase all situations, decisions, outcomes, and account data:'
    );
    if (confirmText === "DELETE MY SANARA MEMORY") {
      setDeleting(true);
      try {
        await authService.deleteAccount();
        showToast("Account & data permanently deleted", "info");
        logout();
        navigate("/login");
      } catch (err) {
        console.error("Delete account error:", err);
        showToast("Failed to delete account", "error");
      } finally {
        setDeleting(false);
      }
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <p className="eyebrow-xs text-sky-700 tracking-widest">PRIVACY & DATA CONTROL</p>
        <h1 className="page-title text-slate-800 font-serif">Your data belongs only to you.</h1>
        <p className="font-serif italic text-base text-slate-600">
          "Sanara is built as a private intelligent thinking space with strict user isolation."
        </p>
      </div>

      {/* Security Principles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="sky-card p-6 bg-white border-sky-100 space-y-3 shadow-xs">
          <div className="p-2.5 rounded-xl bg-sky-100 text-sky-700 w-fit">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-slate-800">User-Scoped Memory</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Every vector embedding, situation record, and reflection is strictly scoped to your authenticated account ID.
          </p>
        </div>

        <div className="sky-card p-6 bg-white border-sky-100 space-y-3 shadow-xs">
          <div className="p-2.5 rounded-xl bg-sky-100 text-sky-700 w-fit">
            <Cpu className="w-4 h-4" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-slate-800">AI Privacy Standard</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Your private text is sent exclusively to server-side OpenAI endpoints for real-time structuring and is never used for public training.
          </p>
        </div>

        <div className="sky-card p-6 bg-white border-sky-100 space-y-3 shadow-xs">
          <div className="p-2.5 rounded-xl bg-sky-100 text-sky-700 w-fit">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-slate-800">Structured Safety</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Sanara never provides medical or diagnostic advice; it structures reported experiences for personal reflection.
          </p>
        </div>
      </div>

      {/* Data Controls Section */}
      <div className="space-y-4">
        <h3 className="eyebrow-xs text-slate-500">DATA CONTROL & SOVEREIGNTY</h3>

        <div className="sky-card p-7 bg-white border-sky-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1">
            <h4 className="font-serif text-xl font-semibold text-slate-800">
              Export Personal Intelligence Data
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Download a complete JSON file containing all your recorded situations, decisions, outcomes, and reflections.
            </p>
          </div>
          <button
            onClick={handleExportData}
            disabled={exporting}
            className="btn-sky-secondary text-xs py-3 px-5 shrink-0 font-semibold cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{exporting ? "Exporting..." : "Export Data (JSON)"}</span>
          </button>
        </div>

        <div className="sky-card p-7 bg-rose-50/50 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1">
            <h4 className="font-serif text-xl font-semibold text-rose-900">
              Delete Account & Clear Memory
            </h4>
            <p className="text-xs text-rose-700 font-medium">
              Permanently erase your account, situations, threads, vectors, and historical outcomes.
            </p>
          </div>
          <button
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shrink-0 cursor-pointer shadow-xs transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{deleting ? "Deleting..." : "Delete All Data"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
