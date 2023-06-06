import { type Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      neutral: colors.neutral,
      teal: colors.teal,
    },
    extend: {
      minWidth: {
        '2xs': '16rem',
        xs: '20rem',
        sm: '24rem',
        md: '28rem',
        lg: '32rem',
        xl: '36rem',
        '2xl': '40rem',
      },
      maxWidth: {
        '2xs': '16rem',
      },
      width: {
        '2xs': '16rem',
      },
    },
    screens: {
      mobile: {
        min: '0px',
        max: '1151.9px',
      },
      desktop: '1152px',
    },
  },
  plugins: [],
} satisfies Config;
