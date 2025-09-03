import { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { usePackageStore, useSubjectStore } from "@/store/store";

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const steps = useMemo(
    () => [
      { key: "home", label: "Choose Subject", path: "/" },
      { key: "package", label: "Select Package", path: "/package" },
      { key: "checkout", label: "Checkout", path: "/order" },
    ],
    []
  );

  const activeIndex = useMemo(() => {
    const idx = steps.findIndex((s) =>
      s.path === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(s.path)
    );
    return idx === -1 ? 0 : idx;
  }, [location.pathname, steps]);

  const handleNavigate = () => setOpen(false);
   const { item: subject } = useSubjectStore();
    const { item: pkg } = usePackageStore();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary/90 text-primary-foreground backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-lg font-bold sr-only">
              Go Fluent
            </Link>
            <button
              aria-label={open ? "Close steps" : "Open steps"}
              aria-expanded={open}
              aria-controls="nav-steps"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-primary-foreground hover:bg-accent/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F6AE31]"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <nav aria-label="Progress" className="hidden md:block">
            <ol className="flex items-center gap-6">
              {steps.map((s, i) => (
                <li key={s.key} className="flex items-center gap-3">
                  <Link
                    to={s.path}
                    onClick={handleNavigate}
                    className="flex items-center gap-3"
                    aria-current={i === activeIndex ? "step" : undefined}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-colors duration-150 ${
                        i <= activeIndex
                          ? "bg-[#F6AE31] text-background"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <span
                      className={`text-sm font-medium transition-colors duration-150 ${
                        i <= activeIndex ? "text-[#F6AE31]" : "text-white/90"
                      }`}
                    >
                      {s.label}
                    </span>
                  </Link>
                  {i < steps.length - 1 && (
                    <div className="w-14 h-[2px] bg-[#F6AE31]" aria-hidden />
                  )}
                </li>
              ))}
            </ol>
          </nav>

          {/* Right: empty spacer to keep center layout balanced on md+ */}
          <div className="w-8" />
        </div>

        {/* Mobile collapsible steps - revealed when hamburger open */}
        <div
          id="nav-steps"
          className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-200 ${
            open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ol className="flex flex-col gap-3 py-3">
            {steps.map((s, i) => (
              <li key={s.key} className="">
                <Link
                  to={s.path}
                  onClick={handleNavigate}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F6AE31] transition-colors ${
                    i <= activeIndex
                      ? "bg-[#F6AE31]/10 text-[#F6AE31]"
                      : "text-white/90"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      i <= activeIndex
                        ? "bg-[#F6AE31] text-background"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span className="text-sm font-medium">{s.label}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
