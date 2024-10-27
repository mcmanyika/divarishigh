import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import { useSession } from 'next-auth/react';
import 'react-toastify/dist/ReactToastify.css';
import ResultsModal from './ResultsModal';
import CreateExamForm from '../..//components/exams/CreateExamForm';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';

const AssignedExamsList = () => {
  const { data: session } = useSession();
  const [students, setStudents] = useState([]);
  const [examsMap, setExamsMap] = useState({});
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
  const [isCreateExamModalOpen, setIsCreateExamModalOpen] = useState(false);
  const [examResults, setExamResults] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!session) return;

    const email = session.user.email;
    const admissionsRef = ref(database, 'userTypes');
    const examsRef = ref(database, 'exams');
    const resultsRef = ref(database, 'examResults');

    onValue(examsRef, (snapshot) => {
      const examsData = snapshot.val();
      if (examsData) {
        const mappedExams = Object.keys(examsData).reduce((acc, key) => {
          const exam = examsData[key];
          if (exam.email === email) {
            acc[key] = exam.examName;
          }
          return acc;
        }, {});
        setExamsMap(mappedExams);
      }
    });

    onValue(admissionsRef, (snapshot) => {
      const admissionsData = snapshot.val();
      if (admissionsData) {
        const studentsWithExams = Object.keys(admissionsData).map((key) => {
          const student = admissionsData[key];
          return {
            id: key,
            ...student,
            exams: student.exams || {},
          };
        });
        const studentsWithAssignedExams = studentsWithExams.filter(
          (student) => Object.keys(student.exams).length > 0
        );
        setStudents(studentsWithAssignedExams);
      }
    });

    onValue(resultsRef, (snapshot) => {
      const resultsData = snapshot.val() || {};
      setExamResults(resultsData);
    });
  }, [session]);

  const filteredStudents = selectedExam
    ? students.filter((student) => student.exams[selectedExam])
    : students;

  const totalItems = filteredStudents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getStatusIcon = (score, status) => {
    if (score > 0 && score < 50) {
      return <FaTimesCircle className="text-red-500" />;
    }
    if (score >= 50) {
      return <FaCheckCircle className="text-green-500" />;
    }
    if (status === 'Assigned') {
      return <FaHourglassHalf className="text-yellow-500" />;
    }
    return <FaTimesCircle className="text-gray-500" />;
  };

  const handleStudentClick = (student, examId) => {
    setSelectedStudent(student);
    setSelectedExamId(examId);
    setIsResultsModalOpen(true);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentStudents = filteredStudents.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Students Assigned Exams</h2>
        <button
          onClick={() => setIsCreateExamModalOpen(true)}
          className="bg-main3 text-white font-bold py-2 px-4 rounded-full"
        >
          Create New Exam
        </button>
      </div>

      {currentStudents.length === 0 ? (
        <p>No students with assigned exams found.</p>
      ) : (
        <div>
          <table className="min-w-full text-sm border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Student Name</th>
                <th className="border border-gray-300 px-4 py-2">Exam Name</th>
                <th className="border border-gray-300 px-4 py-2">Score</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student) => (
                <React.Fragment key={student.id}>
                  {Object.entries(student.exams).map(([examId, examDetails]) => {
                    if (examId in examsMap && (selectedExam === '' || examId === selectedExam)) {
                      const score = examResults[`${student.id}_${examId}`]?.score || 0;
                      const examStatus = score > 0 ? 'Completed' : examDetails.status;

                      return (
                        <tr key={examId}>
                          <td className="border border-gray-300 px-4 py-2">
                            {student.firstName} {student.lastName}
                          </td>
                          <td
                            className="border border-gray-300 px-4 py-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleStudentClick(student, examId)}
                          >
                            {examsMap[examId]}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">{score}</td>
                          <td className="border border-gray-300 px-4 py-2">
                            {getStatusIcon(score, examStatus)}
                          </td>
                        </tr>
                      );
                    }
                    return null;
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-between mt-4">
        <button
          onClick={() => handlePageChange('prev')}
          disabled={currentPage === 1}
          className="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-l"
        >
          Prev
        </button>
        <button
          onClick={() => handlePageChange('next')}
          disabled={currentPage === totalPages}
          className="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-r"
        >
          Next
        </button>
      </div>

      {isResultsModalOpen && (
        <ResultsModal
          student={selectedStudent}
          examId={selectedExamId}
          onClose={() => setIsResultsModalOpen(false)}
        />
      )}

      {isCreateExamModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setIsCreateExamModalOpen(false)} // Close on overlay click
        >
          <div 
            className="bg-white rounded p-8 w-3/4 max-w-2xl" 
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <CreateExamForm onClose={() => setIsCreateExamModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedExamsList;
