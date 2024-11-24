import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  X, Clock, Calendar, Book, Target, 
  AlertCircle, ChevronDown, Check
} from 'lucide-react';

interface CreateSessionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sessionData: any) => void;
  initialDate?: Date;
  subjectColors: Record<string, string>;
}

interface TimeOption {
  label: string;
  value: string;
}

const CreateSessionForm: React.FC<CreateSessionFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialDate,
  subjectColors
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    date: initialDate ? format(initialDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    duration: '60',
    difficulty: 'MEDIUM' as 'EASY' | 'MEDIUM' | 'HARD',
    description: '',
    isRecurring: false,
    recurringDays: [] as string[]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Generate time options every 30 minutes
  const timeOptions: TimeOption[] = Array.from({ length: 32 }, (_, i) => {
    const hour = Math.floor(i / 2) + 6; // Start from 6 AM
    const minute = i % 2 === 0 ? '00' : '30';
    const timeString = `${hour.toString().padStart(2, '0')}:${minute}`;
    return {
      label: format(new Date().setHours(hour, parseInt(minute)), 'h:mm a'),
      value: timeString
    };
  });

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.subject) newErrors.subject = 'Subject is required';
      if (!formData.topic) newErrors.topic = 'Topic is required';
    }

    if (step === 2) {
      if (!formData.date) newErrors.date = 'Date is required';
      if (!formData.startTime) newErrors.startTime = 'Start time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
      const endDateTime = new Date(startDateTime.getTime() + parseInt(formData.duration) * 60000);

      onSubmit({
        ...formData,
        start: startDateTime,
        end: endDateTime
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Subject Selection */}
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Subject</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(subjectColors).map(([subject, color]) => (
                  <motion.button
                    key={subject}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData(prev => ({ ...prev, subject }))}
                    className={`p-3 rounded-lg flex items-center gap-2 transition-all ${
                      formData.subject === subject
                        ? 'bg-white/20 border-2 border-white/20'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                    style={{ 
                      borderColor: formData.subject === subject ? color : undefined 
                    }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm font-medium">{subject}</span>
                    {formData.subject === subject && (
                      <Check className="w-4 h-4 ml-auto" />
                    )}
                  </motion.button>
                ))}
              </div>
              {errors.subject && (
                <p className="text-red-400 text-sm mt-1">{errors.subject}</p>
              )}
            </div>

            {/* Topic Input */}
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Topic</label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  topic: e.target.value 
                }))}
                placeholder="e.g., Integration by Parts"
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
              {errors.topic && (
                <p className="text-red-400 text-sm mt-1">{errors.topic}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Description (Optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  description: e.target.value 
                }))}
                placeholder="Add any notes or details about this study session..."
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-violet-500/50
                         min-h-[100px] resize-none"
              />
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Date and Time Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    date: e.target.value 
                  }))}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
                {errors.date && (
                  <p className="text-red-400 text-sm mt-1">{errors.date}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-300">Start Time</label>
                <select
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    startTime: e.target.value 
                  }))}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                >
                  {timeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Duration Selection */}
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Duration</label>
              <div className="grid grid-cols-4 gap-2">
                {['30', '60', '90', '120'].map((duration) => (
                  <motion.button
                    key={duration}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      duration 
                    }))}
                    className={`p-2 rounded-lg transition-colors ${
                      formData.duration === duration
                        ? 'bg-violet-500 text-white'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {parseInt(duration) >= 60 
                      ? `${parseInt(duration) / 60}h` 
                      : `${duration}m`
                    }
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Difficulty Selection */}
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Difficulty</label>
              <div className="grid grid-cols-3 gap-2">
                {['EASY', 'MEDIUM', 'HARD'].map((diff) => (
                  <motion.button
                    key={diff}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      difficulty: diff as typeof formData.difficulty 
                    }))}
                    className={`p-2 rounded-lg transition-colors ${
                      formData.difficulty === diff
                        ? 'bg-violet-500 text-white'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {diff}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Recurring Options */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    isRecurring: e.target.checked 
                  }))}
                  className="rounded border-white/10 bg-white/5 text-violet-500
                           focus:ring-offset-0 focus:ring-2 focus:ring-violet-500/50"
                />
                <label htmlFor="recurring" className="text-sm text-gray-300">
                  Repeat this session
                </label>
              </div>

              {formData.isRecurring && (
                <div className="grid grid-cols-7 gap-1 mt-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <motion.button
                      key={day}
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        const days = formData.recurringDays.includes(day)
                          ? formData.recurringDays.filter(d => d !== day)
                          : [...formData.recurringDays, day];
                        setFormData(prev => ({ ...prev, recurringDays: days }));
                      }}
                      className={`p-2 rounded-full transition-colors ${
                        formData.recurringDays.includes(day)
                          ? 'bg-violet-500 text-white'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      {day}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-slate-900 rounded-xl p-6 w-full max-w-md"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold">Create Study Session</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Step {currentStep} of 2
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-white/5 rounded-full mb-6">
              <motion.div
                className="h-full bg-violet-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${(currentStep / 2) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-lg
                             font-medium transition-colors"
                  >
                    Back
                  </button>
                )}
                <motion.button
                  type={currentStep === 2 ? 'submit' : 'button'}
                  onClick={currentStep === 1 ? handleNext : undefined}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 bg-violet-500 hover:bg-violet-600 rounded-lg
                           font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {currentStep === 2 ? (
                    <>
                      Create Session
                      <Check className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronDown className="w-4 h-4 rotate-270" />
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Optional: Add styles for the calendar
const calendarStyles = `
  .study-calendar {
    --fc-border-color: rgba(255, 255, 255, 0.1);
    --fc-button-bg-color: rgba(255, 255, 255, 0.1);
    --fc-button-border-color: rgba(255, 255, 255, 0.1);
    --fc-button-hover-bg-color: rgba(255, 255, 255, 0.2);
    --fc-button-hover-border-color: rgba(255, 255, 255, 0.2);
    --fc-button-active-bg-color: rgba(139, 92, 246, 0.5);
    --fc-button-active-border-color: rgba(139, 92, 246, 0.5);
    --fc-event-bg-color: #8b5cf6;
    --fc-event-border-color: #8b5cf6;
    --fc-today-bg-color: rgba(139, 92, 246, 0.1);
  }

  .study-calendar .fc-theme-standard td,
  .study-calendar .fc-theme-standard th {
    border-color: rgba(255, 255, 255, 0.1);
  }

  .study-calendar .fc-timegrid-slot,
  .study-calendar .fc-timegrid-axis {
    height: 50px !important;
  }

  .study-calendar .fc-button {
    @apply text-white;
  }

  .study-calendar .fc-event {
    @apply cursor-pointer transition-opacity hover:opacity-80;
  }

  .study-calendar .fc-event:hover {
    transform: scale(1.02);
    transition: transform 0.2s ease;
  }
`;

export { CreateSessionForm, calendarStyles };