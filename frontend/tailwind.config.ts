// import { Config } from "tailwindcss";
// const withMT = require("@material-tailwind/react/utils/withMT");

// const config = withMT({
//   content: [
//     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {},
//   plugins: [],
// });

// export default config;
// tailwind.config.ts
// tailwind.config.ts
import { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;

