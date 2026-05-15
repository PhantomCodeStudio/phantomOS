import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:      '#FFE900',
        black:   '#0a0a0a',
        xenon:   '#4169FF',
        violet:  '#7B00FF',
        crimson: '#CC0033',
        bio:     '#00FF87',
        cyan:    '#00FFFF',
        offwhite:'#F4F2EE',
      },
    },
  },
  plugins: [],
}

export default config
