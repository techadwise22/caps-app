import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CAPS CA - Chartered Accountancy Learning Platform',
  description: 'Comprehensive learning platform for CA students with mock tests, study materials, and performance analytics.',
  authors: [{ name: 'CAPS Team' }],
  keywords: 'CA, Chartered Accountancy, CA Foundation, CA Intermediate, CA Final, mock tests, study materials, learning analytics',
  openGraph: {
    title: 'CAPS CA - Chartered Accountancy Learning Platform',
    description: 'Comprehensive learning platform for CA students with mock tests, study materials, and performance analytics.',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'CAPS CA - Chartered Accountancy Learning Platform',
    description: 'Comprehensive learning platform for CA students with mock tests, study materials, and performance analytics.',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22C55E',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
} 