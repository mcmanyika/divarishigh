import React, { useEffect, useState } from 'react';
import { ref, onValue, get } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig'; // Adjust path as necessary
import { useSession } from 'next-auth/react';

const TeacherSubmittedAssignments = () => {
  const { data: session } = useSession();
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (session) {
      const teacherEmail = session.user.email;

      // Fetch submissions where the teacherEmail matches the logged-in user's email
      const submissionsRef = ref(database, 'submissions');
      onValue(submissionsRef, async (snapshot) => {
        const submissionsData = snapshot.val();
        const filteredSubmissions = [];

        if (submissionsData) {
          // Loop through all students' submissions
          Object.keys(submissionsData).forEach((studentId) => {
            Object.keys(submissionsData[studentId]).forEach((assignmentId) => {
              const submission = submissionsData[studentId][assignmentId];

              if (submission && submission.teacherEmail === teacherEmail) {
                filteredSubmissions.push({
                  assignmentId,
                  studentId,
                  studentName: `${submission.studentFirstName} ${submission.studentLastName}`,
                  submissionText: submission.submissionText,
                  submittedAt: submission.submittedAt,
                });
              }
            });
          });
        }

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

  if (loading) {
    return <div>Loading submitted assignments...</div>;
  }

  if (submittedAssignments.length === 0) {
    return <div>No submissions found.</div>;
  }

  return (
    <div className="w-full bg-white text-sm text-md mx-auto rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-xl font-bold mb-4">Submitted Assignments</h2>
      {currentSubmissions.map((submission) => (
        <div key={submission.assignmentId} className="mb-6 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Assignment ID: {submission.assignmentId}</h3>
          <p><strong>Submitted by:</strong> {submission.studentName}</p>
          <p><strong>Submission:</strong> {submission.submissionText}</p>
          <p><strong>Submitted At:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>
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
    </div>
  );
};

export default TeacherSubmittedAssignments;
