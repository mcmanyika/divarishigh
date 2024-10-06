import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database'; // Import Firebase database functions
import { database } from '../../../utils/firebaseConfig'; // Adjust path to your firebaseConfig

const Vision = () => {
  const [vision, setVision] = useState(''); // State for vision content
  const [mission, setMission] = useState(''); // State for mission content

  useEffect(() => {
    const fetchVisionAndMission = async () => {
      const visionRef = ref(database, 'account/vision'); // Reference to the 'account/vision' node
      const missionRef = ref(database, 'account/mission'); // Reference to the 'account/mission' node

      const visionSnapshot = await get(visionRef);
      const missionSnapshot = await get(missionRef);

      if (visionSnapshot.exists()) {
        setVision(visionSnapshot.val()); // Set the fetched vision content to state
      } else {
        console.log('No vision content found');
      }

      if (missionSnapshot.exists()) {
        setMission(missionSnapshot.val()); // Set the fetched mission content to state
      } else {
        console.log('No mission content found');
      }
    };

    fetchVisionAndMission(); // Fetch vision and mission on component mount
  }, []);

  return (
    <section id='vision'>
      <div className="relative parallax min-h-80 bg-top" style={{ backgroundImage: "url('https://firebasestorage.googleapis.com/v0/b/divaris-3e59f.appspot.com/o/images%2FDSC_5929.jpg?alt=media&token=b6c69906-8efa-4e81-a09b-386e4457a0c3')" }}>
        <div className="absolute inset-0 bg-main opacity-50"></div>
        <div className="relative max-w-7xl mx-auto z-10 flex flex-col md:flex-row items-center justify-between h-full text-white p-4">
          <div className="flex-1 text-center p-4">
            <h1 className="text-4xl md:text-5xl font-thin">Vision</h1>
            <p className="mt-4 text-xl max-w-3xl font-thin">
              {vision || ''}
            </p>
          </div>
          <div className="flex-1 text-center p-4">
            <h1 className="text-4xl md:text-5xl font-thin">Mission</h1>
            <p className="mt-4 text-xl max-w-3xl font-thin">
              {mission || ''}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Vision;
