import React, { useEffect, useState } from 'react';
import { ref, onValue, set, get } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig'; // Adjust path as necessary
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify'; // Import Toast functions
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for Toast

const StudentAssignmentsList = () => {
  const { data: session } = useSession();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentClass, setStudentClass] = useState('');
  const [userID, setUserID] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submission, setSubmission] = useState(''); // State to hold submission text
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [hasSubmitted, setHasSubmitted] = useState(false); // State to check submission

  useEffect(() => {
    if (session) {
      const studentEmail = session.user.email;
      // Fetch the logged-in student's class and user ID
      const studentRef = ref(database, 'userTypes');
      onValue(studentRef, (snapshot) => {
        const studentsData = snapshot.val();
        const student = Object.values(studentsData).find((s) => s.email === studentEmail);
        if (student) {
          setStudentClass(student.class);
          setUserID(student.userID);
        }
      });
    }
  }, [session]);

  useEffect(() => {
    if (studentClass && userID) {
      // Fetch assignments based on the student's class
      const assignmentsRef = ref(database, 'assignment');
      onValue(assignmentsRef, (snapshot) => {
        const assignmentsData = snapshot.val();
        if (assignmentsData) {
          const filteredAssignments = Object.keys(assignmentsData)
            .filter(
              (key) => assignmentsData[key].assignmentClass === studentClass
            )
            .map((key) => ({
              id: key,
              ...assignmentsData[key],
            }));
          setAssignments(filteredAssignments);
        }
        setLoading(false);
      });
    }
  }, [studentClass, userID]);

  const handleShowModal = async (assignment) => {
    setSelectedAssignment(assignment);
    setShowModal(true);
    setSubmission(''); // Reset submission text

    // Check if a submission already exists for the selected assignment
    const submissionRef = ref(database, `submissions/${userID}/${assignment.id}`);
    const submissionSnapshot = await get(submissionRef);
    setHasSubmitted(submissionSnapshot.exists()); // Set the hasSubmitted state
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAssignment(null);
    setHasSubmitted(false); // Reset submission state when closing modal
  };

  const handleSubmissionChange = (e) => {
    setSubmission(e.target.value); // Update submission text state
  };

  const handleSubmitAssignment = async () => {
    if (submission.trim() === '') {
      toast.error('Please provide a submission before submitting.'); // Error toast
      return;
    }

    const submissionRef = ref(database, `submissions/${userID}/${selectedAssignment.id}`);
    const submissionData = {
      submissionText: submission,
      submittedAt: new Date().toISOString(),
      teacherEmail: selectedAssignment.email, // Include teacher's email in the submission
    };

    try {
      await set(submissionRef, submissionData); // Save submission to Firebase
      toast.success('Assignment submitted successfully!'); // Success toast
      setSubmission(''); // Clear the submission input
      handleCloseModal(); // Close modal after submission
    } catch (error) {
      console.error('Error submitting assignment:', error);
      toast.error('Failed to submit assignment. Please try again.'); // Error toast
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAssignments = assignments.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(assignments.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return <div>Loading assignments...</div>;
  }

  if (assignments.length === 0) {
    return <div>No assignments found for your class or user.</div>;
  }

  return (
    <div className="w-full text-sm text-md mx-auto rounded px-8 pt-6 pb-8 mb-4">
      
      <h2 className="text-xl font-bold mb-4">Your Assignments</h2>
      {currentAssignments.map((assignment) => (
        <div
          key={assignment.id}
          className="mb-6 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100"
          onClick={() => handleShowModal(assignment)}
        >
          <h3 className="text-lg font-semibold mb-2">{assignment.assignmentName}</h3>
          <p><strong>Due Date:</strong> {new Date(assignment.assignmentDueDate).toLocaleDateString()}</p>
          <p><strong>Created Date:</strong> {new Date(assignment.createdDate).toLocaleDateString()}</p>
          <p><strong>Teacher</strong>: {assignment.email}</p> {/* Display teacher email */}
        </div>
      ))}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
        >
          Next
        </button>
      </div>

      {showModal && selectedAssignment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 p-6">
            <h3 className="text-2xl font-bold mb-4">{selectedAssignment.assignmentName}</h3>
            <p>{selectedAssignment.assignmentDescription || 'No description available'}</p>
            
            {hasSubmitted ? (
              <div className="text-red-600 font-bold mt-4">
                You have already submitted this assignment.
              </div>
            ) : (
              <>
                <textarea
                  value={submission}
                  onChange={handleSubmissionChange}
                  placeholder="Write your submission here..."
                  className="w-full h-24 p-2 border border-gray-300 rounded mb-4"
                />
                {/* Submit Assignment Button */}
                <button
                  className="mt-4 bg-main3 text-white font-bold py-2 px-4 rounded"
                  onClick={handleSubmitAssignment}
                >
                  Submit Assignment
                </button>
              </>
            )}

            <button
              className="mt-4 bg-gray-500 text-white font-bold py-2 px-4 rounded ml-2"
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAssignmentsList;
