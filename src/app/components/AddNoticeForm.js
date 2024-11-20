'use client';
import { useState } from "react";
import { ref, push } from "firebase/database";
import { database } from "../../../utils/firebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from 'next-auth/react';

const AddNoticeForm = () => {
  const { data: session } = useSession();
  const postedBy = session.user.name;

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [postedByState, setPostedBy] = useState(postedBy); // Corrected state name
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const noticeData = {
      title,
      details,
      postedBy: postedByState, // Using correct state variable
      date
    };

    try {
      await push(ref(database, "notices"), noticeData);
      toast.success("Notice added successfully!");
      // Clear the form
      setTitle("");
      setDetails("");
      setPostedBy(postedBy); // Reset postedBy to session user's name
      setDate("");
    } catch (error) {
      console.error("Error adding notice: ", error);
      toast.error("Failed to add notice. Please try again.");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 shadow-lg rounded-xl p-6 transition-colors duration-200">
      <div className="text-2xl font-bold pb-4 text-gray-800 dark:text-white">
        Create A Notice
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-main3/50 dark:focus:ring-main2/50 focus:border-transparent transition-colors duration-200"
            placeholder="Enter notice title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Details
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows="4"
            className="mt-1 block w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-main3/50 dark:focus:ring-main2/50 focus:border-transparent transition-colors duration-200"
            placeholder="Enter notice details"
          />
        </div>
        <input
          type="hidden"
          value={postedByState}
          onChange={(e) => setPostedBy(e.target.value)}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-main3/50 dark:focus:ring-main2/50 focus:border-transparent transition-colors duration-200"
          />
        </div>
        <button
          type="submit"
          className="w-full mt-6 bg-main3 hover:bg-main2 text-white py-2.5 px-6 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-main3/50 dark:focus:ring-main2/50 focus:outline-none"
        >
          Add Notice
        </button>
      </form>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="dark:bg-slate-800 dark:text-white"
      />
    </div>
  );
};

export default AddNoticeForm;
