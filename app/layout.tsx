import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import PwaEnhancer from '@/components/PwaEnhancer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'ShivMandir — Your Personal Digital Shiv Mandir',
  description: 'Daily Shiv guidance, AI bhakt companion, Rudraksha advisor, and temple services. Har Har Mahadev!',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🕉</text></svg>",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans sacred-bg min-h-screen bg-black text-white antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function () {
  try {
    var host = window.location.hostname;
    var isLocal = host === 'localhost' || host === '127.0.0.1';
    if (!isLocal) return;

    var reloadKey = 'shivmandir-dev-cache-cleaned';

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function (regs) {
        regs.forEach(function (reg) { reg.unregister(); });
      });
    }

    if ('caches' in window) {
      caches.keys().then(function (keys) {
        keys.forEach(function (key) { caches.delete(key); });
      });
    }

    // Force one reload after cleanup to invalidate stale HTML/CSS references.
    if (!sessionStorage.getItem(reloadKey)) {
      sessionStorage.setItem(reloadKey, '1');
      window.location.reload();
    }
  } catch (e) {
    console.warn('Local cache cleanup skipped', e);
  }
})();`,
          }}
        />
        <Navbar />
        <PwaEnhancer />
        <main className="min-h-screen px-4 pt-20 md:px-8">
          {children}
        </main>
      </body>
    </html>
  )
}
