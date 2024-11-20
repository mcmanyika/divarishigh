"use client";

import { Card } from "./components/ui/card";
import { CircleProgress } from "./components/ui/circle-progress";
import { Counter } from "./components/stats/counter";
import { Gallery } from "./components/gallery";
import { ContactForm } from "./components/contact-form";
import { motion } from "framer-motion";
import { ArrowUpRight, Users, GraduationCap, Calendar, MapPin, Phone, Mail } from "lucide-react";
import { Separator } from "./components/ui/separator";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { database } from '../../utils/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import Map from '../app/components/Map';

export default function Home() {
  const [images, setImages] = useState<string[]>([]);

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
        setImages(imageList);
      });
    };

    fetchImages();
  }, []);

  // Add a loading state
  if (images.length === 0) {
    return <div>Loading gallery images...</div>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/90 dark:from-slate-650 dark:to-slate-600">
      {/* Hero Banner */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://firebasestorage.googleapis.com/v0/b/divaris-3e59f.appspot.com/o/images%2FDSC_6074.jpg?alt=media&token=274e6ddf-f997-4fe6-812f-3e9e13472b33')] bg-cover bg-center">
          <div className="absolute inset-0 bg-blue-900/9 backdrop-blur-[0.27px]" />
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl sm:text-7xl font-bold text-yellow-600 mb-6">
              Divaris Makaharis
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600"> School</span>
            </h1>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
      </section>


      {/* Featured Programs */}
      <AnimatedSection className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-50/30 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 dark:text-white">Featured Programs</h2>
            
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProgramCard
              title="Artificial Intelligence"
              description="Learn the fundamentals of AI and machine learning through hands-on projects."
              delay={0.2}
            />
            <ProgramCard
              title="Robotics Engineering"
              description="Design, build, and program robots in our state-of-the-art lab."
              delay={0.4}
            />
            <ProgramCard
              title="Digital Arts & Design"
              description="Combine creativity with technology in our digital media studio."
              delay={0.6}
            />
          </div>
        </div>
      </AnimatedSection>


      {/* Stats Section */}
      <AnimatedSection className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatsCard
              icon={<Users className="h-6 w-6" />}
              title="Current Students"
              value={1250}
              description="Bright minds shaping the future"
              delay={0.2}
              circleColor="stroke-blue-500"
              className="border border-white dark:border-slate-700 rounded-lg"
            />

            <StatsCard
              icon={<GraduationCap className="h-6 w-6" />}
              title="Total Graduates"
              value={15420}
              description="Alumni success stories"
              delay={0.4}
              circleColor="stroke-blue-600"
              className="border border-white dark:border-slate-700 rounded-lg"
            />

            <StatsCard
              icon={<Calendar className="h-6 w-6" />}
              title="Years of Excellence"
              value={25}
              description="Established in 1999"
              delay={0.6}
              circleColor="stroke-blue-700"
              className="border border-white dark:border-slate-700 rounded-lg"
            />
          </div>
        </div>
      </AnimatedSection>

      {/* Gallery Section */}
      <AnimatedSection className="py-1 px-4 sm:px-6 lg:px-0">
        <div className="w-full">
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1"
          >
            {images.slice(0, 6).map((imageUrl, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.2 + index * 0.1,
                }}
                whileHover={{ scale: 1.02 }}
                className="relative aspect-[4/3] overflow-hidden" 
              >
                <Image
                  src={imageUrl}
                  alt={`School gallery image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white text-lg font-semibold">School Life</h3>
                    <p className="text-white/90 text-sm">Discover our facilities</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Contact Section */}
      <AnimatedSection className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-50/30 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <Card className="p-6 hover:shadow-lg transition-shadow border-blue-100/20 dark:bg-slate-800 dark:border-slate-700">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <h3 className="font-medium dark:text-white">Address</h3>
                      <p className="text-sm text-muted-foreground dark:text-gray-300">Corner Lavenham Drive & Northolt Road, Bluffhill, Harare, Zimbabwe</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <h3 className="font-medium dark:text-white">Phone</h3>
                      <p className="text-sm text-muted-foreground dark:text-gray-300">+263 78 9916 294</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <h3 className="font-medium dark:text-white">Email</h3>
                      <p className="text-sm text-muted-foreground dark:text-gray-300">divarismakaharis@gmail.com</p>
                    </div>
                  </div>
                </div>
              </Card>
              
              <div className="h-[400px] rounded-lg overflow-hidden">
                <Map />
              </div>
            </div>
            
            <Card className="p-6 hover:shadow-lg transition-shadow border-blue-100/20 dark:bg-slate-800 dark:border-slate-700">
              <ContactForm />
            </Card>
          </div>
        </div>
      </AnimatedSection>

      {/* Footer Section */}
      <AnimatedSection className="bg-blue-900 dark:bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start w-full gap-8 md:gap-0">
            {/* Quick Links */}
            <div className="w-full md:w-auto">
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {['Programs', 'Admissions', 'School Life', 'News & Events'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-blue-100 hover:text-white transition-colors text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="w-full md:w-auto">
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                {[
                  { name: 'Student Portal', href: '/admin/login' },
                  { name: 'Parent Portal', href: '/admin/login' },
                ].map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-blue-100 hover:text-white transition-colors text-sm">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div className="w-full md:w-auto">
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-blue-100">
                    divarismakaharis@gmail.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-blue-100">
                    +263 78 9916 294
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-blue-100">
                    Corner Lavenham Drive & Northolt Road, Bluffhill, Harare, Zimbabwe

                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-24 pt-8 border-t border-blue-800 dark:border-slate-800">
            <div className="flex justify-center items-center">
              <p className="text-sm p-4 text-blue-100 dark:text-white">
                © {new Date().getFullYear()} Divaris Makaharis School. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </main>
  );
}

function StatsCard({ icon, title, value, description, delay, circleColor, className = "" }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const getPercentage = () => {
    if (title === "Current Students") return Math.min((value / 2000) * 100, 100);
    if (title === "Total Graduates") return Math.min((value / 20000) * 100, 100);
    if (title === "Years of Excellence") return Math.min((value / 25) * 100, 100);
    return 0;
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      <Card className="p-6 hover:shadow-lg transition-shadow bg-transparent border-none">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">{icon}</div>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex flex-col items-center">
          {isInView && (
            <>
              <div className="relative h-64 w-64 mb-6">
                <CircleProgress 
                  targetValue={getPercentage()} 
                  color={circleColor} 
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Counter from={0} to={value} duration={2} className="text-5xl font-bold" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-sm font-medium text-muted-foreground mt-2">{title}</h3>
                <p className="text-sm text-muted-foreground/80 mt-1">{description}</p>
              </div>
            </>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

function ProgramCard({ title, description, delay }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group border-blue-100/20 dark:bg-slate-800 dark:border-slate-700">
        <h3 className="text-xl font-semibold group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <p className="mt-2 text-muted-foreground dark:text-gray-300">{description}</p>
        <div className="mt-4 flex items-center text-sm text-blue-600 dark:text-blue-400">
          Learn more
          <ArrowUpRight className="h-4 w-4 ml-1" />
        </div>
      </Card>
    </motion.div>
  );
}

function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}