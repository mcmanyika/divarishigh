import { ref, set } from 'firebase/database';
import { database } from './firebaseConfig';

export const initializeStudentData = async (studentId) => {
  const studentRef = ref(database, `userTypes/${studentId}`);
  
  const initialData = {
    stats: {
      attendance: { value: '0%', trend: '0%', status: 'neutral' },
      grade: { value: '0', trend: '0', status: 'neutral' },
      pending: { value: '0', trend: '0', status: 'neutral' },
      upcoming: { value: '0', trend: '0', status: 'neutral' }
    },
    academicProgress: {
      performanceTrend: [
        { month: 'Jan', score: 0 },
        { month: 'Feb', score: 0 },
        { month: 'Mar', score: 0 },
        { month: 'Apr', score: 0 },
        { month: 'May', score: 0 },
        { month: 'Jun', score: 0 }
      ],
      subjectPerformance: {
        Mathematics: 0,
        Science: 0,
        English: 0,
        History: 0
      }
    },
    deadlines: {
      '1': {
        id: '1',
        title: 'No deadlines',
        subject: 'None',
        dueDate: new Date().toISOString().split('T')[0],
        type: 'none',
        priority: 'low'
      }
    }
  };

  try {
    await set(studentRef, initialData);
    console.log('Student data initialized successfully');
  } catch (error) {
    console.error('Error initializing student data:', error);
  }
};