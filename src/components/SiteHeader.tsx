import { Link } from "@tanstack/react-router";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function SiteHeader() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25, restDelta: 0.001 });
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border">
      <motion.div
        style={{ scaleX }}
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent origin-left"
      />
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsOpen(false)}>
          <span className="h-7 w-7 rounded-full bg-foreground text-background grid place-items-center font-serif text-sm">
            K
          </span>
          <span className="font-serif text-lg tracking-tight">Kaushik Patil</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            activeProps={{ className: "text-foreground font-medium" }}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Work
          </Link>
          <Link
            to="/about"
            activeProps={{ className: "text-foreground font-medium" }}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
          <Link
            to="/process"
            activeProps={{ className: "text-foreground font-medium" }}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Process
          </Link>
          <Link
            to="/contact"
            activeProps={{ className: "text-foreground font-medium" }}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/resume.pdf"
            download
            className="text-sm px-4 py-2 rounded-full bg-foreground text-background hover:bg-accent transition-colors"
          >
            Résumé ↓
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-full hover:bg-secondary/80 text-foreground transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden border-t border-border bg-background/95 backdrop-blur-md overflow-hidden"
          >
            <nav className="flex flex-col px-6 py-6 gap-4 text-base font-serif">
              <Link
                to="/"
                activeOptions={{ exact: true }}
                activeProps={{ className: "text-accent pl-2 border-l-2 border-accent font-medium" }}
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors py-1.5"
              >
                Work
              </Link>
              <Link
                to="/about"
                activeProps={{ className: "text-accent pl-2 border-l-2 border-accent font-medium" }}
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors py-1.5"
              >
                About
              </Link>
              <Link
                to="/process"
                activeProps={{ className: "text-accent pl-2 border-l-2 border-accent font-medium" }}
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors py-1.5"
              >
                Process
              </Link>
              <Link
                to="/contact"
                activeProps={{ className: "text-accent pl-2 border-l-2 border-accent font-medium" }}
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors py-1.5"
              >
                Contact
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
