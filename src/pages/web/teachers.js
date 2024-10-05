import React, { useState, useEffect } from 'react';
import { database } from '../../../utils/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import Layout from '../../app/components/Layout2';
import Image from 'next/image';

const Teacher = () => {
  const templateText = "Teachers"; // The correct templateText for this page
  const backgroundImage = ""; // Replace with the actual image path
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const admissionsRef = ref(database, 'userTypes');
    onValue(admissionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const teachersArray = Object.keys(data)
          .filter(key => {
            const teacher = data[key];
            return teacher.userType === 'teacher' && 
                   !(teacher.userID === 'TCHR-327373'); 
          }) 
          .map((key) => ({
            id: key,
            ...data[key],
          }));
        setTeachers(teachersArray);
      } else {
        setTeachers([]);
      }
    });
  }, []);

  return (
    <Layout templateText={templateText} backgroundImage={backgroundImage}>
      <div className=''>
        <div className='max-w-6xl mx-auto p-10'>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {teachers.map((teacher) => (
              <div key={teacher.id} className="p-4 ">
                {/* Display the teacher's profile image */}
                <Image
                  src={teacher.image || 'https://firebasestorage.googleapis.com/v0/b/divaris-3e59f.appspot.com/o/images%2Fteachers%2FDSC_6136.jpg?alt=media&token=bc7f0d37-c375-4fa6-adce-3c6a3e125cae'}  // Default image if no profileImage
                  alt={`${teacher.firstName} ${teacher.lastName}`} 
                  className="rounded-tr-full rounded-tl-full rounded-br-full mx-auto mb-4"
                  width={250}
                  height={150}
                />
                {/* Display teacher's name */}
                <h3 className="text-lg font-semibold capitalize text-center">{teacher.firstName} {teacher.lastName}</h3> 
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Teacher;
