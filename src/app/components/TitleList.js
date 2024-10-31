// components/TitleList.js

import Link from 'next/link';
import { FaSignOutAlt, FaTachometerAlt, FaPencilRuler, FaCalendarAlt, FaClipboardList, FaUserGraduate, FaHome, FaCashRegister } from 'react-icons/fa';
import { MdOutlineLibraryBooks } from 'react-icons/md';
import { LiaChalkboardTeacherSolid } from 'react-icons/lia';
import { IoPeopleOutline } from 'react-icons/io5';
import { RiAdminFill } from 'react-icons/ri';
import PropTypes from 'prop-types';

const iconMapping = {
  FaTachometerAlt: FaTachometerAlt,
  FaPencilRuler: FaPencilRuler,
  FaCalendarAlt: FaCalendarAlt,
  FaClipboardList: FaClipboardList,
  FaUserGraduate: FaUserGraduate,
  MdOutlineLibraryBooks: MdOutlineLibraryBooks,
  LiaChalkboardTeacherSolid: LiaChalkboardTeacherSolid,
  IoPeopleOutline: IoPeopleOutline,
  RiAdminFill: RiAdminFill,
  FaHome: FaHome,
  FaCashRegister: FaCashRegister,
};

const TitleList = ({ titles, onSignOut }) => {
  // Separate "Dashboard" from other titles
  const dashboard = titles.find((rw) => rw.title === 'Dashboard');
  const otherTitles = titles.filter((rw) => rw.title !== 'Dashboard').sort((a, b) => a.title.localeCompare(b.title));

  return (
    <ul className="flex flex-col">
      {/* Dashboard at the top */}
      {dashboard && (
        <li key={dashboard.id} className="mb-4 flex flex-col items-center">
          <Link href={dashboard.link} className="flex flex-col items-center" aria-label={dashboard.title}>
            {(iconMapping[dashboard.icon] || iconMapping.default)({ className: 'text-2xl' })}
            <div className="text-center font-thin p-2 cursor-pointer w-full capitalize">{dashboard.title}</div>
          </Link>
        </li>
      )}

      {/* Other titles in alphabetical order */}
      {otherTitles.map((rw) => {
        const IconComponent = iconMapping[rw.icon] || iconMapping.default;
        return (
          <li key={rw.id} className="mb-4 flex flex-col items-center">
            <Link href={rw.link} className="flex flex-col items-center" aria-label={rw.title}>
              <IconComponent className="text-2xl" />
              <div className="text-center font-thin p-2 cursor-pointer w-full capitalize">{rw.title}</div>
            </Link>
          </li>
        );
      })}

      {/* Sign Out button */}
      <li className="mb-4 flex flex-col items-center">
        <FaSignOutAlt className="text-2xl" />
        <button
          onClick={onSignOut}
          className="text-center font-thin p-2 rounded cursor-pointer w-full"
          aria-label="Sign Out"
        >
          Sign Out
        </button>
      </li>
    </ul>
  );
};

TitleList.propTypes = {
  titles: PropTypes.array.isRequired,
  onSignOut: PropTypes.func.isRequired,
};

export default TitleList;
