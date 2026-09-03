import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SkyBackground from "../SkyBackground";
import AskSanaraModal from "../AskSanaraModal";
import { situationService } from "../../services/situationService";
import {
  LogOut,
  User as UserIcon,
  Shield,
  Settings as SettingsIcon,
  Menu,
  X,
  Search,
  Sparkles,
  ChevronLeft,
  Compass,
  Plus,
  Bookmark,
  Layers,
  Sun,
  Moon,
} from "lucide-react";

const NAV_PRIMARY = [
  { name: "Untangle", path: "/untangle", symbol: "✦" },
  { name: "Threads", path: "/threads", symbol: "◇" },
  { name: "My Map", path: "/map", symbol: "◎" },
  { name: "Resolved", path: "/resolved", symbol: "✓" },
];

const NAV_SECONDARY = [
  { name: "Profile", path: "/profile", icon: UserIcon },
  { name: "Privacy", path: "/privacy", icon: Shield },
  { name: "Settings", path: "/settings", icon: SettingsIcon },
];

export default function AppLayout({ children }) {
  const { user, logout, theme, toggleTheme } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [askModalOpen, setAskModalOpen] = useState(false);

  const [activeCount, setActiveCount] = useState(null);
  const [resolvedCount, setResolvedCount] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchCounts = async () => {
      try {
        const data = await situationService.getSituations();
        if (isMounted && Array.isArray(data)) {
          const active = data.filter((s) => s.status !== "resolved").length;
          const resolved = data.filter((s) => s.status === "resolved").length;
          setActiveCount(active);
          setResolvedCount(resolved);
        }
      } catch (err) {
        // Silent
      }
    };
    fetchCounts();
    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  const isActive = (path) => {
    if (path === "/threads") return location.pathname.startsWith("/threads");
    return location.pathname === path;
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Personal reflection space";
    if (path === "/untangle") return "Untangle a situation";
    if (path.startsWith("/threads")) return "Living threads";
    if (path === "/map") return "Constellation map";
    if (path === "/resolved") return "Resolved chapters";
    if (path === "/profile") return "Your space";
    if (path === "/privacy") return "Privacy & data control";
    if (path === "/settings") return "Preferences";
    return "Personal reflection space";
  };

  return (
    <div className="min-h-screen font-sans bg-[var(--bg-canvas)] text-[var(--text-primary)] relative flex flex-col md:flex-row transition-colors duration-250">
      {/* Soft Sky Atmospheric Canvas */}
      <SkyBackground />

      {/* ════════════════════════════════════════
          PINTEREST-STYLE DESKTOP SIDEBAR
          ════════════════════════════════════════ */}
      <aside className="hidden md:flex flex-col w-72 fixed top-0 left-0 h-screen z-30 justify-between select-none bg-[var(--bg-secondary)]/95 backdrop-blur-md border-r border-[var(--border-subtle)] p-6">
        <div className="space-y-8">
          {/* Brand Header */}
          <Link to="/" className="group block text-decoration-none">
            <div className="flex items-center gap-2.5">
              <img
                src="/sanara-logo.png"
                alt="Sanara Logo"
                className="w-10 h-10 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform"
              />
              <div>
                <h1 className="font-serif text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                  SANARA
                </h1>
                <p className="eyebrow-xs text-[var(--sky-deep)] text-[9px] tracking-widest font-extrabold">
                  SITUATION INTELLIGENCE
                </p>
              </div>
            </div>
          </Link>

          {/* Quick Create Action Pill */}
          <button
            onClick={() => navigate("/untangle")}
            className="btn-sky-primary w-full py-3.5 px-5 shadow-lg flex items-center justify-center gap-2 text-sm font-bold group cursor-pointer"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
            <span>Untangle situation</span>
          </button>

          {/* Primary Navigation Pills — Thinking Loop */}
          <nav className="space-y-2">
            <p className="eyebrow-xs px-3 text-[10px] text-[var(--text-muted)]">THINKING LOOP</p>
            {NAV_PRIMARY.map((item) => {
              const active = isActive(item.path);
              let badgeText = null;
              if (item.name === "Threads" && activeCount !== null) {
                badgeText = `${activeCount}`;
              } else if (item.name === "Resolved" && resolvedCount !== null) {
                badgeText = `${resolvedCount}`;
              }

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-4 py-3 rounded-full text-sm font-bold transition-all text-decoration-none border ${
                    active
                      ? "bg-[var(--card-bg)] text-[var(--sky-deep)] shadow-md border-[var(--border-subtle)]"
                      : "text-[var(--text-secondary)] border-transparent hover:bg-[var(--card-bg)]/80 hover:text-[var(--text-primary)] hover:border-[var(--border-subtle)]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-base text-[var(--sky-deep)] w-5 text-center font-bold">
                      {item.symbol}
                    </span>
                    <span>{item.name}</span>
                  </div>

                  {badgeText && (
                    <span
                      className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        active
                          ? "bg-[var(--sky-soft)] text-[var(--sky-deep)]"
                          : "bg-[var(--card-bg)]/80 text-[var(--text-muted)] border border-[var(--border-subtle)]"
                      }`}
                    >
                      {badgeText}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Account Navigation */}
          <nav className="space-y-1.5 pt-4 border-t border-[var(--border-subtle)]">
            <p className="eyebrow-xs px-3 text-[10px] text-[var(--text-muted)]">ACCOUNT & DATA</p>
            {NAV_SECONDARY.map((item) => {
              const active = isActive(item.path);
              const IconComp = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-bold transition-all text-decoration-none border ${
                    active
                      ? "bg-[var(--card-bg)] text-[var(--text-primary)] shadow-xs border-[var(--border-subtle)]"
                      : "text-[var(--text-secondary)] border-transparent hover:bg-[var(--card-bg)]/70 hover:text-[var(--text-primary)]"
                  }`}
                >
                  <IconComp className="w-4 h-4 text-[var(--sky-deep)]" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer with Theme Toggle & User Card */}
        <div className="pt-4 border-t border-[var(--border-subtle)] space-y-3">
          {/* Quick Theme Toggle Pill */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-full bg-[var(--card-bg)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] hover:border-[var(--sky-primary)] transition-all cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-2">
              {theme === "light" ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-sky-400" />
              )}
              <span>{theme === "light" ? "Light Mode" : "Dark Mode"}</span>
            </div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[var(--sky-soft)] text-[var(--sky-deep)] uppercase">
              Toggle
            </span>
          </button>

          {user && (
            <div className="flex items-center justify-between gap-3 p-2 bg-[var(--card-bg)]/90 rounded-2xl border border-[var(--border-subtle)] shadow-xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[var(--sky-soft)] border border-[var(--sky-primary)] text-[var(--sky-deep)] flex items-center justify-center font-serif text-sm font-bold shrink-0">
                  {user.name ? user.name.charAt(0).toUpperCase() : "S"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold truncate text-[var(--text-primary)]">
                    {user.name || "Thoughtful User"}
                  </p>
                  <p className="text-[10px] truncate text-[var(--text-muted)] font-semibold">
                    {user.email || ""}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-canvas)] rounded-xl transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ════════════════════════════════════════
          PINTEREST TOP BAR (DESKTOP)
          ════════════════════════════════════════ */}
      <div className="flex-1 md:ml-72 min-h-screen flex flex-col z-10">
        <header className="hidden md:flex items-center justify-between px-8 py-4 sticky top-0 z-20 bg-[var(--bg-canvas)]/90 backdrop-blur-md border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            {location.pathname !== "/" && (
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full bg-[var(--card-bg)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--sky-primary)] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--sky-deep)]">
                CURRENT SPACE
              </p>
              <h2 className="text-sm font-bold text-[var(--text-primary)]">{getPageTitle()}</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Top Bar Theme Switcher Icon */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-[var(--card-bg)] border border-[var(--border-subtle)] hover:border-[var(--sky-primary)] text-[var(--text-primary)] transition-all cursor-pointer shadow-2xs"
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4 text-[var(--sky-deep)]" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* Pinterest Pill Search Action */}
            <button
              onClick={() => setAskModalOpen(true)}
              className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-[var(--card-bg)] border border-[var(--border-subtle)] hover:border-[var(--sky-primary)] text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--sky-deep)] shadow-sm transition-all cursor-pointer group"
            >
              <Search className="w-4 h-4 text-[var(--sky-deep)] transition-transform group-hover:scale-110" />
              <span>Search or ask Sanara about your thinking...</span>
              <span className="px-2 py-0.5 rounded-full bg-[var(--sky-soft)] text-[10px] font-extrabold text-[var(--sky-deep)] ml-2">
                ✦ Ask AI
              </span>
            </button>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-5 py-3.5 sticky top-0 z-40 bg-[var(--bg-canvas)]/95 backdrop-blur-md border-b border-[var(--border-subtle)]">
          <Link to="/" className="flex items-center gap-2 text-decoration-none">
            <img
              src="/sanara-logo.png"
              alt="Sanara Logo"
              className="w-8 h-8 rounded-xl object-cover shadow-xs"
            />
            <div>
              <span className="font-serif text-lg font-bold text-[var(--text-primary)]">SANARA</span>
              <span className="block text-[8px] font-bold text-[var(--sky-deep)] tracking-wider">
                PERSONAL INTELLIGENCE
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-[var(--card-bg)] border border-[var(--border-subtle)] text-[var(--text-primary)] cursor-pointer"
            >
              {theme === "light" ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
            <Link to="/untangle" className="btn-sky-primary text-xs py-2 px-4">
              ✦ Untangle
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-14 z-30 p-6 flex flex-col justify-between bg-[var(--bg-secondary)]">
            <div className="space-y-6">
              <nav className="space-y-2">
                <p className="eyebrow-xs px-2 text-[10px] text-[var(--text-muted)]">THINKING LOOP</p>
                {NAV_PRIMARY.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3.5 rounded-2xl font-bold text-sm bg-[var(--card-bg)] text-[var(--text-primary)] text-decoration-none shadow-xs border border-[var(--border-subtle)]"
                  >
                    <span className="font-serif text-base text-[var(--sky-deep)]">{item.symbol}</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>

              <nav className="space-y-2 pt-4 border-t border-[var(--border-subtle)]">
                <p className="eyebrow-xs px-2 text-[10px] text-[var(--text-muted)]">ACCOUNT</p>
                {NAV_SECONDARY.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl font-bold text-xs text-[var(--text-secondary)] text-decoration-none"
                  >
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {user && (
              <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
                <span className="text-xs font-bold text-[var(--text-primary)]">{user.name}</span>
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="btn-sky-secondary text-xs py-1.5 px-3"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════
            MAIN CONTENT AREA
            ════════════════════════════════════════ */}
        <main className="flex-1 p-5 sm:p-8 max-w-6xl w-full mx-auto pb-28 md:pb-16 relative z-10">
          {children}
        </main>
      </div>

      {/* Ask Sanara Modal */}
      <AskSanaraModal isOpen={askModalOpen} onClose={() => setAskModalOpen(false)} />
    </div>
  );
}
