import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { Toaster } from 'react-hot-toast';

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CAPS Learn - Chartered Accountancy Learning Platform',
  description: 'A comprehensive learning platform for chartered accountancy students by C.A.C.S. Academy of Professional Students in India',
  authors: [{ name: 'CAPS Learn Team' }],
  keywords: 'CA, Chartered Accountancy, CA Foundation, CA Intermediate, CA Final, mock tests, study materials, learning analytics, CAPS Learn',
  openGraph: {
    title: 'CAPS Learn - Chartered Accountancy Learning Platform',
    description: 'A comprehensive learning platform for chartered accountancy students by C.A.C.S. Academy of Professional Students in India',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'CAPS Learn - Chartered Accountancy Learning Platform',
    description: 'A comprehensive learning platform for chartered accountancy students by C.A.C.S. Academy of Professional Students in India',
  },
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
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