import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#0A0B0E",
        ink: "#121419",
        panel: "#171A20",
        rim: "#262B34",
        mist: "#8C96A6",
        frost: "#EAF3F3",
        teal: {
          DEFAULT: "#49E4D9",
          soft: "#8FF0E6",
        },
        bloom: {
          DEFAULT: "#F06FC0",
          soft: "#F7A3D6",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        "razonne-gradient":
          "linear-gradient(115deg, #49E4D9 0%, #7FA6E8 45%, #F06FC0 100%)",
        "razonne-radial":
          "radial-gradient(circle at 15% 20%, rgba(73,228,217,0.16), transparent 45%), radial-gradient(circle at 85% 0%, rgba(240,111,192,0.14), transparent 40%)",
      },
      maxWidth: {
        content: "1360px",
      },
    },
  },
  plugins: [],
};

export default config;
