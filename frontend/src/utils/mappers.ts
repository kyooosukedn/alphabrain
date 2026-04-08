// src/utils/mappers.ts
import { Session } from '../types/session';
import { StudyEvent, eventTypeColors } from '../types/schedule';
import { StudySession } from '../types/dashboard';

/**
 * Converts a backend Session object to a frontend StudyEvent object
 */
export const sessionToStudyEvent = (session: Session): StudyEvent => {
	// Map category to EventType if possible, or use default
	const eventType = Object.keys(eventTypeColors).includes(session.category) 
		? session.category as keyof typeof eventTypeColors 
		: 'Deep Work';
	
	return {
		id: session.id,
		title: session.title,
		start: new Date(session.startTime),
		end: new Date(session.endTime),
		description: session.description,
		type: eventType,
		backgroundColor: eventTypeColors[eventType],
		borderColor: eventTypeColors[eventType],
		priority: session.priority as 'LOW' | 'MEDIUM' | 'HIGH',
		topicId: session.topicId
	};
};


/**
 * Converts a frontend StudyEvent object to a backend Session object
 */
export const studyEventToSession = (event: StudyEvent, userId: string): Omit<Session, 'id'> => {
	return {
		title: event.title,
		description: event.description,
		startTime: event.start.toISOString(),
		endTime: event.end.toISOString(),
		status: "PLANNED",
		priority: event.priority || "MEDIUM",
		category: event.type || 'Deep Work',
		userId,
		topicId: event.topicId || '' // Include the topic ID, default to empty string if not provided
	};
};

/**
 * Converts a backend Session object to a frontend StudySession object for dashboard display
 */
export const sessionToStudySession = (session: Session): StudySession => {
	// Calculate progress based on status
	// Default to 0 for PLANNED, 50 for IN_PROGRESS, 100 for COMPLETED
	let progress = 0;
	if (session.status === "IN_PROGRESS") {
		progress = 50;
	} else if (session.status === "COMPLETED") {
		progress = 100;
	}
	
	// Determine color based on priority
	let color = "bg-blue-500"; // Default color
	if (session.priority === "HIGH") {
		color = "bg-red-500";
	} else if (session.priority === "MEDIUM") {
		color = "bg-orange-500";
	} else if (session.priority === "LOW") {
		color = "bg-green-500";
	}
	
	// Calculate time left
	const startTime = new Date(session.startTime);
	const endTime = new Date(session.endTime);
	const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
	const timeLeft = `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`;
	
	// Extract topics from description or use category
	const topics = session.description ? 
		[session.category, ...session.description.split(',').slice(0, 2)] : 
		[session.category];
	
	// Determine difficulty based on priority
	const difficulty = session.priority === "HIGH" ? "hard" : 
		session.priority === "MEDIUM" ? "medium" : "easy";
	
	return {
		id: session.id,
		subject: session.title,
		progress,
		timeLeft,
		dueDate: new Date(session.endTime).toLocaleDateString(),
		difficulty: difficulty as "easy" | "medium" | "hard",
		topics: topics.filter(t => t.trim() !== "").map(t => t.trim()),
		color,
		streakDays: 1, // Default value, can be updated with actual data when available
		completedTopics: Math.floor(progress / 10), // Estimate based on progress
		totalTopics: 10 // Default value, can be updated with actual data when available
	};
};