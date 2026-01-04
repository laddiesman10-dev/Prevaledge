import React, { useMemo } from 'react';
import type { Project, Task, ArchivedDocument } from '../../types';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import AnimatedMetric from '../ui/AnimatedMetric';
import ProjectTimelineChart from '../admin/ProjectTimelineChart';
import AlertTriangleIcon from '../icons/AlertTriangleIcon';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface ProjectDashboardProps {
  project: Project;
  tasks: Task[];
  hasOverdueTasks: boolean;
}

const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ project, tasks, hasOverdueTasks }) => {

  const taskStatusData = useMemo(() => {
    const counts = { 'To Do': 0, 'In Progress': 0, 'Done': 0 };
    tasks.forEach(task => {
      counts[task.status]++;
    });
    return {
      labels: ['To Do', 'In Progress', 'Done'],
      datasets: [{
        data: [counts['To Do'], counts['In Progress'], counts['Done']],
        backgroundColor: ['#f59e0b40', '#3b82f640', '#10b98140'],
        borderColor: ['#f59e0b', '#3b82f6', '#10b981'],
        borderWidth: 1,
      }],
    };
  }, [tasks]);

  const taskPriorityData = useMemo(() => {
    const counts = { 'Low': 0, 'Medium': 0, 'High': 0 };
    tasks.forEach(task => {
      counts[task.priority]++;
    });
    return {
      labels: ['Low', 'Medium', 'High'],
      datasets: [{
        label: 'Tasks by Priority',
        data: [counts['Low'], counts['Medium'], counts['High']],
        backgroundColor: ['#3b82f680', '#f59e0b80', '#ef444480'],
        borderColor: ['#3b82f6', '#f59e0b', '#ef4444'],
        borderWidth: 1,
      }],
    };
  }, [tasks]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { color: '#94a3b8' }
      }
    }
  };

  const barChartOptions = {
    ...chartOptions,
    plugins: { ...chartOptions.plugins, legend: { display: false } },
    scales: {
        y: { ticks: { color: '#94a3b8', stepSize: 1 } }, 
        x: { ticks: { color: '#94a3b8' } }
    }
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 mb-6 animate-fade-in">
      <h3 className="text-3xl font-bold text-blue-300 mb-6 flex items-center gap-3">
        {project.title}
        {hasOverdueTasks && <span title="This project has overdue tasks" className="flex items-center gap-1 text-xs font-semibold text-red-400 bg-red-900/50 px-2 py-1 rounded-full"><AlertTriangleIcon className="w-4 h-4" /> Overdue</span>}
      </h3>

      {project.caseStudy.keyMetrics && project.caseStudy.keyMetrics.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mb-8 p-6 bg-slate-800/40 border border-slate-700/50 rounded-lg">
          {project.caseStudy.keyMetrics.map(metric => (
            <AnimatedMetric key={metric.label} value={metric.value} label={metric.label} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-800/40 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-center text-slate-200 mb-4">Task Status</h4>
            <div className="h-64 relative">
              {tasks.length > 0 ? <Doughnut data={taskStatusData} options={chartOptions} /> : <p className="text-center text-slate-500 pt-20">No tasks</p>}
            </div>
          </div>
          <div className="bg-slate-800/40 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-center text-slate-200 mb-4">Task Priority</h4>
            <div className="h-64 relative">
              {tasks.length > 0 ? <Bar data={taskPriorityData} options={barChartOptions} /> : <p className="text-center text-slate-500 pt-20">No tasks</p>}
            </div>
          </div>
      </div>
      
       <div className="mt-8 bg-slate-800/40 p-4 rounded-lg">
        <h4 className="text-lg font-semibold text-center text-slate-200 mb-4">Project Timeline</h4>
        <div className="h-96 relative">
          {tasks.length > 0 ? <ProjectTimelineChart tasks={tasks} /> : <p className="text-center text-slate-500 pt-32">No tasks to display on timeline</p>}
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;