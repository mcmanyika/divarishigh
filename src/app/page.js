'use client';

import { useSession } from 'next-auth/react';
import Layout from "./components/Layout";
import Hero from "./components/Hero";
import NewStudents from '../app/components/NewStudents';
import About from '../app/components/About';
import Socials from '../app/components/Socials';
import ContactUs from '../app/components/ContactUs';
import Map from '../app/components/Map';
import Values from '../app/components/Values';
import Vision from '../app/components/Vision';
import Curriculum from '../app/components/Curriculum';
import ManagementTeam from '../app/components/ManagementTeam';
import ImageGallery from '../app/components/ImageGallery';

export default function Home() {
  const { data: session } = useSession();

  return (
    <Layout session={session}>
      <Hero />
      <About />
      <Socials />
      <Values />
      <Vision />
      <Curriculum />
      <ImageGallery />
      <Map />
      <ContactUs />
    </Layout>
  );
}
