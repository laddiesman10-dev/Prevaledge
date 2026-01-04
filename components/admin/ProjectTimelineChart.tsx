import React, { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { Task } from '../../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ProjectTimelineChartProps {
  tasks: Task[];
}

const statusColors = {
  'To Do': 'rgba(245, 158, 11, 0.7)', // amber-500
  'In Progress': 'rgba(59, 130, 246, 0.7)', // blue-500
  'Done': 'rgba(16, 185, 129, 0.7)', // emerald-500
};

const ProjectTimelineChart: React.FC<ProjectTimelineChartProps> = ({ tasks }) => {
  const chartData = useMemo(() => {
    if (!tasks || tasks.length === 0) {
      return { labels: [], datasets: [] };
    }

    const sortedTasks = [...tasks].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    return {
      labels: sortedTasks.map(t => t.title),
      datasets: [
        {
          label: 'Task Duration',
          data: sortedTasks.map(t => [new Date(t.createdAt).getTime(), new Date(t.dueDate).getTime()]),
          backgroundColor: sortedTasks.map(t => statusColors[t.status]),
          borderColor: sortedTasks.map(t => t.status === 'In Progress' ? '#60a5fa' : 'transparent'),
          borderWidth: 2,
          borderSkipped: false,
        },
      ],
    };
  }, [tasks]);

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const startDate = new Date(context.raw[0]).toLocaleDateString();
            const endDate = new Date(context.raw[1]).toLocaleDateString();
            return `Start: ${startDate} | Due: ${endDate}`;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'linear' as const,
        min: tasks.length > 0 ? Math.min(...tasks.map(t => new Date(t.createdAt).getTime())) : undefined,
        ticks: {
          color: '#94a3b8',
          callback: function(value: any) {
            return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          },
        },
        grid: {
            color: 'rgba(255, 255, 255, 0.1)',
        }
      },
      y: {
        ticks: { color: '#cbd5e1' },
         grid: {
            display: false,
        }
      },
    },
  };

  return <Bar options={options} data={chartData} />;
};

export default ProjectTimelineChart;
