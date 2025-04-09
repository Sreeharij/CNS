// /** @type {import('tailwindcss').Config} */
// // tailwind.config.js
// module.exports = {
//   content: [
//     "./src/**/*.{js,ts,jsx,tsx}", // adjust based on your folder structure
//   ],
//   theme: {
//     extend: {
//       colors: {
//         nitc: {
//           blue: "#1E40AF",
//           lightBlue: "#EFF6FF",
//           darkBlue: "#1E3A8A",
//           green: "#059669",
//           lightGreen: "#D1FAE5",
//         },
//       },
//     },
//   },
//   plugins: [],
// };


/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,jsx}",
		"./components/**/*.{js,jsx}",
		"./app/**/*.{js,jsx}",
		"./src/**/*.{js,jsx}",
	],
	theme: {
		extend: {
			colors: {
				nitc: {
					blue: "#1E40AF",
					lightBlue: "#EFF6FF",
					darkBlue: "#1E3A8A",
					green: "#059669",
					lightGreen: "#D1FAE5",
					purple: "#8B5CF6",
					pink: "#EC4899",
					orange: "#F97316",
					yellow: "#EAB308",
					teal: "#14B8A6",
					cyan: "#06B6D4",
					indigo: "#6366F1"
				}
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
				'float': {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					}
				},
				'float-slow': {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-15px)'
					}
				},
				'float-delay': {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-8px)'
					}
				},
				'pulse-light': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.8'
					}
				},
				'gradient-shift': {
					'0%': { 
						backgroundPosition: '0% 50%' 
					},
					'50%': { 
						backgroundPosition: '100% 50%' 
					},
					'100%': { 
						backgroundPosition: '0% 50%' 
					}
				},
				'modal-appear': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'float-slow': 'float-slow 8s ease-in-out infinite',
				'float-delay': 'float-delay 7s ease-in-out infinite 1s',
				'pulse-light': 'pulse-light 3s ease-in-out infinite',
				'gradient-shift': 'gradient-shift 15s ease infinite',
				'modal-appear': 'modal-appear 0.3s ease-out'
			},
			backgroundImage: {
				'hero-pattern': "url('https://images.unsplash.com/photo-1544089605-2a698c402ce8?q=80&w=1974&auto=format&fit=crop')",
				'gradient-nitc': 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
				'gradient-blue-purple': 'linear-gradient(90deg, #1E40AF 0%, #8B5CF6 100%)',
				'gradient-green-blue': 'linear-gradient(90deg, #059669 0%, #0284C7 100%)',
				'gradient-orange-pink': 'linear-gradient(90deg, #F97316 0%, #EC4899 100%)'
			}
		}
	},
	plugins: [],
};
