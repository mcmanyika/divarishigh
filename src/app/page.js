
'use client';
import Layout from "./components/Layout";
import Hero from "./components/Hero";
import Features from "./components/Features";
import NewStudents from '../app/components/NewStudents';
import About from '../app/components/About';
import Socials from '../app/components/Socials';
import ContactUs from '../app/components/ContactUs';
import Map from '../app/components/Map';

export default function Home() {
  return (
    <Layout>
      <Hero />
      <About />
      <Socials />
      {/* <Features /> */}
      
      <NewStudents />
      <Map />
      <ContactUs />
    </Layout>
  );
}
