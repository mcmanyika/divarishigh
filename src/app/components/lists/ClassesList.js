// ClassesList.js
import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';

const ClassesList = ({ onSelectClass }) => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const classesRef = ref(database, 'classes');
    onValue(classesRef, (snapshot) => {
      const classesData = snapshot.val();
      const uniqueClasses = classesData ? Array.from(new Set(Object.values(classesData).map(item => item.class))) : [];
      setClasses(uniqueClasses);
    });
  }, []);

  return (
    <div className="p-4 bg-white border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Classes</h2>
      {classes.length > 0 ? (
        <ul>
          {classes.map((className, index) => (
            <li
              key={index}
              onClick={() => onSelectClass(className)}
              className="cursor-pointer text-blue-500 hover:underline mb-2"
            >
              {className}
            </li>
          ))}
        </ul>
      ) : (
        <p>No classes found.</p>
      )}
    </div>
  );
};

export default ClassesList;
