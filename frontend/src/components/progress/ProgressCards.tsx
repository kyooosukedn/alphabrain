import React from 'react';
import { motion } from 'framer-motion';
import { Target, Brain, Clock } from 'lucide-react';

interface ProgressMetric {
  label: string;
  value: string | number;
  icon: React.ElementType;
  change?: string;
  color: string;
}

const ProgressCard: React.FC<ProgressMetric> = ({ 
  label, value, icon: Icon, change, color 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-xl ${color}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm opacity-80">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change && (
            <p className="text-sm mt-1 opacity-70">{change}</p>
          )}
        </div>
        <div className="p-2 bg-white/10 rounded-lg">
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
};

export default function ProgressCards() {
  const metrics: ProgressMetric[] = [
    {
      label: 'Study Time',
      value: '12.5 hrs',
      icon: Clock,
      change: '+2.5 hrs this week',
      color: 'bg-violet-900/90'
    },
    {
      label: 'Topics Completed',
      value: 8,
      icon: Target,
      change: '2 more than last week',
      color: 'bg-blue-900/90'
    },
    {
      label: 'Focus Score',
      value: '85%',
      icon: Brain,
      change: 'Top 10% of users',
      color: 'bg-emerald-900/90'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <ProgressCard key={index} {...metric} />
      ))}
    </div>
  );
}