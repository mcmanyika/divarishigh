"use client";

import { Card } from "./components/ui/card";
import { CircleProgress } from "./components/ui/circle-progress";
import { Counter } from "./components/stats/counter";
import { Gallery } from "./components/gallery";
import { ContactForm } from "./components/contact-form";
import { motion } from "framer-motion";
import { ArrowUpRight, Users, GraduationCap, Calendar, MapPin, Phone, Mail, Calculator, Palette, Beaker, Cpu } from "lucide-react";
import { Separator } from "./components/ui/separator";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { database } from '../../utils/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import Map from '../app/components/Map';
import { NavigationMenu } from "./components/navigation";
import HeroSection from "./components/banner/HeroSection";
import Wave from "./components/banner/Wave";
import WaveTop from "./components/banner/WaveTop";
import Headmaster from "./components/banner/Headmaster";
import LatestNews from "./components/banner/LatestNews";
import { Modal } from "./components/banner/Modal";
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
              className="object-cover"
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
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50/30 to-white/80 dark:from-slate-900/50 dark:to-slate-800/30"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProgramCard
              title="Our Vision"
              description="We strive to be a center of educational excellence, recognized nationally and internationally. Our comprehensive approach encompasses academic achievement, athletic excellence, and rich cultural development, preparing students for global leadership."
              delay={0.2}
              icon={<Users className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />}
            />
            <ProgramCard
              title="Our Mission"
              description="We cultivate well-rounded individuals through holistic education that balances academic excellence with character development. Our innovative learning environment nurtures critical thinking, creativity, and adaptability, ensuring our students are prepared for future challenges."
              delay={0.4}
              icon={<GraduationCap className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />}
            />
          </div>
        </div>
      </motion.section>


      <HeroSection />
      {/* <LatestNews /> */}
      
      {/* Gallery Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 px-0 sm:px-6 lg:px-0 bg-gray-50 dark:bg-slate-900/50"
      >
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
      </motion.section>
      <Wave />
      <Headmaster />
      
      {/* Contact Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="pb-20 pt-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50/30 to-white/80 dark:from-slate-900/50 dark:to-slate-800/30"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white uppercase">
              Get in Touch
            </h2>
            <p className="mt-4 text-xl font-thin text-gray-600 dark:text-gray-300">
              We are here to help and answer any questions you might have
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              {[
                { icon: <MapPin />, title: "Visit Us", content: "Corner Lavenham Drive & Northolt Road, Bluffhill, Harare" },
                { icon: <Phone />, title: "Call Us", content: "+263 77 275 1531" },
                { icon: <Mail />, title: "Email Us", content: "divarismakaharis@gmail.com" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.2,
                    ease: "easeOut"
                  }}
                  whileHover={{
                    x: 15,
                    transition: { duration: 0.3 }
                  }}
                >
                  <Card className="p-8 hover:shadow-xl transition-all duration-300 border-blue-100/20 dark:bg-slate-800/50 dark:border-slate-700 backdrop-blur-sm">
                    <div className="space-y-8">
                      <div className="flex items-start space-x-4 group">
                        <div className="p-3 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                          {item.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg dark:text-white mb-1">{item.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.content}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
                    
            {/* Map */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="h-[430px] rounded-2xl overflow-hidden shadow-lg border border-blue-100/20 dark:border-slate-700"
            >
              <Map />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Footer Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-blue-900 dark:bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start w-full gap-8 md:gap-0">
            {/* School Logo */}
            <div className="w-full md:w-auto">
              <Image src="/images/logo.png" alt="Divaris Makaharis School" width={80} height={80} className="rounded-full" />
            </div>
            {/* Quick Links */}
            <div className="w-full md:w-auto">
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {['Programs', 'School Life', 'News & Events'].map((item) => (
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
                  { name: 'Staff ', href: '/admin/login' },
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
                    +263 77 275 1531
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
                © {new Date().getFullYear()} Divaris Makaharis School. Developed by <a href="https://learner-gamma.vercel.app/" className="hover:text-blue-400">SMART LEARNER</a>.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg
          className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="e813992c-7d03-4cc4-a2bd-151760b470a0"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" strokeWidth={0} fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" />
        </svg>
      </div>
    </main>
  );
}

function StatsCard({ icon, title, value, delay, circleColor, className = "" }: any) {
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
                <h3 className="text-xl font-thin uppercase text-muted-foreground mt-2">{title}</h3>
              </div>
            </>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

function ProgramCard({ title, description, delay, icon }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalContent = {
    Vision: {
      title: "Our Vision",
      content: (
        <div className="space-y-6">
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            We strive to be a center of educational excellence, recognized nationally and internationally.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700">
              <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Academic Excellence</h3>
              <p className="text-gray-600 dark:text-gray-300">Fostering intellectual growth through innovative education</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-slate-800 dark:to-slate-700">
              <h3 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">Global Leadership</h3>
              <p className="text-gray-600 dark:text-gray-300">Preparing students for worldwide opportunities</p>
            </div>
          </div>
        </div>
      ),
    },
    Mission: {
      title: "Our Mission",
      content: (
        <div className="space-y-6">
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            We cultivate well-rounded individuals through holistic education.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-800 dark:to-slate-700">
              <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">Character Development</h3>
              <p className="text-gray-600 dark:text-gray-300">Building strong moral and ethical foundations</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-slate-800 dark:to-slate-700">
              <h3 className="font-semibold text-orange-700 dark:text-orange-400 mb-2">Innovation</h3>
              <p className="text-gray-600 dark:text-gray-300">Nurturing creativity and adaptability</p>
            </div>
          </div>
        </div>
      ),
    },
  };

  return (
    <>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ 
          duration: 1,
          ease: "easeOut",
          delay: delay
        }}
        whileHover={{ 
          scale: 1.03,
          transition: { duration: 0.3 }
        }}
        onClick={() => setIsModalOpen(true)}
      >
        <Card className="relative overflow-hidden p-8 text-xl font-thin leading-relaxed hover:shadow-xl transition-all duration-300 cursor-pointer group border-none bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-700/50 backdrop-blur-sm">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full transform translate-x-16 -translate-y-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-500/10 to-yellow-500/10 rounded-full transform -translate-x-12 translate-y-12" />
          
          {/* Content */}
          <div className="relative z-10">
            <h3 className="text-2xl text-center uppercase font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-6">
              {title}
            </h3>
            <p className="mt-4 text-gray-600 dark:text-gray-300 line-clamp-3">{description}</p>
            
            {/* Read More Button */}
            <div className="mt-6 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium hover:shadow-lg transition-shadow"
              >
                Learn More
              </motion.button>
            </div>
          </div>
        </Card>
      </motion.div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalContent[title.split(" ")[1]]?.title}
      >
        {modalContent[title.split(" ")[1]]?.content}
      </Modal>
    </>
  );
}

function ScrollReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}