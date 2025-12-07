/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class', // Allows manual toggle
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                serif: ['Merriweather', 'serif'], // Import from Google Fonts
                sans: ['Inter', 'sans-serif'],    // Import from Google Fonts
            },
            colors: {
                // The "Premium" Zinc Palette
                background: {
                    DEFAULT: '#FAFAFA', // Light Mode Bg
                    dark: '#09090B',    // Dark Mode Bg
                },
                surface: {
                    DEFAULT: '#FFFFFF', // Light Mode Card
                    dark: '#18181B',    // Dark Mode Card
                },
                border: {
                    DEFAULT: '#E4E4E7', // Light Mode Border
                    dark: '#27272A',    // Dark Mode Border
                },
                // Your Specific Category Accents
                category: {
                    india: '#F97316',
                    global: '#3B82F6',
                    tech: '#8B5CF6',
                    sports: '#10B981',
                    finance: '#0EA5E9',
                    political: '#EF4444',
                }
            },
            boxShadow: {
                'premium': '0 0 0 1px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.04)',
                'premium-dark': '0 0 0 1px rgba(255,255,255,0.05), 0 4px 12px rgba(0,0,0,0.5)',
            }
        },
    },
    plugins: [],
}
