import React, { useState, useEffect } from 'react';
import { storage, database } from '../../../../../utils/firebaseConfig'; // Adjust the path as necessary
import { ref, set } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EnrollmentDetailsForm = () => {
  const [formData, setFormData] = useState({
    enrollmentDate: '',
    studentClassLevel: '',
    contactEmail: '',
    contactPhone: '',
    parentName: '',
    parentPhone: '',
    academicPreviousSchool: '',
    academicGrade: '',
  });

  const [additionalDocuments, setAdditionalDocuments] = useState({
    birthCertificate: null,
    proofOfResidence: null,
    transcript: null,
  });

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDocumentUpload = (e) => {
    const { name, files } = e.target;
    if (files.length) {
      setAdditionalDocuments((prevDocs) => ({
        ...prevDocs,
        [name]: files[0],
      }));
    }
  };

  const uploadFileAndGetUrl = async (file, path) => {
    const fileRef = storageRef(storage, path);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  };

  useEffect(() => {
    const allDocumentsUploaded = Object.values(additionalDocuments).every((doc) => doc !== null);
    setIsSubmitDisabled(!allDocumentsUploaded);
  }, [additionalDocuments]);

  // Helper function to sanitize email
const sanitizeEmail = (email) => email.replace(/\./g, ',');

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Upload each document and collect their URLs
    const documentUrls = await Promise.all(
      Object.entries(additionalDocuments).map(async ([key, file]) => {
        if (file) {
          const filePath = `enrollment_documents/${formData.contactEmail}/${key}`;
          try {
            return { [key]: await uploadFileAndGetUrl(file, filePath) };
          } catch (uploadError) {
            console.error(`Error uploading ${key}:`, uploadError);
            throw new Error(`Failed to upload ${key}`);
          }
        }
        return null;
      })
    ).then((results) => results.reduce((acc, curr) => ({ ...acc, ...curr }), {}));

    const enrollmentData = {
      ...formData,
      additionalDocuments: documentUrls,
    };

    // Sanitize the email before using it in the path
    const sanitizedEmail = sanitizeEmail(formData.contactEmail);
    const dbRef = ref(database, `enrollments/${sanitizedEmail}`);

    try {
      await set(dbRef, enrollmentData);
    } catch (databaseError) {
      console.error('Error saving data to database:', databaseError);
      throw new Error('Failed to save enrollment data');
    }

    toast.success('Enrollment details submitted successfully!');
    setFormData({
      enrollmentDate: '',
      studentClassLevel: '',
      contactEmail: '',
      contactPhone: '',
      parentName: '',
      parentPhone: '',
      academicPreviousSchool: '',
      academicGrade: '',
    });
    setAdditionalDocuments({
      birthCertificate: null,
      proofOfResidence: null,
      transcript: null,
    });
    setIsSubmitDisabled(true);
  } catch (error) {
    console.error('Error during form submission:', error);
    toast.error(`Failed to submit enrollment details: ${error.message}`);
  }
};

  

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-6 bg-white shadow-lg rounded-lg max-w-2xl w-full">
        <h2 className="text-2xl font-semibold mb-4">Enrollment Details</h2>
        <form onSubmit={handleSubmit}>
          {/* Enrollment Details */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Enrollment Date</label>
              <input
                type="date"
                name="enrollmentDate"
                value={formData.enrollmentDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Class Level</label>
              <select
                name="studentClassLevel"
                value={formData.studentClassLevel}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="" disabled>Select Class Level...</option>
                <option value="Form 1">Form 1</option>
                <option value="Form 2">Form 2</option>
                <option value="O' Level">O Level</option>
                <option value="A' Level">A Level</option>
              </select>
            </div>
          </div>

          {/* Contact Information */}
          <h3 className="text-xl font-semibold mt-6 mb-2">Contact Information</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          </div>

          {/* Parent/Guardian Information */}
          <h3 className="text-xl font-semibold mt-6 mb-2">Parent/Guardian Information</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Parent/Guardian Name</label>
              <input
                type="text"
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Parent/Guardian Phone</label>
              <input
                type="tel"
                name="parentPhone"
                value={formData.parentPhone}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          </div>

          {/* Academic Information */}
          <h3 className="text-xl font-semibold mt-6 mb-2">Academic Information</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Previous School</label>
              <input
                type="text"
                name="academicPreviousSchool"
                value={formData.academicPreviousSchool}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Grade</label>
              <input
                type="text"
                name="academicGrade"
                value={formData.academicGrade}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          {/* Additional Documents */}
          <h3 className="text-xl font-semibold mt-6 mb-2">Additional Documents</h3>
          <div className="grid grid-cols-1 gap-4">
            {['birthCertificate', 'proofOfResidence', 'transcript'].map((doc) => (
              <div key={doc}>
                <label className="block text-gray-700 mb-1">
                  Upload {doc.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, str => str.toUpperCase())}
                </label>
                <input
                  type="file"
                  name={doc}
                  onChange={handleDocumentUpload}
                  className="w-full p-2 border border-gray-300 rounded"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className={`w-full p-2 bg-blue-500 text-white rounded ${
                isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
              disabled={isSubmitDisabled}
            >
              Submit Enrollment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnrollmentDetailsForm;
