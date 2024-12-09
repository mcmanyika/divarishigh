"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { database } from '../../utils/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import HeroSection from "./components/banner/HeroSection";
import Wave from "./components/banner/Wave";
import Vision from "./components/banner/Vision";
import Headmaster from "./components/banner/Headmaster";
import Contact from "./components/banner/Contact";
import Footer from "./components/banner/Footer";

export default function Home() {
  const [images, setImages] = useState<string[]>([]);
  const [bannerImage, setBannerImage] = useState('');

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    const fetchImages = () => {
      const imagesRef = ref(database, 'images');
      onValue(imagesRef, (snapshot) => {
        const imageList: string[] = [];
        snapshot.forEach((childSnapshot) => {
          const image = childSnapshot.val();
          if (image && image.title === 'gallery' && image.url) {
            imageList.push(image.url);
          }
        });

        const shuffledImages = shuffleArray([...imageList]);
        setImages(shuffledImages);

        if (imageList.length > 0) {
          const randomIndex = Math.floor(Math.random() * imageList.length);
          setBannerImage(imageList[randomIndex]);
        }
      });
    };

    fetchImages();
  }, []);

  // Add a loading state
  if (images.length === 0) {
    return <div>Loading gallery images...</div>;
  }

  if (!bannerImage || images.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/90 dark:from-slate-650 dark:to-slate-600">

      {/* Hero Banner */}
      <section className="relative h-[80vh] overflow-hidden">
        {/* Background Image */}
        {bannerImage && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={bannerImage}
              alt="School Banner"
              fill
              className="object-cover object-top"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-black/10 backdrop-blur-[1px]" />
          </motion.div>
        )}

        {/* Creative Bars - Left Side */}
        <div className="absolute left-0 top-0 h-full w-32 flex flex-col justify-between py-20 z-10">
          {[
            { color: 'from-yellow-400 to-yellow-200', width: 'w-full' },
            { color: 'from-blue-400 to-blue-200', width: 'w-2/3' },
            { color: 'from-green-400 to-green-200', width: 'w-1/2' }
          ].map((bar, index) => (
            <motion.div
              key={index}
              initial={{ x: -200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ 
                duration: 1.2,
                ease: "easeOut",
                delay: index * 0.2
              }}
              className={`${bar.width} h-[3px] bg-gradient-to-r ${bar.color} opacity-80`}
            />
          ))}
        </div>

        {/* Right Side Accent */}
        <div className="absolute right-0 top-0 h-full w-24 flex flex-col items-end justify-center z-10">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "40vh" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-[2px] bg-gradient-to-b from-white/0 via-white/40 to-white/0"
          />
        </div>

        {/* Top Accent */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-0 left-0 h-[1px] bg-gradient-to-r from-white/0 via-white/20 to-white/0 z-10"
        />

        {/* Bottom Design Elements */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex justify-between items-end h-32"
          >
            <div className="w-1/3 h-full bg-gradient-to-t from-red-500/20 to-transparent" />
            <div className="w-1/4 h-2/3 bg-gradient-to-t from-blue-500/20 to-transparent" />
            <div className="w-1/5 h-1/2 bg-gradient-to-t from-green-500/20 to-transparent" />
          </motion.div>
        </div>

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute top-8 left-8 z-20"
          >
            <Image
              src="/images/logo.png"
              alt="Divaris Makaharis School Logo"
              width={60}
              height={80}
              className="rounded-full sm:w-[80px] sm:h-[100px] w-[60px] h-[80px]"
            />
          </motion.div>

          {/* Hero Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 1.2,
                ease: "easeOut",
                delay: 0.8
              }}
              className="text-center space-y-6 px-4 backdrop-blur-sm bg-black/10 py-8 rounded-2xl"
            >
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white">
                Divaris Makaharis School
              </h1>
              <p className="text-lg sm:text-2xl text-white/90 max-w-xl sm:max-w-3xl font-light">
                Nurturing Excellence, Inspiring Future Leaders
              </p>
            </motion.div>
          </div>
        </div>

        {/* Bottom Gradient */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"
        />
      </section>

      {/* Featured Programs */}
      <Vision />

      <HeroSection />
      
      {/* Gallery Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 px-0 sm:px-6 lg:px-0 bg-gray-50 dark:bg-slate-900/50"
        
      >
        <section id="gallery">
        <div className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white uppercase">School Life</h2>
            <p className="mt-4 text-xl font-thin text-gray-600 dark:text-gray-300">Experience our vibrant community</p>
          </motion.div>

          {/* Scrollable Container */}
          <div className="relative">
            {/* Scroll Indicators */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 to-transparent dark:from-slate-900/50 z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent dark:from-slate-900/50 z-10" />

            {/* Scrollable Gallery */}
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-1 min-w-max px-4">
                {images.slice(0, 12).map((imageUrl, index) => (
                  <motion.div
                    key={imageUrl}
                    initial={{ opacity: 0, y: 100, scale: 0.8 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{
                      duration: 1,
                      delay: 0.15 * index,
                      ease: "easeOut",
                      type: "spring",
                      stiffness: 100,
                      damping: 15
                    }}
                    whileHover={{
                      scale: 1.05,
                      y: -15,
                      transition: { duration: 0.4 }
                    }}
                    className="relative aspect-[4/3] w-[431px] flex-shrink-0 overflow-hidden  shadow-lg"
                  >
                    <Image
                      src={imageUrl}
                      alt={`School gallery image ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <motion.h3
                          initial={{ y: 20, opacity: 0 }}
                          whileHover={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="text-white text-lg font-semibold"
                        >
                          School Life
                        </motion.h3>
                        <motion.p
                          initial={{ y: 20, opacity: 0 }}
                          whileHover={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          className="text-white/90 text-sm"
                        >
                          Discover our facilities
                        </motion.p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      </motion.section>
      <Wave />
      {/* Headmaster Section */}
      <Headmaster />
      
      {/* Contact Section */}
      <Contact />

      {/* Footer Section */}
      <Footer />

    </main>
  );
}

