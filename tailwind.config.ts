
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
				'sm': '640px',
				'md': '768px',
				'lg': '1024px',
				'xl': '1280px',
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
				blue: {
					'slate': '#1A365D',
					'accent': '#1E88E5',
					'light': '#EBF8FF',
					'muted': '#718096',
					'surface': '#FFFFFF',
					'border': '#BEE3F8',
					'success': '#38A169',
					'warning': '#F6AD55',
					'error': '#E53E3E',
					'info': '#2B6CB0',
					'dark-gray': '#1A202C',
					'gray': '#718096'
				},
				apple: {
					'blue': '#1E88E5',
					'gray': '#718096',
					'light-gray': '#EBF8FF',
					'dark-gray': '#171923',
					'red': '#E53E3E',
					'green': '#38A169',
					'orange': '#F6AD55',
					'yellow': '#ECC94B',
					'purple': '#805AD5',
					'teal': '#319795',
					'indigo': '#3182CE'
				},
				legal: {
					'slate': '#1A365D',
					'accent': '#1E88E5',
					'light': '#EBF8FF',
					'muted': '#718096',
					'surface': '#FFFFFF',
					'border': '#BEE3F8',
					'success': '#38A169',
					'warning': '#F6AD55',
					'error': '#E53E3E',
					'info': '#2B6CB0'
				}
			},
			spacing: {
				'1': '0.25rem',
				'2': '0.5rem',
				'3': '0.75rem',
				'4': '1rem',
				'5': '1.25rem',
				'6': '1.5rem',
				'8': '2rem',
				'10': '2.5rem',
				'12': '3rem',
				'16': '4rem',
				'20': '5rem',
				'24': '6rem',
				'32': '8rem',
				'40': '10rem',
				'48': '12rem',
				'56': '14rem',
				'64': '16rem',
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
				'card': '0 2px 8px rgba(0, 0, 0, 0.04)',
				'blue': '0 2px 10px rgba(29, 78, 216, 0.05)',
				'blue-hover': '0 4px 20px rgba(29, 78, 216, 0.1)'
			},
			backdropBlur: {
				'xs': '2px'
			},
			typography: {
				DEFAULT: {
					css: {
						maxWidth: '65ch',
						color: 'var(--foreground)',
						a: {
							color: 'var(--primary)',
							textDecoration: 'underline',
							fontWeight: '500',
						},
						'h1, h2, h3, h4': {
							color: 'var(--foreground)',
							fontWeight: '600',
						},
						code: {
							color: 'var(--primary)',
							backgroundColor: 'var(--muted)',
							borderRadius: '0.25rem',
							paddingLeft: '0.25rem',
							paddingRight: '0.25rem',
							paddingTop: '0.125rem',
							paddingBottom: '0.125rem',
						},
					},
				},
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
