import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const Footer = () => {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <footer className="text-gray-400 bg-white dark:bg-gray-800 dark:text-gray-300 text-sm p-4">
        <div className="font-thin">
          &copy; Copyrights reserved {new Date().getFullYear()}. Developed by{' '}
          <Link href='https://learner-gamma.vercel.app/' target="_blank" className="hover:text-gray-600 dark:hover:text-gray-100">
            <b>SMART LEARNER</b>
          </Link>
        </div>
      </footer>

      {/* Fixed menu at the bottom */}
      {(session?.user?.email === 'mcmanyika@gmail.com' || session?.user?.email === 'partsonmdev@gmail.com') && (
        <div className="fixed w-full bottom-0 left-0 bg-transparent text-white text-center p-2">
          <button
            className="bg-gray-900 dark:bg-gray-700 rounded-full text-white px-4 py-2 transition-all duration-300 ease-in-out hover:px-8 hover:bg-gray-800 dark:hover:bg-gray-600"
            onClick={toggleModal}
          >
            Menu
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 flex justify-center items-center z-50"
          onClick={toggleModal}
        >
          <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white dark:bg-gray-800 text-sm/6 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-100/5">
            <div className="p-4">
              <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600">
                  <svg className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
                  </svg>
                </div>
                <div>
                  <Link href="/admin/addHeader" className="font-semibold text-gray-900 dark:text-gray-100">
                    Add Titles
                    <span className="absolute inset-0"></span>
                  </Link>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">Upload new titles</p>
                </div>
              </div>

              {/* Dictionary Section */}
              <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600">
                  <svg className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
                  </svg>
                </div>
                <div>
                  <Link href="/web/addDict" className="font-semibold text-gray-900 dark:text-gray-100">
                    Dictionary
                    <span className="absolute inset-0"></span>
                  </Link>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">Add data into t_dict table</p>
                </div>
              </div>

              {/* Banner Section */}
              <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600">
                  <svg className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
                  </svg>
                </div>
                <div>
                  <Link href="/web/uploads/bannerUploads" className="font-semibold text-gray-900 dark:text-gray-100">
                    Banner details
                    <span className="absolute inset-0"></span>
                  </Link>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">Upload banners links</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
