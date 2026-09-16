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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sansFont.variable} ${serifFont.variable} ${monoFont.variable}`}
    >
      <body className="bg-[#F7F7F9] text-[#0F172A] antialiased selection:bg-[#6366F1] selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}


