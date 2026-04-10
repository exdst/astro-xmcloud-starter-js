/** @type {import('tailwindcss').Config} */

// "Decoloring" prose
const proseVars = [
    '--tw-prose-body',
    '--tw-prose-headings',
    '--tw-prose-lead',
    '--tw-prose-bold',
    '--tw-prose-counters',
    '--tw-prose-bullets',
    '--tw-prose-hr',
    '--tw-prose-quotes',
    '--tw-prose-quote-borders',
    '--tw-prose-captions',
    '--tw-prose-kbd',
    '--tw-prose-kbd-shadows',
    '--tw-prose-code',
    '--tw-prose-pre-code',
    '--tw-prose-pre-bg',
    '--tw-prose-th-borders',
    '--tw-prose-td-borders',
];

module.exports = {
    darkMode: ['class'],
    theme: {
        extend: {
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'expand-content': 'expand-content 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            },
            aspectRatio: {
                '560/356': '560/356',
                '280/196': '280/196',
                '280/356': '280/356',
                '670/356': '670/356',
            },
            backgroundImage: {
                'light-gradient':
                    'linear-gradient(to bottom, #ffffff 0%, rgba(0, 81, 255, 0) 100%)',
                'primary-gradient':
                    'linear-gradient(179.89deg, #0041CD 0.1%, rgba(0, 81, 255, 0) 115.08%)',
                'dark-gradient': 'linear-gradient(to bottom, #C1C1C1 0%, rgba(28, 28, 28, 0) 100%)',
                'img-primary':
                    'linear-gradient(to bottom, hsla(var(--colors-primary) / 90%), hsla(var(--colors-primary) / 60%)), var(--bg-img, url("/placeholder.svg"))',
                'img-secondary':
                    'linear-gradient(to bottom, hsla(var(--colors-secondary) / 90%), hsla(var(--colors-secondary) / 60%)), var(--bg-img, url("/placeholder.svg"))',
                'img-muted':
                    'linear-gradient(to bottom, hsla(var(--colors-muted) / 90%), hsla(var(--colors-muted) / 60%)), var(--bg-img, url("/placeholder.svg"))',
                'img-dark':
                    'linear-gradient(to bottom, hsla(var(--colors-foreground) / 90%), hsla(var(--colors-foreground) / 60%)), var(--bg-img, url("/placeholder.svg"))',
                'img-light':
                    'linear-gradient(to bottom, hsla(var(--colors-background) / 90%), hsla(var(--colors-background) / 60%)), var(--bg-img, url("/placeholder.svg"))',
                'img-accent':
                    'linear-gradient(to bottom, hsla(var(--colors-accent) / 80%), hsla(var(--colors-accent) / 60%)), var(--bg-img, url("/placeholder.svg"))',
            },
            blur: {
                none: 'var(--blur-none)',
                sm: 'var(--blur-sm)',
                default: 'var(--blur-default)',
                md: 'var(--blur-md)',
                lg: 'var(--blur-lg)',
                xl: 'var(--blur-xl)',
                '2xl': 'var(--blur-2xl)',
                '3xl': 'var(--blur-3xl)',
            },
            borderRadius: {
                none: 'var(--border-radius-none)',
                sm: 'var(--border-radius-sm)',
                default: 'var(--border-radius-default)',
                md: 'var(--border-radius-md)',
                lg: 'var(--border-radius-lg)',
                xl: 'var(--border-radius-xl)',
                '2xl': 'var(--border-radius-2xl)',
                '3xl': 'var(--border-radius-3xl)',
                full: 'var(--border-radius-full)',
            },
            container: {
                center: true,
            },
            // Match Tailwind v4's default container-query scale (used by
            // kit-nextjs-location-finder). Previously these were aliased to
            // viewport breakpoints (lg=1024px etc.), which made
            // `@lg/herowrapper:` etc. activate at different container widths
            // than the Next.js example and shifted the hero, sections, and
            // many other components at every viewport.
            containers: {
                '3xs': '16rem',
                '2xs': '18rem',
                xs: '20rem',
                sm: '24rem',
                md: '28rem',
                lg: '32rem',
                xl: '36rem',
                '2xl': '42rem',
                '3xl': '48rem',
                '4xl': '56rem',
                '5xl': '64rem',
                '6xl': '72rem',
                '7xl': '80rem',
            },
            fontFamily: {
                heading: 'var(--font-heading)',
                body: 'var(--font-body)',
                accent: 'var(--font-accent)',
            },
            fontSize: {
                '50-clamp': 'clamp(100px, calc(50 * 1vw), 400px)',
                '40-clamp': 'clamp(100px, calc(40 * 1vw), 500px)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
                'expand-content': {
                    '0%': {
                        opacity: '0',
                        maxHeight: '0',
                    },
                    '40%': {
                        opacity: '0',
                    },
                    '100%': {
                        opacity: '1',
                        maxHeight: '500px',
                    },
                },
            },
            typography: ({ theme }) => ({
                DEFAULT: {
                    css: {
                        '--tw-prose-links': theme('colors.brand.DEFAULT'),
                        ...proseVars.reduce((acc, key) => ({ ...acc, [key]: 'inherit' }), {}),
                        h1: {
                            fontSize: theme('fontSize.5xl'),
                            fontWeight: 'normal',
                            '@screen md': {
                                fontSize: theme('fontSize.6xl'),
                            },
                        },
                        h2: {
                            fontSize: theme('fontSize.4xl'),
                            fontWeight: 'normal',
                            '@screen md': {
                                fontSize: theme('fontSize.5xl'),
                            },
                        },
                        h3: {
                            fontSize: theme('fontSize.3xl'),
                            fontWeight: 'normal',
                            '@screen md': {
                                fontSize: theme('fontSize.4xl'),
                            },
                        },
                        h4: {
                            fontSize: theme('fontSize.2xl'),
                            fontWeight: 'normal',
                            '@screen md': {
                                fontSize: theme('fontSize.3xl'),
                            },
                        },
                        h5: {
                            fontSize: theme('fontSize.xl'),
                            fontWeight: 'normal',
                            '@screen md': {
                                fontSize: theme('fontSize.2xl'),
                            },
                        },
                    },
                },
            }),
            zIndex: {
                '-z-1': '-1',
            },
        },
    },
};
