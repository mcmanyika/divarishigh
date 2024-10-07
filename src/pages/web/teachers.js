import React, { useState, useEffect } from 'react';
import { database } from '../../../utils/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import Layout from '../../app/components/Layout2';
import Image from 'next/image';

const Teacher = () => {
  const templateText = "Teachers"; // The correct templateText for this page
  const backgroundImage = ""; // Replace with the actual image path
  const [teachers, setTeachers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Adjust this number as needed

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

  // Calculate the current teachers to display
  const indexOfLastTeacher = currentPage * itemsPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - itemsPerPage;
  const currentTeachers = teachers.slice(indexOfFirstTeacher, indexOfLastTeacher);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(teachers.length / itemsPerPage);

  return (
    <Layout templateText={templateText} backgroundImage={backgroundImage}>
      <div className=''>
        <div className='max-w-6xl mx-auto p-10'>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {currentTeachers.map((teacher) => (
              <div key={teacher.id} className="p-4 ">
                {/* Display the teacher's profile image */}
                <Image
                  src={teacher.image || 'https://firebasestorage.googleapis.com/v0/b/divaris-3e59f.appspot.com/o/images%2FScreen%20Shot%202024-10-07%20at%207.33.37%20AM.png?alt=media&token=6bfce0ff-85a0-40e6-845c-18b7df25c826'}  // Default image if no profileImage
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
          {/* Pagination Controls */}
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`mx-1 px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Teacher;
