import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
  Plus, Calendar, Clock, Brain, 
  GraduationCap, AlertCircle
} from 'lucide-react';

interface StudyEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  subject: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  color?: string;
}

const Schedule = () => {
  const [events, setEvents] = useState<StudyEvent[]>([
    {
      id: '1',
      title: 'Mathematics - Calculus',
      start: new Date('2024-03-13T10:00:00'),
      end: new Date('2024-03-13T12:00:00'),
      subject: 'Mathematics',
      difficulty: 'MEDIUM',
      color: '#8b5cf6'
    },
    
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');

  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    date: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
    duration: '60',
    difficulty: 'MEDIUM' as 'EASY' | 'MEDIUM' | 'HARD'
  });

  const subjectColors = {
    Mathematics: '#8b5cf6',
    Physics: '#3b82f6',
    Chemistry: '#10b981',
    Biology: '#f59e0b',
    Literature: '#ec4899'
  };

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEvent: StudyEvent = {
      id: Math.random().toString(36).substr(2, 9), // Simple ID generation
      title: `${formData.subject} - ${formData.topic}`,
      start: new Date(formData.date),
      end: new Date(new Date(formData.date).getTime() + parseInt(formData.duration) * 60000),
      subject: formData.subject,
      difficulty: formData.difficulty,
      color: subjectColors[formData.subject as keyof typeof subjectColors]
    };
  
    setEvents([...events, newEvent]);
    setIsCreateModalOpen(false);
    // Reset form
    setFormData({
      subject: '',
      topic: '',
      date: '',
      duration: '60',
      difficulty: 'MEDIUM'
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold">Study Schedule</h1>
          <p className="text-gray-400">Plan and organize your study sessions</p>
        </div>

        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-violet-500 hover:bg-violet-600 rounded-lg 
                     flex items-center gap-2 font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Session
          </motion.button>

          <div className="flex gap-2 bg-white/5 p-1 rounded-lg">
            {['calendar', 'list'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v as typeof view)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  view === v 
                    ? 'bg-white/10 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Upcoming Sessions',
            value: '8',
            icon: Calendar,
            color: 'from-violet-500 to-purple-600'
          },
          {
            label: 'Study Hours Planned',
            value: '24h',
            icon: Clock,
            color: 'from-blue-500 to-cyan-600'
          },
          {
            label: 'Subjects This Week',
            value: '5',
            icon: Brain,
            color: 'from-emerald-500 to-green-600'
          },
          {
            label: 'Next Session',
            value: 'In 2 hours',
            icon: AlertCircle,
            color: 'from-orange-500 to-red-600'
          }
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-br ${stat.color} rounded-xl p-4`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-white/80">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Calendar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/5 rounded-xl p-6"
      >
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          editable={true}
          droppable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          height="auto"
          select={(info) => {
            setSelectedDate(info.start);
            setIsCreateModalOpen(true);
          }}
          eventDrop={(info) => {
            // Handle event drag
            const updatedEvents = events.map(event => 
              event.id === info.event.id 
                ? {
                    ...event,
                    start: info.event.start || event.start,
                    end: info.event.end || event.end
                  }
                : event
            );
            setEvents(updatedEvents);
          }}
          eventResize={(info) => {
            // Handle event resize
            const updatedEvents = events.map(event => 
              event.id === info.event.id 
                ? {
                    ...event,
                    start: info.event.start || event.start,
                    end: info.event.end || event.end
                  }
                : event
            );
            setEvents(updatedEvents);
          }}
          // Custom styling
          themeSystem="standard"
          slotMinTime="06:00:00"
          slotMaxTime="22:00:00"
        />
      </motion.div>

      {/* Create Session Modal */}
    {isCreateModalOpen && (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={() => setIsCreateModalOpen(false)} // Close when clicking backdrop
    >
        <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 rounded-xl p-6 w-full max-w-md"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking modal content
        >
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Create Study Session</h2>
            <button
            onClick={() => setIsCreateModalOpen(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
            ×
            </button>
        </div>

        <form className="space-y-6" onSubmit={handleCreateSession}>
            <div className="space-y-2">
            <label className="text-sm text-gray-300">Subject</label>
            <select 
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                required
            >
                <option value="">Select Subject</option>
                {Object.keys(subjectColors).map(subject => (
                <option key={subject} value={subject}>{subject}</option>
                ))}
            </select>
            </div>

            <div className="space-y-2">
            <label className="text-sm text-gray-300">Topic</label>
            <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                placeholder="e.g., Calculus - Integration"
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                required
            />
            </div>

            <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-sm text-gray-300">Date</label>
                <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                required
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm text-gray-300">Duration</label>
                <select
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                required
                >
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
                </select>
            </div>
            </div>

            <div className="space-y-2">
            <label className="text-sm text-gray-300">Difficulty</label>
            <div className="flex gap-2">
                {['EASY', 'MEDIUM', 'HARD'].map((diff) => (
                <button
                    key={diff}
                    type="button"
                    onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    difficulty: diff as 'EASY' | 'MEDIUM' | 'HARD' 
                    }))}
                    className={`flex-1 p-2 rounded-lg transition-colors ${
                    formData.difficulty === diff
                        ? 'bg-violet-500 text-white'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                >
                    {diff}
                </button>
                ))}
            </div>
            </div>

            <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-violet-500 hover:bg-violet-600 rounded-lg
                    font-medium transition-colors"
            >
            Create Session
            </motion.button>
        </form>
        </motion.div>
    </motion.div>
    )}
    </div>
  );
};

export default Schedule;