import React, { useState, useEffect } from 'react';
import { database } from '../../../../../utils/firebaseConfig'; // Ensure this path is correct
import { ref, get } from 'firebase/database';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import withAuth from '../../../../../utils/withAuth';

const EnrollmentList = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Change this to adjust the number of items per page

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

          // Sort enrollments by timestamp in descending order
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
    setCurrentPage(1); // Reset to page 1 when searching
  };

  // Filter enrollments based on the search term
  const filteredEnrollments = enrollments.filter((enrollment) =>
    enrollment.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.class?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEnrollments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEnrollments.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full border-4 border-blue-500 border-t-transparent w-16 h-16"></div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">All Enrollment Applications</h2>

      {/* Search input */}
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
              className="border p-4 bg-white rounded-lg shadow-md"
            >
              <div className="font-semibold text-lg">Class: {enrollment.class}</div>
              <div className="text-gray-700">First Name: {enrollment.firstName}</div>
              <div className="text-gray-700">Last Name: {enrollment.lastName}</div>
              <div className="text-gray-700">Contact Email: {enrollment.contactEmail}</div>
              <div className="text-gray-700">Contact Phone: {enrollment.contactPhone}</div>
              <div className="text-gray-700">Parent Name: {enrollment.parentName}</div>
              <div className="text-gray-700">Parent Phone: {enrollment.parentPhone}</div>
              <div className="text-gray-700">Previous School: {enrollment.academicPreviousSchool}</div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === index + 1
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default withAuth(EnrollmentList);
