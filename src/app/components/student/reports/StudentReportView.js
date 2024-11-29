import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';
import { useSession } from 'next-auth/react';

const StudentReportView = () => {
  const { data: session } = useSession();
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const reportsRef = ref(database, 'reports');
        const reportsSnapshot = await get(reportsRef);

        if (reportsSnapshot.exists()) {
          const reportsData = reportsSnapshot.val();
          const formattedReports = [];
          
          // Flatten the nested structure into an array
          Object.values(reportsData).forEach(studentReports => {
            Object.entries(studentReports).forEach(([key, report]) => {
              formattedReports.push({
                id: key,
                ...report
              });
            });
          });

          // Sort reports by date (most recent first)
          formattedReports.sort((a, b) => b.timestamp - a.timestamp);
          setReports(formattedReports);
          
          // Set most recent report as default
          if (formattedReports.length > 0) {
            setSelectedReport(formattedReports[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main3"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Report Selection */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
          Select Report
        </label>
        <select
          value={selectedReport?.id || ''}
          onChange={(e) => setSelectedReport(reports.find(r => r.id === e.target.value))}
          className="w-full px-4 py-2 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white focus:border-main3 focus:ring-main3"
        >
          <option value="">Choose a report</option>
          {reports.map((report) => (
            <option key={report.id} value={report.id}>
              {report.term} - {report.year} - {report.studentName}
            </option>
          ))}
        </select>
      </div>

      {/* Report Display */}
      {selectedReport && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
          {/* School Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">School Name</h1>
            <p className="text-gray-600 dark:text-gray-300">Academic Report Card</p>
            <p className="text-gray-600 dark:text-gray-300">{selectedReport.term} - {selectedReport.year}</p>
          </div>

          {/* Student Information */}
          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
            <div>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Name:</span> {selectedReport.studentName}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Class:</span> {selectedReport.class}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Term:</span> {selectedReport.term}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Year:</span> {selectedReport.year}
              </p>
            </div>
          </div>

          {/* Academic Performance */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 dark:bg-slate-700">
                <tr>
                  <th className="px-4 py-2 text-gray-800 dark:text-white">Subject</th>
                  <th className="px-4 py-2 text-gray-800 dark:text-white">Possible Mark</th>
                  <th className="px-4 py-2 text-gray-800 dark:text-white">Obtained Mark</th>
                  <th className="px-4 py-2 text-gray-800 dark:text-white">Percentage</th>
                  <th className="px-4 py-2 text-gray-800 dark:text-white">Grade</th>
                  <th className="px-4 py-2 text-gray-800 dark:text-white">Class Average</th>
                  <th className="px-4 py-2 text-gray-800 dark:text-white">Effort Grade</th>
                  <th className="px-4 py-2 text-gray-800 dark:text-white">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {selectedReport.subjects.map((subject, index) => (
                  <tr key={index} className="border-b dark:border-gray-600">
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-300">{subject.name}</td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-300">{subject.possibleMark}</td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-300">{subject.obtainedMark}</td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-300">{subject.percentage}%</td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-300">{subject.grade}</td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-300">{subject.classAverage}</td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-300">{subject.effortGrade}</td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-300">{subject.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Attendance Summary */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Attendance Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Days Present:</span> {selectedReport.attendance.present}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Days Absent:</span> {selectedReport.attendance.absent}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Attendance:</span> {selectedReport.attendance.percentage}%
              </p>
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-4 mb-6">
            <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <h4 className="font-semibold mb-2 text-gray-800 dark:text-white">Teacher Comments</h4>
              <p className="text-gray-600 dark:text-gray-300">{selectedReport.teacherComments}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <h4 className="font-semibold mb-2 text-gray-800 dark:text-white">Principal Comments</h4>
              <p className="text-gray-600 dark:text-gray-300">{selectedReport.principalComments}</p>
            </div>
          </div>

          {/* Print Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => window.print()}
              className="px-6 py-2 bg-main3 text-white rounded-lg hover:bg-opacity-90 transition-colors print:hidden"
            >
              Print Report
            </button>
          </div>
        </div>
      )}

      {!selectedReport && reports.length === 0 && (
        <div className="text-center p-6">
          <p className="text-gray-600 dark:text-gray-300">No reports available.</p>
        </div>
      )}
    </div>
  );
};

export default StudentReportView;