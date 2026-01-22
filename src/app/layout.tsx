import { type Metadata } from 'next';
import '@/styles/globalReset.css'
import '@/styles/global.css';
import { inter } from '@/lib/fonts';

export const metadata: Metadata = {
  title: 'Turbopack tracing',
  description: 'Proving Turbopack tracing',
  icons: {
    icon: '/assets/favicon.png'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
