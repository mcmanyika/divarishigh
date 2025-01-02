import { authOptions } from "../pages/api/auth/[...nextauth]";
import { getServerSession, Session } from "next-auth";
import { Inter } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { ThemeProvider } from './components/theme-provider';
import { NavigationMenu } from './components/navigation';
import SessionProvider from "./SessionProvider";
import './globals.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Divaris Makaharis School",
  description: 'Shaping the leaders of tomorrow through innovation and excellence',
};

export default async function RootLayout({ 
  children, 
}: {
  children: React.ReactNode
}) {
  const session = (await getServerSession(authOptions)) as Session | null; // Assert the type
  return (
    <html lang="en">
      <head>
      </head>
      <body className={inter.className}>
        <SessionProvider session={session}>
          {children}
          <Analytics />
        </SessionProvider>
      </body>
    </html>
  );
}

