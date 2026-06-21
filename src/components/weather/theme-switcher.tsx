"use client";

import { motion } from "motion/react";
import { Sun, Moon, Palette, Check } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type ThemeType = "sage" | "sunset" | "sand";
type ModeType = "light" | "dark";

interface ThemeSwitcherProps {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  mode: ModeType;
  setMode: (mode: ModeType) => void;
}

export function ThemeSwitcher({
  theme,
  setTheme,
  mode,
  setMode,
}: ThemeSwitcherProps) {
  const themesList: Array<{ id: ThemeType; name: string; colors: string; label: string }> = [
    {
      id: "sage",
      name: "Forest Sage",
      colors: "from-emerald-500 to-teal-600 dark:from-emerald-700 dark:to-teal-800",
      label: "Sage",
    },
    {
      id: "sunset",
      name: "Sunset Amber",
      colors: "from-orange-400 to-rose-500 dark:from-orange-600 dark:to-rose-700",
      label: "Sunset",
    },
    {
      id: "sand",
      name: "Desert Sand",
      colors: "from-stone-400 to-amber-600/60 dark:from-stone-600 dark:to-amber-800/50",
      label: "Sand",
    },
  ];

  return (
    <div className="flex items-center gap-1 sm:gap-2.5 rounded-full border border-border/30 bg-card/45 p-1 sm:p-1.5 shadow-lg backdrop-blur-md">
      {/* Palette Icon / Label (visible on larger screens) */}
      <div className="hidden sm:flex items-center gap-1.5 px-3 text-muted-foreground">
        <Palette className="h-4 w-4" />
        <span className="hidden text-xs font-semibold sm:inline">Theme:</span>
      </div>

      {/* Theme Options */}
      <div className="flex items-center gap-0.5 sm:gap-1">
        {themesList.map((t) => {
          const isActive = theme === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={cn(
                "relative flex h-7 items-center justify-center rounded-full transition-all duration-300",
                "w-7 sm:w-auto sm:h-8 sm:px-3 sm:gap-1.5 text-xs font-medium",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              )}
              title={t.name}
            >
              {/* Background active pill anim */}
              {isActive && (
                <motion.div
                  layoutId="activeTheme"
                  className="absolute inset-0 rounded-full bg-primary/10 border border-primary/20"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              {/* Theme color circle */}
              <span
                className={cn(
                  "relative z-10 h-3 w-3 rounded-full bg-gradient-to-br shadow-sm",
                  t.colors
                )}
              />

              <span className="relative z-10 hidden sm:inline">{t.label}</span>

              {isActive && (
                <Check className="relative z-10 h-3 w-3 text-primary animate-in fade-in zoom-in duration-300 hidden sm:block" />
              )}
            </button>
          );
        })}
      </div>

      <div className="h-5 w-[1px] bg-border/40" />

      {/* Light / Dark Mode Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setMode(mode === "light" ? "dark" : "light")}
        className="h-7 w-7 sm:h-8 sm:w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/30"
        title={mode === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
      >
        <div className="relative h-4 w-4">
          <Sun
            className={cn(
              "absolute inset-0 transition-transform duration-500",
              mode === "dark" ? "rotate-90 scale-0" : "rotate-0 scale-100"
            )}
          />
          <Moon
            className={cn(
              "absolute inset-0 transition-transform duration-500",
              mode === "light" ? "-rotate-90 scale-0" : "rotate-0 scale-100"
            )}
          />
        </div>
      </Button>
    </div>
  );
}
