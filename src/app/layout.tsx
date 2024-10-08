import { authOptions } from "../pages/api/auth/[...nextauth]";
import { getServerSession, Session } from "next-auth";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "./SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DIVARIS MAKAHARIS HIGH",
};

export default async function RootLayout({ 
  children, 
}: {
  children: React.ReactNode
}) {
  let session: Session | null = null;
  try {
    session = await getServerSession(authOptions) as Session | null;
  } catch (error) {
    console.error("Error fetching session:", error);
    // Handle error accordingly, e.g., show a notification or redirect
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
