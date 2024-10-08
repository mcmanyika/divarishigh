import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../../../utils/firebaseConfig'; // Assuming firebaseConfig is set up properly
import { useGlobalState, setIsOverlayVisible } from '../store';
import { useSession, signIn, signOut } from 'next-auth/react';
import { FaFacebook, FaHome } from 'react-icons/fa';

const Header2 = () => {
  const { data: session } = useSession();
  const [titles, setTitles] = useState([]);
  const [schoolName, setSchoolName] = useState('');
  const [facebookLink, setFacebookLink] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isOverlayVisible] = useGlobalState('isOverlayVisible');
  const [isOverlay, setIsOverlay] = useState(false);

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
              .filter(a => a.category === 'title' && a.status === 'Active' && !(a.title === 'Staff')) // Filter by active status
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
      } catch (error) {
        console.error('Firebase Error:', error);
      }
    };
  
    fetchData();
  
    
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const toggleOverlay = () => setIsOverlayVisible(!isOverlayVisible);

  const overlayToggle = () => {
    setIsOverlay(!isOverlay);
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-main text-white font-thin pb-4 transition-all duration-500 ease-in-out">
      <div className='top-0 w-full text-white p-0'>
        <div className='container mx-auto flex text-sm font-thin p-2 mb-2 justify-between'>
          <div className='flex-1 md:flex space-x-2 hidden'>
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
          <div className='flex-1 text-right relative'>
            {session ? (
              <div className="text-right">
                <Link href="/admin/dashboard" className="inline-flex items-center space-x-2 text-white">
                  <FaHome />
                  <span className='pr-3'>My Dashboard</span> |
                  <button onClick={() => signOut()} className="text-white p-1 rounded">
                    Sign Out
                  </button>
                </Link>
              </div>
            ) : (
              <>
                <span className='pr-3'>Welcome Guest</span> |
                <Link href='/admin/login'>
                  <button className="text-white p-1 rounded">
                    Sign In
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <nav className="max-w-5xl mx-auto flex justify-between items-center">
        <div className="flex items-center w-4/5 space-x-2">
          <Link href='/'>
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={50}
              height={50}
              className="rounded"
            />
          </Link>
          <h1 className={`text-sm md:text-xl font-normal uppercase ${isOpen ? 'hidden' : 'block'}`}>{schoolName}</h1>
        </div>
        <ul className={`md:flex ${isOpen ? 'flex' : 'hidden'} md:space-x-4 md:w-full mt-4 md:mt-0 text-right`}>
          {titles.map((rw) => (
            <li key={rw.id}>
              <div className="cursor-pointer py-2 px-4 hover:text-gray-300 text-sm font-sans font-thin uppercase" onClick={toggleMenu}>
                <Link href={rw.link}>
                <div className="hover:text-gray-300 text-sm font-sans font-thin uppercase pb-2 border-b-2 border-transparent hover:border-white">{rw.title}</div>
                </Link>
              </div>
            </li>
          ))}
          <li>
              <button
                onClick={overlayToggle}
                className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-tr-full rounded-br-full rounded-tl-full rounded-bl-md hover:bg-yellow-600 transition duration-300"
              >
                APPLY NOW
              </button>
            </li>
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
            <button
              onClick={overlayToggle}
              className="absolute top-4 right-4 text-white text-xl font-semibold"
            >
              &times; {/* Close icon */}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header2;
