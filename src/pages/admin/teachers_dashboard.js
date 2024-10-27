
import withAuth from '../../../utils/withAuth';
import AdminLayout from './adminLayout';
import Students from '../../app/components/teachers/utils/Students';
import StudentGenderCount from '../../app/components/teachers/utils/StudentGenderCount';
import ExamResults from '../../app/components/exams/ExamResults';
import ClassRoutineList from '../../app/components/teachers/ClassRoutineList';
import TeacherSubmittedAssignments from '../../app/components/teachers/assignments/TeacherSubmittedAssignments';
import TeacherClassesList from '../../app/components/teachers/utils/TeacherClassesList';

const TeacherDashboard = () => {

  return (
    <AdminLayout>
      <div className="flex flex-col h-screen overflow-y-auto">
        <div className="w-full">
          <StudentGenderCount />
          <div className="w-full flex mt-4">
            <div className="w-full flex relative">
              <div className='flex-1 m-1'><ClassRoutineList /></div>
              <div className='flex-1 m-1'><TeacherClassesList /></div>
            </div>
          </div>
          <div className="w-full flex mt-4">
            <div className="bg-white flex-1 border shadow-sm rounded relative">
              <TeacherSubmittedAssignments />
            </div>
          </div>
          <div className="w-full flex mt-4">
            <div className="bg-white flex-1 border shadow-sm rounded relative">
              <ExamResults />
            </div>
          </div>
          <div className="bg-white border shadow-sm rounded mt-4">
            <Students />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default withAuth(TeacherDashboard);
