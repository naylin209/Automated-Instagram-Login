import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e3f2fd',
          100: '#bbdefb',
          500: '#139ED5',
          600: '#0078a8',
          900: '#01579b',
        },
        secondary: {
          50: '#ffebee',
          100: '#ffcdd2',
          500: '#F22613',
          600: '#b90000',
          900: '#b71c1c',
        },
      },
    },
  },
  plugins: [],
}
export default config