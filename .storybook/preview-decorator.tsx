import { Geist, Geist_Mono } from 'next/font/google';

// Initialize the fonts the same way as in the main app
const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

// Create a decorator that applies the font classes
export const withTheme = (Story) => {
    return (
        <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <Story />
        </div>
    );
};
