import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				legal: {
					'slate': '#4A6572',
					'accent': '#006039',
					'light': '#F0F0F0',
					'muted': '#7F8C8D',
					'surface': '#FFFFFF',
					'border': '#E0E0E0',
					'success': '#006039',
					'warning': '#7F8C8D',
					'error': '#C0392B',
					'info': '#4A6572'
				},
				apple: {
					'blue': '#006039',
					'gray': '#7F8C8D',
					'light-gray': '#F0F0F0',
					'dark-gray': '#4A6572',
					'red': '#C0392B',
					'green': '#006039',
					'orange': '#D35400',
					'yellow': '#F39C12',
					'purple': '#8E44AD',
					'teal': '#16A085',
					'indigo': '#2980B9'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0'
					},
					'100%': {
						opacity: '1'
					}
				},
				'fade-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'pulse-subtle': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.85'
					}
				},
				'scale': {
					'0%': {
						transform: 'scale(0.95)'
					},
					'100%': {
						transform: 'scale(1)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out forwards',
				'fade-up': 'fade-up 0.5s ease-out forwards',
				'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
				'scale': 'scale 0.2s ease-out'
			},
			fontFamily: {
				sans: ['-apple-system', 'BlinkMacSystemFont', 'San Francisco', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'sans-serif'],
				serif: ['New York', 'Times New Roman', 'serif'],
				mono: ['SF Mono', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace']
			},
			boxShadow: {
				'elegant': '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
				'elevated': '0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 1px 3px 0 rgba(0, 0, 0, 0.1)',
				'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
				'apple': '0 2px 10px rgba(0, 0, 0, 0.05)',
				'apple-hover': '0 4px 20px rgba(0, 0, 0, 0.1)',
				'card': '0 2px 8px rgba(0, 0, 0, 0.04)'
			},
			backdropBlur: {
				'xs': '2px'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
