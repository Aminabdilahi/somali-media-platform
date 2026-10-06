import type { Config } from "tailwindcss";

const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { page: v("page"), surface: v("surface"), ink: v("ink"), muted: v("muted"),
                rule: v("rule"), sea: v("sea"), amber: v("amber"), alert: v("alert"), ok: v("ok") },
      fontFamily: {
        serif: ["Charter", "'Iowan Old Style'", "'Palatino Linotype'", "Georgia", "serif"],
        sans: ["'Segoe UI'", "system-ui", "-apple-system", "Roboto", "sans-serif"],
      },
    },
  },
} satisfies Config;
