import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaTimesCircle } from 'react-icons/fa';

export default function Cancel() {
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
        <FaTimesCircle className="text-red-500 text-6xl mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 mb-4">
          Your payment was cancelled. You can try again when you&apos;re ready.
        </p>
        <p className="text-sm text-gray-500">
          Redirecting to dashboard in a few seconds...
        </p>
      </div>
    </div>
  );
} 