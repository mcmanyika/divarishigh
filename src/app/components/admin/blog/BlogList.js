import React, { useEffect, useState } from 'react';
import { ref, get, remove } from 'firebase/database'; // Import remove
import { database } from '../../../../../utils/firebaseConfig'; // Adjust the path if needed
import { useRouter } from 'next/router'; // Import useRouter

const BlogList = () => {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5); // Number of posts per page
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [postToDelete, setPostToDelete] = useState(null); // Post to delete

  useEffect(() => {
    const fetchPosts = async () => {
      const postsRef = ref(database, 'blogs'); // Reference to the blogs node
      const snapshot = await get(postsRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const formattedPosts = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        // Sort posts by createdAt in descending order
        formattedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(formattedPosts);
      }
    };

    fetchPosts();
  }, []);

  // Calculate total pages
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  // Get current posts for the current page
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Show confirmation modal
  const handleDeleteClick = (postId) => {
    setPostToDelete(postId); // Set the post to be deleted
    setShowModal(true); // Show the modal
  };

  // Delete post after confirmation
  const handleConfirmDelete = async () => {
    const postRef = ref(database, `blogs/${postToDelete}`);
    await remove(postRef); // Remove the post from Firebase

    // Update the post list
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postToDelete));
    setShowModal(false); // Close the modal
    setPostToDelete(null); // Reset the post to delete
  };

  // Close the modal without deleting
  const handleCancelDelete = () => {
    setShowModal(false);
    setPostToDelete(null);
  };

  return (
    <div className="text-sm p-6 bg-white mt-4 rounded">
      <h1 className="text-2xl font-bold mb-4">Blog Posts</h1>

      <table className="min-w-full border-collapse table-auto text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Created At</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((post) => (
            <tr key={post.id}>
              <td className="border px-4 py-2">{post.title}</td>
              <td className="border px-4 py-2">{post.category}</td>
              <td className="border px-4 py-2">{new Date(post.createdAt).toLocaleString()}</td>
              <td className="border px-4 py-2">{post.status}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => router.push(`/admin/blogs/${post.id}`)} // Navigate to EditBlog
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(post.id)} // Trigger the modal for confirmation
                  className="bg-red-500 text-white px-3 py-1 ml-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
          disabled={currentPage === totalPages}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this blog post?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleCancelDelete}
                className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogList;
