import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaCheckCircle } from 'react-icons/fa';

export default function Success() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/admin/student_dash');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-4">
          Thank you for your subscription. You now have full access to all features.
        </p>
        <p className="text-sm text-gray-500">
          Redirecting to dashboard in a few seconds...
        </p>
      </div>
    </div>
  );
} 