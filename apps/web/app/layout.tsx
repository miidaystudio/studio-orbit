import './globals.css';
import { Plus_Jakarta_Sans, Instrument_Serif, JetBrains_Mono } from 'next/font/google';

const sansFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const serifFont = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-serif',
});

const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata = {
  title: 'StudioOrbit | Digital Productivity Cockpit & Review Canvas',
  description: 'Visual QA staging, coordinate-pinned asset review canvas, and retainers ledger.',
  icons: {
    icon: [
      { url: '/favicon.jpg', type: 'image/jpeg' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/favicon.jpg',
    apple: '/favicon.jpg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sansFont.variable} ${serifFont.variable} ${monoFont.variable}`}
    >
      <body className="bg-[#08090A] text-[#FFFFFF] antialiased selection:bg-[#CCFF00] selection:text-black font-sans">
        {children}
      </body>
    </html>
  );
}


