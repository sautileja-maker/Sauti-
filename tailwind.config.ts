import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0066CC',
        secondary: '#00B074',
        accent: '#FF6B6B',
        background: '#FFFFFF',
        surface: '#F5F5F5',
        text: '#1A1A1A',
        'text-secondary': '#666666',
      },
    },
  },
  plugins: [],
};

export default config;
