import React from 'react';
import Image from 'next/image';

const ImageGallery = () => {
  return (
    <section id='gallery' className="w-full mx-auto p-0">
      <div className="flex flex-col md:flex-row gap-1">
        {/* First Column: Single Image with double height */}
        <div className="flex-1 relative w-full h-[24rem] md:h-[40.2rem] overflow-hidden"> {/* Adjust height for mobile */}
          <div className="w-full h-full transform transition-transform duration-500 hover:scale-105">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/divaris-3e59f.appspot.com/o/images%2FDSC_6096.jpg?alt=media&token=e4896586-f7b7-4d85-a92e-59f80b347487"
              alt="Main Image"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>

        {/* Second Column: Four Equal Images */}
        <div className="flex-1 grid grid-cols-2 gap-1">
          <div className="relative w-full h-[12rem] md:h-[20rem] overflow-hidden"> {/* Adjust height for mobile */}
            <div className="w-full h-full transform transition-transform duration-500 hover:scale-105">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/divaris-3e59f.appspot.com/o/images%2FDSC_6057.jpg?alt=media&token=7e0c21b3-2ef1-4421-b2fd-0ecec9133474"
                alt="Sub Image 1"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
          <div className="relative w-full h-[12rem] md:h-[20rem] overflow-hidden">
            <div className="w-full h-full transform transition-transform duration-500 hover:scale-105">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/divaris-3e59f.appspot.com/o/images%2FDSC_5961.jpg?alt=media&token=04f1cf7c-6c8c-40da-b996-24df55e056b4"
                alt="Sub Image 2"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
          <div className="relative w-full h-[12rem] md:h-[20rem] overflow-hidden">
            <div className="w-full h-full transform transition-transform duration-500 hover:scale-105">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/divaris-3e59f.appspot.com/o/images%2FDSC_5976.jpg?alt=media&token=43c7dd26-0fc4-4c1b-b6f5-b1e58d4bfed1"
                alt="Sub Image 4"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
          <div className="relative w-full h-[12rem] md:h-[20rem] overflow-hidden">
            <div className="w-full h-full transform transition-transform duration-500 hover:scale-105">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/divaris-3e59f.appspot.com/o/images%2FDSC_6070.jpg?alt=media&token=57216548-6eef-4b47-95ab-888ccdc92800"
                alt="Sub Image 3"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageGallery;
