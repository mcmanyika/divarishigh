import React, { useState, useEffect } from 'react';
import { ref, push, onValue, update } from 'firebase/database'; // Added 'update'
import { database } from '../../../../../utils/firebaseConfig'; // Adjust path as necessary
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

const CreateAssignment = () => {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [classes, setClasses] = useState([]); // Store the fetched classes here
  const [formValues, setFormValues] = useState({
    assignmentName: '',
    assignmentDueDate: '', // The due date for the assignment
    assignmentClass: '',
    description: '', // Added description field
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session) {
      const userEmail = session.user.email;
      setEmail(userEmail);

      // Fetch classes where teacherEmail matches the logged-in user
      const classesRef = ref(database, 'classes');
      onValue(classesRef, (snapshot) => {
        const classesData = snapshot.val();
        if (classesData) {
          const userClasses = Object.keys(classesData)
            .filter((key) => classesData[key].teacherEmail === userEmail) // Filter by teacherEmail
            .map((key) => ({
              id: key,
              ...classesData[key],
            }));
          setClasses(userClasses); // Store the filtered classes
        }
      });
    }
  }, [session]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleCreateAssignment = async () => {
    const { assignmentName, assignmentClass, assignmentDueDate, description } = formValues;

    // Basic form validation
    if (!assignmentName || !assignmentClass || !assignmentDueDate || !description) {
      toast.error('Please fill out all fields before creating the assignment.');
      return;
    }

    setIsLoading(true); // Set loading state
    try {
      const assignmentsRef = ref(database, 'assignment');
      const newAssignment = {
        email,
        assignmentName,
        assignmentClass,
        createdDate: Date.now(), // Current timestamp for created date
        assignmentDueDate, // User-provided due date
        description, // Include the description in the assignment data
      };

      // Push the assignment data
      const assignmentSnapshot = await push(assignmentsRef, newAssignment);

      // Get the assignment ID
      const assignmentId = assignmentSnapshot.key;

      // Fetch students of the assigned class
      const studentsRef = ref(database, 'userTypes');
      onValue(studentsRef, (snapshot) => {
        const studentsData = snapshot.val();
        if (studentsData) {
          const studentsInClass = Object.keys(studentsData)
            .filter((key) => studentsData[key].studentClassLevel === assignmentClass)
            .map((key) => ({ id: key, ...studentsData[key] }));

          // Assign the assignment to each student
          studentsInClass.forEach((student) => {
            const studentRef = ref(database, `userTypes/${student.id}/assignments/${assignmentId}`);
            update(studentRef, {
              assignmentId: assignmentId,
              status: 'Assigned',
            });
          });
        }
      });

      // Reset form values and show success message
      setFormValues({
        assignmentName: '',
        assignmentDueDate: '',
        assignmentClass: '',
        description: '', // Reset description field
      });
      toast.success('Assignment created and successfully assigned to students!');
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast.error('Error creating assignment. Please try again.');
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  return (
    <div className="w-full text-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-semibold mb-4">Create New Assignment</h2>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Assignment Due Date</label>
        <input
          type="date"
          name="assignmentDueDate"
          value={formValues.assignmentDueDate}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Class</label>
        <select
          name="assignmentClass"
          value={formValues.assignmentClass}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Select Class</option>
          {classes.length > 0 ? (
            classes.map((cls) => (
              <option key={cls.id} value={cls.className}>
                {cls.className}
              </option>
            ))
          ) : (
            <option disabled>No classes available</option>
          )}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Assignment Title</label>
        <input
          type="text"
          name="assignmentName"
          value={formValues.assignmentName}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
        <textarea
          name="description"
          value={formValues.description}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          rows="4" // Adjust the height of the textarea
        ></textarea>
      </div>
      <input type="hidden" value={email} readOnly />
      <button
        onClick={handleCreateAssignment}
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
          isLoading ? 'cursor-not-allowed' : ''
        }`}
        disabled={isLoading}
      >
        {isLoading ? 'Creating Assignment...' : 'Create Assignment'}
      </button>
    </div>
  );
};

export default CreateAssignment;
