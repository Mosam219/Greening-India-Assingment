import { MoonStar, SunMedium } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/features/theme/use-theme";

type ThemeToggleButtonProps = {
  variant?: "default" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
};

export function ThemeToggleButton({
  variant = "outline",
  size = "sm",
  className,
}: ThemeToggleButtonProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const label = isDark ? "Light mode" : "Dark mode";
  const Icon = isDark ? SunMedium : MoonStar;

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      aria-label={label}
      aria-pressed={isDark}
      onClick={toggleTheme}
    >
      <Icon className="size-4" />
      {size === "icon" ? null : label}
    </Button>
  );
}
