import { useGlobalState } from '../../app/store';
import withAuth from '../../../utils/withAuth';
import AdminLayout from './adminLayout';
import GenderCount from '../../app/components/admin/admissions/GenderCount';
import AdmissionsList from '../../app/components/admin/admissions/AdmissionsList';
import GenderPieChart from '../../app/components/admin/admissions/GenderPieChart';
import BlogList from '../../app/components/admin/blog/BlogList';

const AdminDashboard = () => {
  const [userID] = useGlobalState('userID');

  return (
    <AdminLayout>
      <div className="flex flex-col p-4 h-screen overflow-y-auto space-y-4 
        bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
        
        {/* Gender Count Section */}
        <div className="w-full transition-all duration-200">
          <GenderCount />
        </div>

        {/* Main Content (AdmissionsList and GenderPieChart) */}
        <div className="w-full flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          {/* Admissions List */}
          <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 
            border dark:border-gray-700 
            shadow-sm dark:shadow-gray-900 
            rounded-lg overflow-y-auto md:h-auto h-80
            transition-all duration-200">
            <AdmissionsList />
          </div>

          {/* Gender Pie Chart */}
          <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 
            border dark:border-gray-700 
            shadow-sm dark:shadow-gray-900 
            rounded-lg
            transition-all duration-200">
            <GenderPieChart />
          </div>
        </div>

        {/* Blog List Section */} 
        <div className="w-full bg-white dark:bg-gray-800 
          border dark:border-gray-700 
          shadow-sm dark:shadow-gray-900 
          rounded-lg
          transition-all duration-200">
          <BlogList />
        </div>
      </div>
    </AdminLayout>
  );
};

export default withAuth(AdminDashboard);
