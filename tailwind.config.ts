import { type Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      maxWidth: {
        '2xs': '16rem',
      },
      minWidth: {
        xs: '20rem',
        sm: '24rem',
        md: '28rem',
        lg: '32rem',
        xl: '36rem',
        '2xl': '40rem',
        half: '50vw',
        'scr-40': '40vw',
        'scr-30': '30vw',
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
