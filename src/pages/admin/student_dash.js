import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import withAuth from '../../../utils/withAuth';
import AdminLayout from './adminLayout';
import { FaSpinner, FaUser } from 'react-icons/fa';
import ClassRoutine from '../../app/components/student/ClassRoutine';
import { database } from '../../../utils/firebaseConfig';
import { ref, get } from 'firebase/database';
import { useRouter } from 'next/router';
import { useGlobalState, setStudentClass, setStatus } from '../../app/store';
import CombinedExamsList from '../../app/components/exams/CombinedExamsList';
import StudentAssignmentsList from '../../app/components/student/assignments/StudentAssignmentsList';
import StudentAttendanceHistory from '../../app/components/attendance/StudentAttendanceHistory';
import QuickStats from '../../app/components/student/stats/QuickStats';
import AcademicProgress from '../../app/components/student/stats/AcademicProgress';
import Deadlines from '../../app/components/student/stats/Deadlines';

const StudentDash = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [studentStatus, setGlobalStatus] = useGlobalState('status');
  const [studentId, setStudentId] = useGlobalState('studentId');
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (session) {
      fetchStudentData(session.user.email);
    }
  }, [session, status]);

  const fetchStudentData = async (email) => {
    try {
      const studentRef = ref(database, 'userTypes');
      const studentSnapshot = await get(studentRef);

      if (studentSnapshot.exists()) {
        const allStudentData = studentSnapshot.val();
        const matchedStudent = Object.entries(allStudentData).find(([_, student]) => student.email === email);

        if (matchedStudent) {
          const [studentId, studentInfo] = matchedStudent;
          setStudentData(studentInfo);
          setStudentClass(studentInfo.class);
          setStudentId(studentId);
          localStorage.setItem('studentId', studentId);
          setGlobalStatus(studentInfo.status);
        } else {
          router.push('/admin/dashboard');
        }
      } else {
        console.log('No student data found.');
        router.push('/admin/dashboard');
      }
    } catch (error) {
      console.error('Error fetching student data: ', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-slate-950">
        <FaSpinner className="text-4xl text-main3 dark:text-main2 animate-spin" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className='min-h-screen space-y-6 pt-6 dark:bg-slate-950 transition-colors duration-200'>
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-6 border border-gray-100 dark:border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-main3/10 dark:bg-main2/10 rounded-full">
                <FaUser className="text-2xl text-main3 dark:text-main2" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Welcome, {studentData?.firstName} {studentData?.lastName}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Class: {studentData?.class} | Roll: {studentData?.rollNumber}
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-sm">
                Current Term: Spring 2024
              </span>
            </div>
          </div>
        </div>

        <QuickStats />

        <AcademicProgress />

        <Deadlines />

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-slate-800">
            <div className="p-4 border-b border-gray-100 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Class Routine</h3>
            </div>
            <div className="p-4">
              <ClassRoutine />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-slate-800">
            <div className="p-4 border-b border-gray-100 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Attendance History</h3>
            </div>
            <div className="p-4">
              <StudentAttendanceHistory />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-slate-800">
            <div className="p-4 border-b border-gray-100 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Assignments</h3>
            </div>
            <div className="p-4">
              <StudentAssignmentsList />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-slate-800">
            <div className="p-4 border-b border-gray-100 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Exams Results</h3>
            </div>
            <div className="p-4">
              <CombinedExamsList />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default withAuth(StudentDash);
