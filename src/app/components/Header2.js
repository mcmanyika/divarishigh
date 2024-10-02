import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../../../utils/firebaseConfig'; // Assuming you have firebaseConfig set up properly
import { useGlobalState, setIsOverlayVisible } from '../store';
import { useSession, signIn, signOut } from 'next-auth/react';
import { FaFacebook, FaHome } from 'react-icons/fa';

const Header2 = () => {
  const { data: session } = useSession();
  const [titles, setTitles] = useState([]);
  const [schoolName, setSchoolName] = useState(''); // State for school name
  const [facebookLink, setFacebookLink] = useState(''); // State for Facebook link
  const [isOpen, setIsOpen] = useState(false); // State to manage mobile menu visibility
  const [isOverlayVisible] = useGlobalState('isOverlayVisible');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching titles
        const titleRef = ref(database, 'title'); // Reference to 'title' collection in Firebase
        const statusQuery = query(titleRef, orderByChild('status'), equalTo('Active')); // Query to filter by status 'Active'

        onValue(statusQuery, (snapshot) => {
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
              .filter(a => a.category === 'title')
              .sort((a, b) => {
                if (a.title === 'Admissions') return 1; // Move 'Admissions' to the end
                if (b.title === 'Admissions') return -1; // Move 'Admissions' to the end
                if (a.title === 'Alumni') return 1; // Move 'Alumni' to the end
                if (b.title === 'Alumni') return -1; // Move 'Alumni' to the end
                return a.title.localeCompare(b.title); // Sort other titles alphabetically
              });
            setTitles(titlesArray);
          } else {
            setTitles([]); // Handle no data case
          }
        });

        // Fetching school name and Facebook link from the 'account' table
        const accountRef = ref(database, 'account');
        onValue(accountRef, (snapshot) => {
          const accountData = snapshot.val();
          if (accountData) {
            const accountKeys = Object.keys(accountData);
            if (accountKeys.length > 0) {
              const account = accountData[accountKeys[0]]; // Assuming there's only one account entry
              setSchoolName(account.schoolName); // Set the school name
              setFacebookLink(account.facebook); // Set the Facebook link
            }
          }
        });
      } catch (error) {
        console.error('Firebase Error:', error);
        // Handle error fetching data
      }
    };

    fetchData();
  }, []);

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
              .filter(a => a.category === 'title')
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

    const handleScroll = () => {
      setIsSticky(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Function to toggle mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleOverlay = () => {
    setIsOverlayVisible(!isOverlayVisible);
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
                    <span className='pr-3'>My Dashboard </span> |
                    <button
                      onClick={() => signOut('google')}
                      className="text-white p-1 rounded"
                    >
                      Sign Out
                    </button>
                  </Link>
                </div>
              ) : (
                <>
                  <span className='pr-3'>Welcome Guest</span>|
                  <Link href='/admin/login'>
                    <button className="text-white p-1 rounded ">
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
                <Link href={`${rw.link}`}>
                  <span>{rw.title}</span>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header2;
