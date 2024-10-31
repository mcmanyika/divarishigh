import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { database } from '../../../utils/firebaseConfig'; // Import your Firebase config
import { ref, onValue } from 'firebase/database';

const ImageGallery = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = () => {
      const imagesRef = ref(database, 'images');
      onValue(imagesRef, (snapshot) => {
        const imageList = [];
        snapshot.forEach((childSnapshot) => {
          const image = childSnapshot.val();
          // Filter images for those with `title` set to "gallery"
          if (image.title === 'gallery') {
            imageList.push(image.url); // Push the URL into the array
          }
        });
        setImages(imageList);
      });
    };

    fetchImages();
  }, []);

  if (images.length === 0) return <p>Loading gallery images...</p>;

  return (
    <section id="gallery" className="w-full mx-auto p-0">
      <div className="flex flex-col md:flex-row gap-1">
        {/* First Column: Main Image */}
        <div className="flex-1 relative w-full h-[24rem] md:h-[40.2rem] overflow-hidden">
          <div className="w-full h-full transform transition-transform duration-500 hover:scale-105">
            <Image
              src={images[4]} // Main image
              alt="Main Gallery Image"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>

        {/* Second Column: Four Equal Images */}
        <div className="flex-1 grid grid-cols-2 gap-1">
          {images.slice(0, 4).map((url, index) => (
            <div key={index} className="relative w-full h-[12rem] md:h-[20rem] overflow-hidden">
              <div className="w-full h-full transform transition-transform duration-500 hover:scale-105">
                <Image
                  src={url}
                  alt={`Gallery Image ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageGallery;
