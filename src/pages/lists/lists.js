// ParentComponent.js
import React, { useState } from 'react';
import ClassesList from '../../app/components/lists/ClassesList';
import StudentsByClass from '../../app/components/lists/StudentsByClass';

const ParentComponent = () => {
  const [selectedClass, setSelectedClass] = useState(null);

  return (
    <div className="flex flex-col items-center">
      <ClassesList onSelectClass={setSelectedClass} />
      {selectedClass && <StudentsByClass selectedClass={selectedClass} />}
    </div>
  );
};

export default ParentComponent;
