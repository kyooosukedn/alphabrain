// Notes service API calls

import { API_URL } from '@/config/axiosConfig';
import { Note, NoteSummary } from '@/types/note';

// Get all notes for user
export const getNotes = async (): Promise<{ data: NoteSummary[] }> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/notes`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};

// Get note by ID
export const getNote = async (noteId: string): Promise<{ data: Note }> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/notes/${noteId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};

// Get notes for a specific topic
export const getTopicNotes = async (topicId: string): Promise<{ data: Note[] }> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/notes/topic/${topicId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};

// Create a new note
export const createNote = async (note: Partial<Note>): Promise<{ data: Note }> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/notes`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });
  return response.json();
};

// Update a note
export const updateNote = async (noteId: string, note: Partial<Note>): Promise<{ data: Note }> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/notes/${noteId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });
  return response.json();
};

// Delete a note
export const deleteNote = async (noteId: string): Promise<{ data: { success: boolean } }> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/notes/${noteId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};

// Search notes
export const searchNotes = async (query: string): Promise<{ data: NoteSummary[] }> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/notes/search?q=${encodeURIComponent(query)}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};
