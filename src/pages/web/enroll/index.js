import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import EnrollmentDetailsForm from '../../../app/components/student/enroll/EnrollmentDetailsForm';
import AdminLayout from '../../admin/adminLayout';
import withAuth from '../../../../utils/withAuth';

const Student = () => {
  const { data: session } = useSession();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    if (session && session.user) {
      setUserEmail(session.user.email);
    }
  }, [session]);

  return (
    <>
    <div className="max-w-6xl mx-auto p-4">
      {userEmail && <EnrollmentDetailsForm userEmail={userEmail} />}
    </div>
    </>
  );
};

export default withAuth(Student);
