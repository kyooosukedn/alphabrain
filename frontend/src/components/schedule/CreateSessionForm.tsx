import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SessionFormData, StudyEvent, Difficulty } from "@/types/schedule";
import { subjectColors } from "@/types/schedule";

interface CreateSessionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: StudyEvent) => void;
  selectedDate: Date | null;
}

export function CreateSessionForm({
  isOpen,
  onClose,
  onSubmit,
  selectedDate,
}: CreateSessionFormProps) {
  // Form state with default values
  const [formData, setFormData] = useState<SessionFormData>({
    subject: "",
    topic: "",
    date: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
    duration: "60",
    difficulty: "MEDIUM",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.subject || !formData.topic || !formData.date) {
      return;
    }

    // Create event dates
    const startDate = new Date(formData.date);
    const endDate = new Date(
      startDate.getTime() + parseInt(formData.duration) * 60 * 1000
    );

    // Create new event
    const newEvent: StudyEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title: `${formData.subject} - ${formData.topic}`,
      start: startDate,
      end: endDate,
      subject: formData.subject,
      difficulty: formData.difficulty as Difficulty,
      color: subjectColors[formData.subject as keyof typeof subjectColors],
      topic: formData.topic,
    };

    // Submit and reset
    onSubmit(newEvent);
    onClose();
    setFormData({
      subject: "",
      topic: "",
      date: "",
      duration: "60",
      difficulty: "MEDIUM",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Study Session</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            value={formData.subject}
            onValueChange={(value) =>
              setFormData({ ...formData, subject: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(subjectColors).map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Topic"
            value={formData.topic}
            onChange={(e) =>
              setFormData({ ...formData, topic: e.target.value })
            }
            required
          />

          <Input
            type="datetime-local"
            value={formData.date}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
            required
          />

          <Input
            type="number"
            placeholder="Duration (minutes)"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
            min="15"
            max="240"
          />

          <Select
            value={formData.difficulty}
            onValueChange={(value) =>
              setFormData({ ...formData, difficulty: value as Difficulty})
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EASY">Easy</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HARD">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Button type="submit">Create Session</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
