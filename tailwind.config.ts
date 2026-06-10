import type { Config } from 'tailwindcss';

const config: Config = {
  theme: {
    extend: {
      keyframes: {
        fadeSlideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.8" },
          "50%": { opacity: "0.4" },
        },
        shoot: {
          "0%": { transform: "translateX(0) translateY(0) rotate(25deg)", opacity: "1" },
          "100%": { transform: "translateX(120vw) translateY(50vh) rotate(25deg)", opacity: "0" },
        },

      },
      animation: {
        fadeSlideUp: 'fadeSlideUp 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        twinkle: "twinkle 8s infinite linear",
        "twinkle-reverse": "twinkle 6s infinite linear reverse",
        shoot: "shoot 3s infinite ease-in",
      },
    },
  },
  plugins: [],
};

export default config;