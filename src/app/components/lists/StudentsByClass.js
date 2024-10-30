// StudentsByClass.js
import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';

const StudentsByClass = ({ selectedClass }) => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedClass) {
      setIsLoading(true);
      const studentsRef = ref(database, 'classes');
      onValue(studentsRef, (snapshot) => {
        const studentsData = snapshot.val();
        const filteredStudents = studentsData
          ? Object.entries(studentsData)
              .filter(([, data]) => data.class === selectedClass)
              .map(([id, data]) => ({ id, ...data }))
          : [];
        setStudents(filteredStudents);
        setIsLoading(false);
      });
    }
  }, [selectedClass]);

  if (isLoading) {
    return <p>Loading students...</p>;
  }

  return (
    <div className="p-4 bg-white border border-gray-200 mt-4">
      <h2 className="text-lg font-semibold mb-4">Students in {selectedClass}</h2>
      {students.length > 0 ? (
        <ul>
          {students.map((student) => (
            <li key={student.id} className="mb-2">
              {student.firstName} {student.lastName} - {student.email}
            </li>
          ))}
        </ul>
      ) : (
        <p>No students found for {selectedClass}.</p>
      )}
    </div>
  );
};

export default StudentsByClass;
