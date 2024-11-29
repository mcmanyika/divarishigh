import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Headmaster() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Create different transform values for each bar
  const topLeftY = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const bottomRightY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const centerY = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const centerRotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 overflow-hidden"
    >
      {/* Slanted Bars with Parallax */}
      {/* Top Left Slanted Bar */}
      <motion.div 
        style={{ y: topLeftY }}
        className="absolute top-0 left-0 w-[200px] h-[400px] bg-yellow-500 transform -rotate-45 -translate-x-10 -translate-y-10 opacity-50 z-10"
      />
      
      {/* Bottom Right Slanted Bar */}
      <motion.div 
        style={{ y: bottomRightY }}
        className="absolute bottom-0 right-0 w-[300px] h-[500px] bg-blue-500 transform rotate-45 translate-x-10 translate-y-10 opacity-50 z-10"
      />
      
      {/* Center Crossed Bar */}
      <motion.div 
        style={{ 
          y: centerY,
          rotate: centerRotate
        }}
        className="absolute top-1/2 left-1/2 w-[200px] h-[500px] bg-red-500 transform -translate-x-1/2 -translate-y-1/2 opacity-40 z-10"
      />

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Video Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl"
          >
            <iframe
              src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
              title="Headmaster's Welcome Message"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-2xl"
            />
          </motion.div>

          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6 backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 p-8 rounded-2xl"
          >
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                Headmaster Welcome
              </h2>
            </div>
            
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p className="text-lg leading-relaxed">
                Welcome to Divaris Makaharis School, where we believe in nurturing not just academic excellence, 
                but the complete development of every student. Our commitment to providing a comprehensive education 
                is reflected in our innovative curriculum and dedicated teaching staff.
              </p>
              
              <p className="text-lg leading-relaxed">
                We strive to create an environment where students can discover their passions, develop critical 
                thinking skills, and grow into responsible global citizens. Our focus on both traditional academic 
                subjects and modern technological skills ensures that our students are well-prepared for the 
                challenges of tomorrow.
              </p>

              <p className="text-lg leading-relaxed">
                At Divaris Makaharis, we understand that each student is unique, with their own talents and 
                aspirations. Our role is to guide them on their educational journey, providing the support and 
                resources they need to reach their full potential.
              </p>
            </div>

            <div className="pt-6">
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Mr. Matemayi</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Headmaster</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
