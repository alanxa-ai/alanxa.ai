/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Brand & Primary Colors
                'brand-primary': '#6366F1',      // Electric Indigo - Main brand color
                'brand-secondary': '#4F46E5',    // Deep Indigo - Secondary accent
                'brand-gradient': '#06B6D4',     // Aqua Cyan - Gradient highlight
                'brand-cta': '#0EA5E9',          // Sky Electric Blue - CTA buttons

                // Background System
                'bg-light': '#F1F5F9',           // Soft White - Main background
                'bg-dark': '#0F172A',            // Navy Black - Dark sections
                'bg-card': '#FFFFFF',            // Pure white cards
                'border-light': '#E2E8F0',       // Card borders

                // Text Colors
                'text-primary': '#1E293B',       // Slate Black - Primary text
                'text-secondary': '#475569',     // Muted Slate - Secondary text
                'text-light-main': '#F8FAFC',    // Main text on dark
                'text-light-muted': '#CBD5E1',   // Muted text on dark

                // Aliases for easier use
                primary: '#6366F1',
                secondary: '#4F46E5',
                accent: '#06B6D4',
                dark: '#0F172A',
                light: '#F1F5F9',
            },
            backgroundImage: {
                'gradient-brand': 'linear-gradient(90deg, #4F46E5 0%, #6366F1 50%, #06B6D4 100%)',
                'gradient-brand-radial': 'radial-gradient(circle, #6366F1 0%, #4F46E5 50%, #06B6D4 100%)',
                'gradient-hero': 'linear-gradient(135deg, #4F46E5 0%, #6366F1 40%, #06B6D4 100%)',
            },
            boxShadow: {
                'cta': '0 4px 12px rgba(14, 165, 233, 0.35)',
                'brand': '0 4px 16px rgba(99, 102, 241, 0.25)',
                'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
