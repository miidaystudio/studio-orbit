import './globals.css';
import { Plus_Jakarta_Sans, JetBrains_Mono, Outfit, Space_Grotesk } from 'next/font/google';

const sansFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
});

const headingFont = Outfit({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['500', '600', '700', '800', '900'],
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
      className={`${sansFont.variable} ${headingFont.variable} ${monoFont.variable}`}
    >
      <body className="bg-[#F8F9FA] text-[#0F1115] antialiased selection:bg-[#2E5B4B] selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
