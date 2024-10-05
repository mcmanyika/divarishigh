import React from 'react';
import Header2 from '../components/Header2';
import Footer from '../components/Footer';
import 'react-toastify/dist/ReactToastify.css';
import '../globals.css';

const Layout = ({ children, templateText, backgroundImage }) => {
  return (
    <>
        <Header2 />
      <div
        className="flex flex-col bg-cover bg-no-repeat bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="flex-grow flex items-center justify-center mt-32 bg-slate-50 bg-opacity-80 text-center text-3xl md:text-6xl py-20">
          {templateText ? templateText : ''} {/* Default text or passed prop */}
        </div>
        <main className="w-full flex-grow">
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
