import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useGlobalState, setIsOverlayVisible } from '../store'; // Adjust the path to your global state management file
import { XIcon } from '@heroicons/react/outline';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../../../utils/firebaseConfig';
import Image from 'next/image';

const Hero = () => {
  const [isOverlayVisible] = useGlobalState('isOverlayVisible');
  const [titles, setTitles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselData = [
    {
      title: "",
      description: "",
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/divaris-3e59f.appspot.com/o/images%2FDSC_6074.jpg?alt=media&token=274e6ddf-f997-4fe6-812f-3e9e13472b33",
    },
    {
      title: "",
      description: "",
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/divaris-3e59f.appspot.com/o/images%2FDSC_5865.jpg?alt=media&token=70f5041a-7e6d-4572-a845-4fc8b6bb2c4a",
    },
    {
      title: "",
      description: "",
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/divaris-3e59f.appspot.com/o/images%2FDSC_6007.jpg?alt=media&token=5ae04479-67ff-4d52-849a-1a27491fe2c7",
    }
  ];

  // Function to handle menu click and toggle overlay visibility
  const handleMenuClick = () => {
    setIsOverlayVisible(!isOverlayVisible);
  };

  // Fetch data from Firebase on component mount
  useEffect(() => {
    const fetchData = () => {
      try {
        const titleRef = ref(database, 'title');
        const statusQuery = query(titleRef, orderByChild('status'), equalTo('Active'));

        onValue(statusQuery, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const titlesArray = Object.keys(data)
              .map((key) => ({
                id: key,
                title: data[key].title,
                link: data[key].link,
                status: data[key].status,
                category: data[key].category,
              }))
              .filter(a => a.category === 'title')
              .sort((a, b) => {
                if (a.title === 'Admissions') return 1;
                if (b.title === 'Admissions') return -1;
                if (a.title === 'Alumni') return 1;
                if (b.title === 'Alumni') return -1;
                return a.title.localeCompare(b.title);
              });
            setTitles(titlesArray);
          } else {
            setTitles([]);
          }
        });
      } catch (error) {
        console.error('Firebase Error:', error);
      }
    };

    fetchData();
  }, []); // Run once on component mount

  // Carousel logic to change slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselData.length]);

  const currentSlide = carouselData[currentIndex];

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 flex transition-transform duration-1000 ease-in-out" style={{ transform: `translateX(${currentIndex * -100}%)` }}>
        {carouselData.map((slide, index) => (
          <div key={index} className="min-w-full h-full bg-cover bg-center md:bg-bottom" style={{ backgroundImage: `url(${slide.imageUrl})` }}></div>
        ))}
      </div>
      <div className="absolute inset-0 bg-main opacity-20"></div>
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
        <Link href="/">
          <Image
            src="/images/logo.png" // Replace with your logo path
            alt="Logo"
            width={100}
            height={100}
            className="rounded w-12 h-12 md:w-24 md:h-24"
            onClick={handleMenuClick}
          />
        </Link>
      </div>
      {isOverlayVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="absolute top-4 right-4 text-white">
            <button onClick={handleMenuClick}>
              <XIcon className="h-8 w-8" />
            </button>
          </div>
          <div className="max-w-md mx-auto text-center">
            {titles.map((rw) => (
              <div key={rw.id}>
                <Link href={`${rw.link}`}>
                  <div className="text-gray-300 hover:text-white text-2xl md:text-3xl lg:text-4xl uppercase p-3">{rw.title}</div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
      <section className="relative  text-white p-6 md:p-10 text-center">
        <div className='max-w-2xl mx-auto'>
          <h1 className="sm-title   md:lg-title">{currentSlide.title}</h1>
          <p className="mt-2 text-sm md:text-lg font-sans">{currentSlide.description}</p>
        </div>
      </section>
    </div>
  );
};

export default Hero;
