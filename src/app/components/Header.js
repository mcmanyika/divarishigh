import { useEffect, useState, useRef } from 'react';
import { FaFacebook, FaHome } from 'react-icons/fa';
import Link from 'next/link';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../utils/firebaseConfig';
import { useGlobalState, setIsOverlayVisible } from '../store';
import { useSession, signIn, signOut } from 'next-auth/react';

const Header = () => {
  const { data: session } = useSession();
  const [titles, setTitles] = useState([]);
  const [schoolName, setSchoolName] = useState(''); // State for school name
  const [facebookLink, setFacebookLink] = useState(''); // State for Facebook link
  const [isSticky, setIsSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef(null);
  const [isOverlayVisible] = useGlobalState('isOverlayVisible');
  const [isOverlay, setIsOverlay] = useState(false);
  const [userType, setUserType] = useState(''); // Add state for userType

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching titles
        const titleRef = ref(database, 'title');
        onValue(titleRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const titlesArray = Object.keys(data)
              .map((key) => ({
                id: key,
                title: data[key].title,
                link: data[key].link,
                status: data[key].status,
                category: data[key].category,
              }))
              .filter((a) => a.category === 'title' && a.status === 'Active' && !(a.title === 'Staff')) // Filter by active status
              .sort((a, b) => a.title.localeCompare(b.title));
            setTitles(titlesArray);
          } else {
            setTitles([]);
          }
        });

        // Fetching school name and Facebook link
        const accountRef = ref(database, 'account');
        onValue(accountRef, (snapshot) => {
          const accountData = snapshot.val();
          if (accountData) {
            const accountKeys = Object.keys(accountData);
            if (accountKeys.length > 0) {
              setSchoolName(accountData.schoolName); // Set school name
              setFacebookLink(accountData.facebook); // Set Facebook link
            }
          }
        });

        // Fetching user type
        if (session) {
          const userRef = ref(database, `userTypes`);
          onValue(userRef, (snapshot) => {
            const userData = snapshot.val();
            if (userData) {
              setUserType(userData.userType); // Set userType based on database
            }
          });
        }
      } catch (error) {
        console.error('Firebase Error:', error);
      }
    };

    fetchData();

    const handleScroll = () => {
      setIsSticky(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [session]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleOverlay = () => {
    setIsOverlayVisible(!isOverlayVisible);
  };

  const togglePopover = () => {
    setShowPopover(!showPopover);
  };

  const overlayToggle = () => {
    setIsOverlay(!isOverlay);
  };

  const handleClickOutside = (event) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target)) {
      setShowPopover(false);
    }
  };

  useEffect(() => {
    if (showPopover) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopover]);

  return (
    <header
      className={`fixed z-50 w-full bg-main text-white transition-all duration-500 ease-in-out ${
        isSticky ? 'top-0' : 'bottom-0  p-5'
      } ${!isSticky && 'hidden md:block'}`}
    >
      {isSticky && (
        <div className="top-0 w-full text-white p-0">
          <div className="container mx-auto flex text-sm font-thin p-2 mb-2 justify-between">
            <div className="flex-1 md:flex space-x-2 hidden">
              <span>Follow Us</span>
              {facebookLink && (
                <a
                  href={facebookLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-900"
                >
                  <FaFacebook className="h-5 w-5" />
                </a>
              )}
            </div>
            <div className="flex-1 text-right relative">
              {session ? (
                <div className="text-right">
                  <Link href="/admin/dashboard" className="inline-flex items-center space-x-2 text-white">
                    <FaHome />
                    <span className="pr-3">My Dashboard</span> |
                    <button onClick={() => signOut('google')} className="text-white p-1 rounded">
                      Sign Out
                    </button>
                  </Link>
                </div>
              ) : (
                <>
                  <span className="pr-3">Welcome Guest</span>|
                  <Link href="/admin/login">
                    <button className="text-white p-1 rounded">Sign In</button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <nav className="max-w-4xl mx-auto flex justify-between items-center p-4">
        <div className={`flex items-center space-x-2 ${isOpen ? 'hidden md:flex' : 'block'}`}>
          <h1 className="text-sm md:text-2xl font-normal uppercase flex">{schoolName}</h1>
        </div>

        {isSticky && (
          <div className="md:hidden">
            <button onClick={toggleOverlay} className="text-white focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        )}

        <ul className="hidden md:flex space-x-6 items-center">
          {titles.length > 0 &&
            titles.map((rw) => (
              <li key={rw.id} className="pt-4">
                <Link href={`${rw.link}`} passHref>
                  <div className="hover:text-gray-300 text-sm font-sans font-thin uppercase pb-2 border-b-2 border-transparent hover:border-white">
                    {rw.title}
                  </div>
                </Link>
              </li>
            ))}
          {userType !== 'student' && ( // Conditionally render the Apply Now button
            <li>
              <button
                onClick={overlayToggle}
                className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-tr-full rounded-br-full rounded-tl-full rounded-bl-md hover:bg-yellow-600 transition duration-300"
              >
                APPLY NOW
              </button>
            </li>
          )}
        </ul>
      </nav>
      <div
        className={`fixed top-0 right-0 w-full z-50 h-full bg-main3 transition-transform duration-500 ease-in-out ${
          isOverlay ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-center h-full p-10">
          <div className="text-white text-center">
            <h2 className="text-2xl md:text-4xl font-thin">Student Application</h2>
            <p className="mt-4 text-base md:text-lg">
              As a new student you can now apply online, click below to start the process.
            </p>
            <Link href="/admin/dashboard">
              <button className="inline-block mt-4 px-6 py-2 bg-main text-white rounded-full transition duration-300">
                Apply Now
              </button>
            </Link>
            <button onClick={overlayToggle} className="block mt-4 underline text-sm text-gray-400">
              Close
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
