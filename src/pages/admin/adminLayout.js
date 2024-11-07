import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { FaBars, FaUser, FaUpload, FaCog, FaSignOutAlt } from 'react-icons/fa';
import Image from 'next/image';
import Breadcrumb from '../utils/Breadcrumb';
import { useGlobalState } from '../../app/store';
import withAuth from '../../../utils/withAuth';
import '../../app/globals.css';
import AIAssistantForm from '../../app/components/ai/AIAssistantForm';
import Footer from '../../app/components/DashFooter';
import { database } from '../../../utils/firebaseConfig';
import TitleList from '../../app/components/TitleList';
import { ref, get } from 'firebase/database';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NoticeCount from '../../app/components/notice/NoticeCount';

const AdminLayout = ({ children }) => {
  const { data: session, status } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [titles, setTitles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userID] = useGlobalState('userID');
  const [logoUrl, setLogoUrl] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    const fetchTitles = async () => {
      if (status === 'authenticated') {
        try {
          const titleRef = ref(database, `title`);
          const titleSnapshot = await get(titleRef);
          if (titleSnapshot.exists()) {
            const data = titleSnapshot.val();
            const titlesArray = Object.keys(data).map((key) => ({
              id: key,
              title: data[key].title,
              link: data[key].link,
              status: data[key].status,
              category: data[key].category,
              icon: data[key].icon,
            }));

            let filteredTitles = titlesArray.filter(title => title.category === 'dashboard');

            if (userID.startsWith('STFF')) {
              filteredTitles = filteredTitles.filter(title =>
                ['Dashboard', 'Class Routine', 'Notice', 'Admission', 'Create Blog', 'Contact Us', 'Payment', 'Class Allocation'].includes(title.title)
              );
            }

            if (userID.startsWith('ADM')) {
              filteredTitles = filteredTitles.filter(title =>
                ['Dashboard', 'Store'].includes(title.title)
              );
            }

            if (userID.startsWith('TCHR')) {
              filteredTitles = filteredTitles.filter(title =>
                ['Dashboard', 'Assignments', 'Exams', 'Notice', 'Events'].includes(title.title)
              );
            }

            setTitles(filteredTitles);
          } else {
            console.error('No titles found');
          }
        } catch (error) {
          console.error('Error fetching titles:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    const fetchLogo = async () => {
      try {
        const accountRef = ref(database, `account`);
        const accountSnapshot = await get(accountRef);
        if (accountSnapshot.exists()) {
          const accountData = accountSnapshot.val();
          setLogoUrl(accountData.logo);
        } else {
          console.error('No account data found');
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };

    fetchTitles();
    fetchLogo();
  }, [session, status]);

  const toggleMobileSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setIsPopupVisible(false); // Close popup when sidebar is toggled
  };

  const handleSignOut = () => {
    signOut();
  };

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  return (
    <div className="flex min-h-screen text-base bg-main ">

      <aside className={`fixed z-40 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:relative md:translate-x-0 w-42 bg-dash text-white p-4 min-h-screen rounded-tr-xl flex flex-col`}>
        <div className="flex justify-center items-center pt-10 mb-10">
          <Link href='/'>
            {logoUrl ? (
              <Image src={logoUrl} alt="Logo" width={70} height={60} className='rounded-full' />
            ) : (
              <div className="w-14 h-14 bg-gray-300 rounded-full animate-pulse" />
            )}
          </Link>
        </div>
        <nav className="flex-1"> 
          <TitleList titles={titles} onSignOut={handleSignOut} />
        </nav>
      </aside>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-30 md:hidden" onClick={toggleMobileSidebar}></div>
      )}

      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        <header className="flex items-center justify-between bg-dash text-white p-4 md:hidden">
          <div className="flex items-center">
            <FaBars className="cursor-pointer text-2xl mr-4" onClick={toggleMobileSidebar} />
            <Link href='/'>
              {logoUrl ? (
                <Image src={logoUrl} alt="Logo" width={50} height={30} className='rounded-full' />
              ) : (
                <div className="w-24 h-8 bg-gray-300 animate-pulse" />
              )}
            </Link>
          </div>
        </header>
        <main className="bg-gray-100 p-4">
  <div className="w-full p-2 border shadow-sm rounded-md ">
    {session && (
      <div id="profile" className="flex justify-end">
        <div className="flex items-center">
          <div className="text-sm mr-2 cursor-pointer" onClick={togglePopup}>
            {session.user.name}
          </div>
          <div
            className="rounded-full mr-4 overflow-hidden relative cursor-pointer"
            onClick={togglePopup}
          >
            <Image
              src={session.user.image}
              alt="Profile"
              width={35}
              height={35}
              className="object-cover"
            />
          </div>
          <NoticeCount />
        </div>
      </div>
    )}
    {isPopupVisible && (
      <div className="absolute text-left top-20 right-4 bg-white shadow-lg rounded-md p-4">
        <Link href='/admin/profile'>
        <span className="flex items-center p-2 text-gray-500">
          <FaUser className="mr-2" /> My Profile
        </span>
        </Link>
        <span className="flex items-center p-2 text-gray-500">
          <FaUpload className="mr-2" /> Documents Uploads
        </span>
        {/* <span className="flex items-center p-2 text-gray-500">
          <FaCog className="mr-2" /> Account Settings
        </span> */}
        <span className="flex items-center p-2 text-gray-500 cursor-pointer" onClick={handleSignOut}>
          <FaSignOutAlt className="mr-2" /> Log Out
        </span>
      </div>
    )}
  </div>
  <div className="w-full bg-gray-100">
    <Breadcrumb />
    {children}
  </div>
</main>

        <Footer />
        <AIAssistantForm />
      </div>
    </div>
  );
};

export default withAuth(AdminLayout);
