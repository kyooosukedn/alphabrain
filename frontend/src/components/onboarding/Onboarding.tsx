import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { ONBOARDING_STEPS } from '@/types/onboarding';

interface OnboardingProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

export function Onboarding({ onComplete, onSkip }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const navigate = useNavigate();

  const step = ONBOARDING_STEPS[currentStep];
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  useEffect(() => {
    // Check if user has already seen onboarding
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (hasSeenOnboarding && onComplete) {
      onComplete();
    }
  }, [onComplete]);

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setDirection('next');
      setCurrentStep((prev) => Math.min(prev + 1, ONBOARDING_STEPS.length - 1));
    }
  };

  const handlePrev = () => {
    setDirection('prev');
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    onComplete?.();
  };

  const handleSkip = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    onSkip?.();
  };

  const handleAction = () => {
    // Navigate based on current step
    const routes: Record<string, string> = {
      'schedule': '/schedule',
      'topics': '/topics',
      'reviews': '/reviews',
      'quests': '/quests',
      'achievements': '/achievements',
      'notes': '/notes',
      'ready': '/schedule',
    };

    const route = routes[step.id];
    if (route) {
      handleComplete();
      navigate(route);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full bg-white dark:bg-slate-900">
        <CardContent className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {ONBOARDING_STEPS.length}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <Progress value={progress} className="h-2" />

          {/* Content */}
          <div className="text-center space-y-4 py-8">
            <div className="text-6xl animate-in zoom-in duration-300">
              {step.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">{step.title}</h2>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex-1"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              {isLastStep ? (
                <>Get Started <ChevronRight className="h-4 w-4 ml-1" /></>
              ) : (
                <>Next <ChevronRight className="h-4 w-4 ml-1" /></>
              )}
            </Button>
          </div>

          {/* Action Button */}
          {step.action && (
            <Button
              variant="outline"
              onClick={handleAction}
              className="w-full border-orange-500/30 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/20"
            >
              {step.action}
            </Button>
          )}

          {/* Skip Link */}
          {!isLastStep && (
            <button
              onClick={handleSkip}
              className="w-full text-sm text-muted-foreground hover:text-foreground"
            >
              Skip onboarding
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Hook to trigger onboarding
export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleComplete = () => {
    setShowOnboarding(false);
  };

  return { showOnboarding, handleComplete };
}
