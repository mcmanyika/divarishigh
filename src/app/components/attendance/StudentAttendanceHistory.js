import { useState, useEffect } from 'react';
import { database } from '../../../../utils/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { useSession } from 'next-auth/react';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

function StudentAttendanceHistory() {
  const { data: session } = useSession();
  const [userID, setUserID] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch userID from userTypes table based on logged-in user's email
  useEffect(() => {
    const userEmail = session?.user?.email;
    if (userEmail) {
      const userRef = ref(database, 'userTypes');
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const user = Object.values(data).find((user) => user.email === userEmail);
          if (user) {
            setUserID(user.userID);
          }
        }
      });
    }
  }, [session]);

  // Fetch attendance data based on userID
  useEffect(() => {
    if (userID) {
      const attendanceRef = ref(database, 'attendance');
      
      onValue(attendanceRef, (snapshot) => {
        const data = snapshot.val();
        const records = [];

        if (data) {
          Object.keys(data).forEach((date) => {
            const dailyRecords = data[date];
            if (dailyRecords[userID]) {
              records.push({
                date,
                subject: dailyRecords[userID].subject || 'N/A',
                status: dailyRecords[userID].status,
              });
            }
          });
        }

        setAttendanceRecords(records);
      });
    }
  }, [userID]);

  // Pagination logic
  const indexOfLastRecord = currentPage * itemsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - itemsPerPage;
  const currentRecords = attendanceRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(attendanceRecords.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Map statuses to icons
  const statusIcons = {
    Present: <FaCheckCircle className="text-green-500" />,
    Absent: <FaTimesCircle className="text-red-500" />,
    Late: <FaClock className="text-yellow-500" />,
  };

  return (
    <div className="text-sm p-4">
      <h2 className="text-lg font-semibold mb-4">My Attendance History</h2>

      {attendanceRecords.length === 0 ? (
        <p>No attendance records found.</p>
      ) : (
        <>
          <table className="min-w-full text-left bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Subject</th>
                <th className="py-2 px-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((record, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b">{record.date}</td>
                  <td className="py-2 px-4 border-b">{record.subject}</td>
                  <td className="py-2 px-4 border-b">{statusIcons[record.status] || record.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-4 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default StudentAttendanceHistory;
