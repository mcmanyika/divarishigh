import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';
import { useGlobalState } from '../../../store';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AcademicProgress = () => {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studentId] = useGlobalState('studentId');

  useEffect(() => {
    if (!studentId) return;

    const progressRef = ref(database, `userTypes/${studentId}/academicProgress`);
    const unsubscribe = onValue(progressRef, (snapshot) => {
      if (snapshot.exists()) {
        setProgressData(snapshot.val());
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching progress:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [studentId]);

  if (loading) {
    return <div className="animate-pulse">Loading progress...</div>;
  }

  const chartData = {
    labels: progressData?.performanceTrend?.map(item => item.month) || [],
    datasets: [{
      label: 'Performance',
      data: progressData?.performanceTrend?.map(item => item.score) || [],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Academic Performance Trend'
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100
      }
    }
  };

  return (
    <div className="grid md:grid-cols-1 gap-6">
      
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-slate-800">
        <div className="p-4 border-b border-gray-100 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Subject Performance</h3>
        </div>
        <div className="p-4 space-y-4">
          {progressData?.subjectPerformance && 
            Object.entries(progressData.subjectPerformance).map(([subject, progress]) => (
              <SubjectProgress 
                key={subject}
                subject={subject}
                progress={progress}
              />
            ))
          }
        </div>
      </div>
    </div>
  );
};

const SubjectProgress = ({ subject, progress }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{subject}</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className="bg-main3 dark:bg-main2 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default AcademicProgress;