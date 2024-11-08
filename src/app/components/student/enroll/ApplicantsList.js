import React, { useState, useEffect } from 'react';
import { database } from '../../../../../utils/firebaseConfig';
import { ref, get } from 'firebase/database';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import withAuth from '../../../../../utils/withAuth';

const EnrollmentList = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null); // State for selected enrollment
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const dbRef = ref(database, 'enrollments');
        const snapshot = await get(dbRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const enrollmentsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));

          enrollmentsArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setEnrollments(enrollmentsArray);
        } else {
          toast.info('No enrollments found.');
        }
      } catch (error) {
        console.error('Error fetching enrollments:', error);
        toast.error('Failed to fetch enrollments.');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredEnrollments = enrollments.filter((enrollment) =>
    enrollment.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.class?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEnrollments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEnrollments.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const openModal = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEnrollment(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full border-4 border-blue-500 border-t-transparent w-16 h-16"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white h-screen">
      <h2 className="text-2xl font-semibold mb-4">All Enrollment Applications</h2>

      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by name, class, or email"
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>

      {currentItems.length === 0 ? (
        <div className="text-center text-xl text-gray-500">No enrollments available.</div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {currentItems.map((enrollment) => (
            <div
              key={enrollment.id}
              className="border p-4 bg-white rounded-lg shadow-md cursor-pointer"
              onClick={() => openModal(enrollment)}
            >
              <div className="font-semibold text-lg">Class: {enrollment.class}</div>
              <div className="text-gray-700 capitalize"><strong>Full Name:</strong> {enrollment.firstName} {enrollment.lastName}</div>
              <div className="text-gray-700">Contact Email: {enrollment.contactEmail}</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {isModalOpen && selectedEnrollment && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h3 className="text-xl font-semibold mb-4">Enrollment Details</h3>
            <p className='capitalize'><strong>First Name:</strong> {selectedEnrollment.firstName}</p>
            <p className='capitalize'><strong>Last Name:</strong> {selectedEnrollment.lastName}</p>
            <p><strong>Class:</strong> {selectedEnrollment.class}</p>
            <p><strong>Contact Email:</strong> {selectedEnrollment.contactEmail}</p>
            <p><strong>Contact Phone:</strong> {selectedEnrollment.contactPhone}</p>
            <p className='capitalize'><strong>Parent Name:</strong> {selectedEnrollment.parentName}</p>
            <p><strong>Parent Phone:</strong> {selectedEnrollment.parentPhone}</p>
            <p className='capitalize'><strong>Previous School:</strong> {selectedEnrollment.academicPreviousSchool}</p>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentList;
