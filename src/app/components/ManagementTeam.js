import React from 'react';
import Image from 'next/image';

const teamMembers = [
  { name: 'Mr Matemayi', role: 'Principal', imageUrl: '/images/matemayi.png' },
  { name: 'Ms Huni', role: 'Administrator', imageUrl: '/images/huni.png' },
  { name: 'Mr Tsikayi', role: 'Sciences (HOD)', imageUrl: '/images/tsikayi.png' },
  { name: 'Mrs Nendere', role: 'Commercials (HOD)', imageUrl: '/images/nendere.png' },
  { name: 'Mrs Jonga', role: 'Arts (HOD)', imageUrl: '/images/jonga.png' },
];

const ManagementTeam = () => {
  return (
    <div className="bg-main2 p-4">
      <div className="text-2xl md:text-4xl text-center font-thin w-full p-5">Our Management Team</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {teamMembers.map((member, index) => (
          <div key={index} className="flex flex-col items-center p-4">
            <div className="relative w-32 h-32 md:w-48 md:h-48 mb-2">
              <Image
                src={member.imageUrl}
                alt={member.name}
                fill
                className="rounded-full object-cover"
              />
              <div className="absolute inset-0 bg-main3 opacity-20 rounded-full"></div>
            </div>
            <div className="text-lg font-semibold">{member.name}</div>
            <div className="text-base font-thin text-gray-600">{member.role}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagementTeam;
