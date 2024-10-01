'use client';
import React, { useState, useEffect } from 'react';
import { ref, onValue, push } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import { FaSpinner } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TeacherList = () => {
  const { data: session, status } = useSession();
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [className, setClassName] = useState('');
  const [teacherDetails, setTeacherDetails] = useState({ firstName: '', lastName: '' });

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchTeachers = async () => {
        try {
          const teachersRef = ref(database, 'userTypes');

          onValue(teachersRef, (snapshot) => {
            const teachersData = snapshot.val();
            if (teachersData) {
              const teachersArray = Object.keys(teachersData).map((key) => ({
                id: key,
                ...teachersData[key],
              }));
              // Filter to get only teachers
              const filteredTeachers = teachersArray.filter((teacher) => teacher.userType === 'teacher');
              setTeachers(filteredTeachers);
            } else {
              console.log('No teachers data found.');
            }
          });
        } catch (error) {
          console.error('Error fetching teachers:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchTeachers();
    } else {
      setIsLoading(false);
    }
  }, [session, status]);

  const handleClassSubmit = async (e) => {
    e.preventDefault();

    if (!className) {
      toast.error("Please select a class name.");
      return;
    }

    const uploadedBy = session?.user?.email || ""; // Get the logged-in user's email
    const classData = {
      className,
      uploadedBy,
      teacherFirstName: teacherDetails.firstName,
      teacherLastName: teacherDetails.lastName,
    };

    try {
      await push(ref(database, 'classes'), classData);
      toast.success("Class name uploaded successfully!");
      // Clear the form after submission
      setClassName('');
      setSelectedTeacher('');
      setTeacherDetails({ firstName: '', lastName: '' });
    } catch (error) {
      console.error("Error uploading class name: ", error);
      toast.error("Failed to upload class name. Please try again.");
    }
  };

  const handleTeacherSelect = (teacher) => {
    setSelectedTeacher(teacher.id);
    setTeacherDetails({ firstName: teacher.firstName, lastName: teacher.lastName });
  };

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200 bg-opacity-75 z-50">
        <FaSpinner className="animate-spin text-4xl text-gray-500" />
      </div>
    );
  }

  if (teachers.length === 0) {
    return <div className="text-center mt-4">No teachers found.</div>;
  }

  return (
    <div className="w-full text-sm p-4 bg-white">
      <h2 className="text-xl font-semibold mb-4">Select a Teacher</h2>
      <select
        value={selectedTeacher}
        onChange={(e) => handleTeacherSelect(teachers.find(teacher => teacher.id === e.target.value))}
        className="p-2 border border-gray-300 rounded w-full mb-4"
      >
        <option value="" disabled>Select a teacher...</option>
        {teachers.map((teacher) => (
          <option key={teacher.id} value={teacher.id}>
            {`${teacher.firstName || 'N/A'} ${teacher.lastName || 'N/A'}`}
          </option>
        ))}
      </select>

      <div className="bg-white border shadow-sm rounded p-4 ml-0 m-2">
        <div className="text-2xl font-bold pb-4">Upload Class Name</div>
        <form onSubmit={handleClassSubmit} className="space-y-4">
          <div className="mt-2 grid grid-cols-3 gap-4">
            {["1A", "2A", "3A", "4A", "5A", "6A"].map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="radio"
                  value={option}
                  checked={className === option}
                  onChange={(e) => setClassName(e.target.value)}
                  className="mr-2"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
          >
            Upload Class Name
          </button>
        </form>
        
      </div>
    </div>
  );
};

export default TeacherList;
