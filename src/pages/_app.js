import { SessionProvider } from "next-auth/react";
import { CartProvider } from '../context/CartContext';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from 'next-themes';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ 
  Component, 
  pageProps: { session, ...pageProps } 
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <SessionProvider session={session}>
        <CartProvider>
          <Component {...pageProps} />
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </CartProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
