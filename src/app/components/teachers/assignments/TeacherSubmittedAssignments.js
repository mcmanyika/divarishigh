import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig'; // Adjust path as necessary
import { useSession } from 'next-auth/react';

const TeacherSubmittedAssignments = () => {
  const { data: session } = useSession();
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    if (session) {
      const teacherEmail = session.user.email;

      const submissionsRef = ref(database, 'submissions');
      onValue(submissionsRef, (snapshot) => {
        const submissionsData = snapshot.val();
        const filteredSubmissions = [];

        if (submissionsData) {
          Object.keys(submissionsData).forEach((studentId) => {
            Object.keys(submissionsData[studentId]).forEach((assignmentId) => {
              const submission = submissionsData[studentId][assignmentId];

              if (submission && submission.teacherEmail === teacherEmail) {
                filteredSubmissions.push({
                  assignmentId,
                  studentId,
                  studentName: `${submission.firstName} ${submission.lastName}`,
                  submissionText: submission.submissionText,
                  submittedAt: submission.submittedAt,
                });
              }
            });
          });
        }

        // Sort submissions by submittedAt in descending order
        filteredSubmissions.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

        setSubmittedAssignments(filteredSubmissions);
        setLoading(false);
      });
    }
  }, [session]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSubmissions = submittedAssignments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(submittedAssignments.length / itemsPerPage);

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

  const handleSubmissionClick = (submission) => {
    setSelectedSubmission(submission);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSubmission(null);
  };

  if (loading) {
    return <div>Loading submitted assignments...</div>;
  }

  if (submittedAssignments.length === 0) {
    return <div>No submissions found.</div>;
  }

  return (
    <div className="w-full bg-white text-sm text-md mx-auto rounded p-4 md:px-8 md:pt-6 pb-8 mb-4">
      <h2 className="text-lg md:text-xl font-bold mb-4">Submitted Assignments</h2>
      {currentSubmissions.map((submission) => (
        <div
          key={submission.assignmentId}
          onClick={() => handleSubmissionClick(submission)}
          className="flex flex-col md:flex-row items-start md:items-center mb-4 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100"
        >
          <div className="w-full md:w-1/2 p-1 truncate">{submission.studentName}</div>
          <div className="w-full md:w-1/2 p-1 text-gray-600 text-sm">
            {new Date(submission.submittedAt).toLocaleString()}
          </div>
        </div>
      ))}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white'
          }`}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages ? 'bg-gray-300' : 'bg-blue-500 text-white'
          }`}
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {showModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full  h-full rounded-lg p-6 overflow-y-auto">
            <p className="text-lg font-semibold">{selectedSubmission.studentName}</p>
            <p className="text-sm text-gray-600 mb-4">
              {new Date(selectedSubmission.submittedAt).toLocaleString()}
            </p>
            <div
              className="blog-content mb-2 text-gray-700"
              dangerouslySetInnerHTML={{ __html: selectedSubmission.submissionText }} // Render rich text content
            />
            <button
              onClick={closeModal}
              className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherSubmittedAssignments;
