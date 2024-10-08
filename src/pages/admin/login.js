'use client';
import { useSession, signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import SmartBlankLayout from '../../app/components/SmartBlankLayout';
import SignIn from '../../app/components/user/SignIn';
import SignUp from '../../app/components/user/SignUp';

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false); // For toggling between login and signup

  // Redirect authenticated users to the dashboard
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/admin/dashboard');
    }
  }, [status, router]);

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError(error.message);
    }
  };

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp); // Toggle between login and signup
    setError(null); // Clear any existing errors
  };

  return (
    <div className="flex items-center justify-center min-h-screen login-background">
      <div className="max-w-4xl mx-auto p-6 bg-white bg-opacity-75 rounded shadow-md text-center">
        <Link href='/'>
          <Image
            src="/images/logo.png"
            alt=""
            width={90}
            height={90}
            className="mx-auto mb-4 rounded-full"
          />
        </Link>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {!session && 
        <div className='w-96'>
          {isSignUp ? <SignUp /> : <SignIn />} {/* Toggle SignIn or SignUp based on state */}
          <p className="mt-6">OR</p>

          <button
            onClick={handleGoogleSignIn}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200 mt-4 w-full"
          >
            Sign in with Google
          </button>
          <p className="mt-4">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <button onClick={toggleSignUp} className="text-blue-500 ml-1 underline">
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div> }

        {session && <div className='w-96'>Redirecting to dashboard...</div>}
      </div>
    </div>
  );
}
