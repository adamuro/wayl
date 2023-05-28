import { type Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    screens: {
      mobile: {
        min: '0px',
        max: '895.9px',
      },
      desktop: '896px',
    },
  },
  plugins: [],
} satisfies Config;
