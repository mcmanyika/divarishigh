import { useGlobalState } from '../../app/store';
import withAuth from '../../../utils/withAuth';
import AdminLayout from './adminLayout';
import Dashboard from '../../app/components/admin';
const AdminDashboard = () => {
  const [userID] = useGlobalState('userID');

  return (
    <AdminLayout>
      <Dashboard />
    </AdminLayout>
  );
};

export default withAuth(AdminDashboard);
