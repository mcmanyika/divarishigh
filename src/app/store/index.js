import { createGlobalState } from 'react-hooks-global-state';

// Initial state including an email field
const initialState = {
  isOverlayVisible: false,
  user: null,
  schoolName: '',
  studentClass: '',
  userID: '',  // Changed from id to userID
  teacherId: '',
  userType: '',
  studentId: '',
  admissionId: '',
  status: '',
  routineCount: 0,
  email: '' // Added email field
};

const { useGlobalState, getGlobalState, setGlobalState } = createGlobalState(initialState);

// Setter functions
const setUser = (user) => setGlobalState('user', user);
const setSchoolName = (schoolName) => setGlobalState('schoolName', schoolName);
const setStudentClass = (studentClass) => setGlobalState('studentClass', studentClass);
const setStatus = (status) => setGlobalState('status', status);
const setUserID = (userID) => setGlobalState('userID', userID); // Changed from setId to setUserID
const setTeacherId = (teacherId) => setGlobalState('teacherId', teacherId);
const setAdmissionId = (admissionId) => setGlobalState('admissionId', admissionId);
const setStudentId = (studentId) => setGlobalState('studentId', studentId);
const setUserType = (userType) => setGlobalState('userType', userType);
const setRoutineCount = (routineCount) => setGlobalState('routineCount', routineCount);
const setIsOverlayVisible = (isOverlayVisible) => setGlobalState('isOverlayVisible', isOverlayVisible);

// New setter function for email
const setEmail = (email) => setGlobalState('email', email); // Added function to set email

// Exporting everything including the new email setter
export { 
  useGlobalState, 
  getGlobalState, 
  setUser,
  setSchoolName,
  setStudentClass,
  setStatus,
  setUserType,
  setUserID,  // Exported updated function
  setAdmissionId,
  setStudentId,
  setTeacherId,
  setRoutineCount,
  setIsOverlayVisible,
  setEmail // Exporting the new email setter
};
