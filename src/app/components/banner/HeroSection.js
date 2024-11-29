import Image from "next/image";
import { useEffect, useState } from "react";

export default function HeroSectionWithWave() {
  const [scrollY, setScrollY] = useState(0);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative h-[600px] overflow-hidden">
      {/* Top Wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10">
        <svg
          className="relative block w-full h-[80px] transform scale-110"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="white"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
        </svg>
      </div>


      {/* Content - Adjusted position */}
      <div 
        className="absolute inset-0 flex items-start justify-center px-6 z-10"
        style={{
          transform: `translateY(${scrollY * 0.2}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <div className="text-center p-8 max-w-7xl border border-white/20">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white uppercase mb-8">About Us</h2>
          <p className=" text-gray-600 text-3xl font-thin leading-relaxed">
          Divaris Makaharis High School is one of Zimbabwes reputable high schools, offering comprehensive Zimsec and Cambridge Examinations. The school is a cradle of academic excellence whose exit profile catches up with the signs of times.
          </p>
          
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute -bottom-2 left-0 w-full overflow-hidden leading-none z-20">
        <svg
          className="relative block w-full h-[80px] transform scale-110"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="white"
            fillOpacity="1"
            d="M0,160L48,176C96,192,192,224,288,240C384,256,480,256,576,234.7C672,213,768,171,864,165.3C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
}
