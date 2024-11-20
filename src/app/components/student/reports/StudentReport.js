import { useState, useEffect } from 'react';
import { ref, get, set } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';

const StudentReport = () => {
  const { data: session } = useSession();
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedStudentData, setSelectedStudentData] = useState(null);
  const [students, setStudents] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modified form state to include one default subject
  const [formData, setFormData] = useState({
    subjects: [
      {
        name: '',
        possibleMark: '100',
        obtainedMark: '',
        classAverage: '',
        effortGrade: '',
        remarks: ''
      }
    ],
    attendance: {
      present: '',
      absent: '',
      percentage: ''
    },
    teacherComments: '',
    principalComments: '',
    term: 'First Term',
    year: new Date().getFullYear().toString(),
    teacherEmail: session?.user?.email || '',
    teacherName: session?.user?.name || ''
  });

  // Add new subject
  const addSubject = () => {
    setFormData(prev => ({
      ...prev,
      subjects: [
        ...prev.subjects,
        {
          name: '',
          possibleMark: '100',
          obtainedMark: '',
          classAverage: '',
          effortGrade: '',
          remarks: ''
        }
      ]
    }));
  };

  // Remove subject - prevent removing last subject
  const removeSubject = (index) => {
    if (formData.subjects.length <= 1) {
      toast.warning('At least one subject is required');
      return;
    }
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }));
  };

  // Handle subject input changes
  const handleSubjectChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.map((subject, i) => 
        i === index ? { ...subject, [field]: value } : subject
      )
    }));
  };

  // Fetch all students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsRef = ref(database, 'userTypes');
        const snapshot = await get(studentsRef);
        
        if (snapshot.exists()) {
          const studentsData = Object.entries(snapshot.val())
            .filter(([_, user]) => user.userType === 'student')
            .map(([id, user]) => ({
              id,
              name: `${user.firstName} ${user.lastName}`,
              class: user.class,
              admissionNumber: user.userID
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
          
          setStudents(studentsData);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Fetch selected student's data
  useEffect(() => {
    const fetchStudentData = async () => {
      if (!selectedStudent) {
        setSelectedStudentData(null);
        return;
      }

      try {
        const studentRef = ref(database, `userTypes/${selectedStudent}`);
        const snapshot = await get(studentRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          setSelectedStudentData({
            name: `${data.firstName} ${data.lastName}`,
            class: data.class,
            admissionNumber: data.userID
          });
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, [selectedStudent]);

  // Fetch student report data when a student is selected
  useEffect(() => {
    const fetchStudentReport = async () => {
      if (!selectedStudent) return;

      try {
        setLoading(true);
        // Fetch grades
        const gradesRef = ref(database, `grades/${selectedStudent}`);
        const gradesSnapshot = await get(gradesRef);
        
        // Fetch attendance
        const attendanceRef = ref(database, `attendance/${selectedStudent}`);
        const attendanceSnapshot = await get(attendanceRef);

        if (gradesSnapshot.exists() && attendanceSnapshot.exists()) {
          const grades = gradesSnapshot.val();
          const attendance = attendanceSnapshot.val();
          
          // Process and set report data
          setReportData({
            grades,
            attendance,
            // Add other relevant data
          });
        }
      } catch (error) {
        console.error('Error fetching student report:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentReport();
  }, [selectedStudent]);

  const handleInputChange = (subject, field, value) => {
    setFormData(prev => ({
      ...prev,
      subjects: {
        ...prev.subjects,
        [subject]: {
          ...prev.subjects[subject],
          [field]: value
        }
      }
    }));
  };

  const handleAttendanceChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      attendance: {
        ...prev.attendance,
        [field]: value
      }
    }));
  };

  const calculateGrade = (obtained, possible) => {
    const percentage = (obtained / possible) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return;

    try {
      setLoading(true);
      
      // Process subjects
      const processedSubjects = formData.subjects.map(subject => {
        const possibleMark = parseFloat(subject.possibleMark) || 100;
        const obtainedMark = parseFloat(subject.obtainedMark) || 0;
        const classAverage = parseFloat(subject.classAverage) || 0;
        
        return {
          ...subject,
          possibleMark,
          obtainedMark,
          classAverage,
          percentage: ((obtainedMark / possibleMark) * 100).toFixed(1),
          grade: calculateGrade(obtainedMark, possibleMark)
        };
      });

      // Calculate attendance percentage
      const present = parseInt(formData.attendance.present) || 0;
      const absent = parseInt(formData.attendance.absent) || 0;
      const total = present + absent;
      const percentage = total ? ((present / total) * 100).toFixed(1) : 0;

      const reportRef = ref(database, `reports/${selectedStudent}/${formData.term}_${formData.year}`);
      await set(reportRef, {
        ...formData,
        subjects: processedSubjects,
        attendance: {
          ...formData.attendance,
          percentage
        },
        timestamp: Date.now()
      });

      toast.success('Report saved successfully');
      // Refresh report data
      fetchStudentReport();
    } catch (error) {
      console.error('Error saving report:', error);
      toast.error('Error saving report');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main3"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white dark:bg-slate-900">
      {/* Student Selection */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
          Select Student
        </label>
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="w-full px-4 py-2  max-w-md rounded-lg border-gray-300 dark:border-white dark:bg-white dark:text-black shadow-sm appearance-none focus:border-main3 focus:ring-main3"
        >
          <option value="">Choose a student</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name} - Class {student.class}
            </option>
          ))}
        </select>
      </div>

      {/* Show form immediately when student is selected */}
      {selectedStudent && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-8 mt-6">
          {/* Student Info Display */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
              Report for {selectedStudentData?.name}
            </h2>
            <div className="grid grid-cols-2 gap-6 bg-gray-50 dark:bg-slate-700 p-6 rounded-lg">
              <p className="text-base text-gray-600 dark:text-white">
                <span className="font-medium">Class:</span> {selectedStudentData?.class}
              </p>
              <p className="text-base text-gray-600 dark:text-white">
                <span className="font-medium">Admission Number:</span> {selectedStudentData?.admissionNumber}
              </p>
            </div>
          </div>

          {/* Term Selection */}
          <div className="mb-8">
            <label className="block text-base font-medium text-gray-700 dark:text-white mb-2">
              Term
            </label>
            <select
              value={formData.term}
              onChange={(e) => setFormData(prev => ({ ...prev, term: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border-gray-300 dark:border-white dark:bg-white dark:text-black text-base focus:ring-2 focus:ring-main3"
            >
              <option value="First Term">First Term</option>
              <option value="Second Term">Second Term</option>
              <option value="Third Term">Third Term</option>
            </select>
          </div>

          {/* Subjects */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium text-gray-800 dark:text-white">Subjects</h3>
              <button
                type="button"
                onClick={addSubject}
                className="px-4 py-2 bg-main3 text-white rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Add Subject
              </button>
            </div>

            {formData.subjects.map((subject, index) => (
              <div key={index} className="mb-6 p-6 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex-1 mr-4">
                    <label className="block text-base text-gray-600 dark:text-gray-400 mb-2">Subject Name</label>
                    <input
                      type="text"
                      value={subject.name}
                      onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-gray-300 dark:border-white dark:bg-white dark:text-gray-800 text-base focus:ring-2 focus:ring-main3"
                      placeholder="Enter subject name"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSubject(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-base text-gray-600 dark:text-gray-400 mb-2">Possible Mark</label>
                    <input
                      type="number"
                      min="0"
                      value={subject.possibleMark}
                      onChange={(e) => handleSubjectChange(index, 'possibleMark', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-gray-300 dark:border-white dark:bg-white dark:text-gray-800 text-base focus:ring-2 focus:ring-main3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-base text-gray-600 dark:text-gray-400 mb-2">Obtained Mark</label>
                    <input
                      type="number"
                      min="0"
                      max={subject.possibleMark}
                      value={subject.obtainedMark}
                      onChange={(e) => handleSubjectChange(index, 'obtainedMark', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-gray-300 dark:border-white dark:bg-white dark:text-gray-800 text-base focus:ring-2 focus:ring-main3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-base text-gray-600 dark:text-gray-400 mb-2">Class Average</label>
                    <input
                      type="number"
                      min="0"
                      max={subject.possibleMark}
                      value={subject.classAverage}
                      onChange={(e) => handleSubjectChange(index, 'classAverage', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-gray-300 dark:border-white dark:bg-white dark:text-gray-800 text-base focus:ring-2 focus:ring-main3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-base text-gray-600 dark:text-gray-400 mb-2">Effort Grade</label>
                    <select
                      value={subject.effortGrade}
                      onChange={(e) => handleSubjectChange(index, 'effortGrade', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-gray-300 dark:border-white dark:bg-white dark:text-gray-800 text-base focus:ring-2 focus:ring-main3"
                      required
                    >
                      <option value="">Select Grade</option>
                      <option value="A">A - Excellent</option>
                      <option value="B">B - Very Good</option>
                      <option value="C">C - Good</option>
                      <option value="D">D - Fair</option>
                      <option value="E">E - Poor</option>
                    </select>
                  </div>
                  <div className="lg:col-span-3">
                    <label className="block text-base text-gray-600 dark:text-gray-400 mb-2">Remarks</label>
                    <input
                      type="text"
                      value={subject.remarks}
                      onChange={(e) => handleSubjectChange(index, 'remarks', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-gray-300 dark:border-white dark:bg-white dark:text-gray-800 text-base focus:ring-2 focus:ring-main3"
                      placeholder="Enter remarks for this subject"
                    />
                  </div>
                </div>
              </div>
            ))}

            {formData.subjects.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                Click "Add Subject" to begin adding subjects to the report.
              </p>
            )}
          </div>

          {/* Attendance */}
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-6 text-gray-800 dark:text-white">Attendance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-slate-700 p-6 rounded-lg">
              <div>
                <label className="block text-base text-gray-600 dark:text-gray-400 mb-2">Days Present</label>
                <input
                  type="number"
                  min="0"
                  value={formData.attendance.present}
                  onChange={(e) => handleAttendanceChange('present', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-gray-300 dark:border-white dark:bg-white dark:text-gray-800 text-base focus:ring-2 focus:ring-main3"
                />
              </div>
              <div>
                <label className="block text-base text-gray-600 dark:text-gray-400 mb-2">Days Absent</label>
                <input
                  type="number"
                  min="0"
                  value={formData.attendance.absent}
                  onChange={(e) => handleAttendanceChange('absent', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-gray-300 dark:border-white dark:bg-white dark:text-gray-800 text-base focus:ring-2 focus:ring-main3"
                />
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-6 text-gray-800 dark:text-white">Comments</h3>
            <div className="space-y-6 bg-gray-50 dark:bg-slate-700 p-6 rounded-lg">
              <div>
                <label className="block text-base text-gray-600 dark:text-gray-400 mb-2">Teacher's Comments</label>
                <textarea
                  value={formData.teacherComments}
                  onChange={(e) => setFormData(prev => ({ ...prev, teacherComments: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border-gray-300 dark:border-white dark:bg-white dark:text-gray-800 text-base focus:ring-2 focus:ring-main3"
                  rows="4"
                  placeholder="Enter your comments about the student's performance"
                />
              </div>
              <div>
                <label className="block text-base text-gray-600 dark:text-gray-400 mb-2">Principal's Comments</label>
                <textarea
                  value={formData.principalComments}
                  onChange={(e) => setFormData(prev => ({ ...prev, principalComments: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border-gray-300 dark:border-white dark:bg-white dark:text-gray-800 text-base focus:ring-2 focus:ring-main3"
                  rows="4"
                  placeholder="Principal's comments will be added later"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="px-6 py-3 text-base font-medium bg-main3 text-white rounded-lg hover:bg-opacity-90 transition-colors"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Report'}
            </button>
          </div>
        </form>
      )}

      {/* Report Display */}
      {selectedStudent && reportData && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
          {/* School Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">School Name</h1>
            <p className="text-gray-600 dark:text-gray-300">End of Term Academic Report</p>
          </div>

          {/* Student Information */}
          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            {/* ... student info display ... */}
          </div>

          {/* Academic Performance Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 dark:bg-slate-700">
                <tr>
                  <th className="px-4 py-2">Subject</th>
                  <th className="px-4 py-2">Possible Mark</th>
                  <th className="px-4 py-2">Obtained Mark</th>
                  <th className="px-4 py-2">Percentage</th>
                  <th className="px-4 py-2">Grade</th>
                  <th className="px-4 py-2">Class Average</th>
                  <th className="px-4 py-2">Effort Grade</th>
                  <th className="px-4 py-2">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {reportData.grades && Object.entries(reportData.grades).map(([subject, grades], index) => (
                  <tr key={index} className="border-b dark:border-gray-600">
                    <td className="px-4 py-2">{subject}</td>
                    <td className="px-4 py-2">{grades.possibleMark}</td>
                    <td className="px-4 py-2">{grades.obtainedMark}</td>
                    <td className="px-4 py-2">{grades.percentage}%</td>
                    <td className="px-4 py-2">{grades.grade}</td>
                    <td className="px-4 py-2">{grades.classAverage}</td>
                    <td className="px-4 py-2">{grades.effortGrade}</td>
                    <td className="px-4 py-2">{grades.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Attendance Summary */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Attendance Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Present:</span> {reportData.attendance?.present || 0} days
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Absent:</span> {reportData.attendance?.absent || 0} days
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Percentage:</span> {reportData.attendance?.percentage || 0}%
                </p>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-6">
            <div className="mb-4">
              <h4 className="font-semibold mb-2 text-gray-800 dark:text-white">Class Teacher s Comments</h4>
              <p className="text-gray-600 dark:text-gray-300 p-2 border rounded">
                {reportData.teacherComments || 'No comments available'}
              </p>
            </div>
            <div className="mb-4">
              <h4 className="font-semibold mb-2 text-gray-800 dark:text-white">Principal s Comments</h4>
              <p className="text-gray-600 dark:text-gray-300 p-2 border rounded">
                {reportData.principalComments || 'No comments available'}
              </p>
            </div>
          </div>

          {/* Signature Section */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="border-t border-gray-300 dark:border-gray-600 pt-2">
                <p className="text-sm text-gray-600 dark:text-gray-300">Class Teacher s Signature</p>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t border-gray-300 dark:border-gray-600 pt-2">
                <p className="text-sm text-gray-600 dark:text-gray-300">Principal s Signature</p>
              </div>
            </div>
          </div>

          {/* Print Button */}
          <div className="mt-6 text-center">
            <button 
              onClick={() => window.print()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition duration-200"
            >
              Print Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentReport;