'use client';
import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import { useSession } from 'next-auth/react';

const UploadedClassesList = () => {
  const { data: session } = useSession();
  const uploadedBy = session?.user?.email || ""; // Safeguard in case session is not loaded
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('className'); // Default sort by className
  const [sortOrder, setSortOrder] = useState('asc'); // Default sort order

  useEffect(() => {
    const classesRef = ref(database, "classes");

    // Fetch class data from Firebase
    onValue(classesRef, (snapshot) => {
      const classList = [];
      snapshot.forEach((childSnapshot) => {
        const classData = childSnapshot.val();
        // Check if the class was uploaded by the logged-in user
        if (classData.uploadedBy === uploadedBy) {
          classList.push({
            className: classData.className,
            teacherFirstName: classData.teacherFirstName,
            teacherLastName: classData.teacherLastName,
          });
        }
      });
      setClasses(classList);
    }, {
      onlyOnce: true, // Fetch only once
    });

    return () => {
      // Cleanup if needed
    };
  }, [uploadedBy]);

  // Filtered and sorted classes
  const filteredClasses = classes
    .filter((classData) =>
      classData.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classData.teacherFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classData.teacherLastName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const comparison = a[sortKey].localeCompare(b[sortKey]);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleHeaderClick = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  return (
    <div className="bg-white border shadow-sm rounded p-4 mt-0 m-4">
      <div className="text-2xl font-bold pb-4">Assigned Classes</div>
      
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="border border-gray-300 rounded px-2 py-1 mb-4"
      />

      {filteredClasses.length > 0 ? (
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th 
                className="border border-gray-300 px-4 py-2 cursor-pointer" 
                onClick={() => handleHeaderClick('className')}
              >
                Class Name {sortKey === 'className' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="border border-gray-300 px-4 py-2 cursor-pointer" 
                onClick={() => handleHeaderClick('teacherFirstName')}
              >
                Teacher First Name {sortKey === 'teacherFirstName' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="border border-gray-300 px-4 py-2 cursor-pointer" 
                onClick={() => handleHeaderClick('teacherLastName')}
              >
                Teacher Last Name {sortKey === 'teacherLastName' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredClasses.map((classData, index) => (
              <tr key={index} className="hover:bg-gray-100 capitalize">
                <td className="border border-gray-300 px-4 py-2">{classData.className}</td>
                <td className="border border-gray-300 px-4 py-2">{classData.teacherFirstName || 'N/A'}</td>
                <td className="border border-gray-300 px-4 py-2">{classData.teacherLastName || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No classes uploaded yet.</p>
      )}
    </div>
  );
};

export default UploadedClassesList;
