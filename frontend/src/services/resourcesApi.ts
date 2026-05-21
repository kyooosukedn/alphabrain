// Resources service API calls

import { API_URL } from '@/config/axiosConfig';
import { Resource } from '@/types/resource';

// Get all resources for user
export const getResources = async (): Promise<{ data: Resource[] }> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/resources`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};

// Get resources for a specific topic
export const getTopicResources = async (topicId: string): Promise<{ data: Resource[] }> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/resources/topic/${topicId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};

// Create a new resource
export const createResource = async (resource: Partial<Resource>): Promise<{ data: Resource }> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/resources`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(resource),
  });
  return response.json();
};

// Update a resource
export const updateResource = async (resourceId: string, resource: Partial<Resource>): Promise<{ data: Resource }> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/resources/${resourceId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(resource),
  });
  return response.json();
};

// Toggle resource completion
export const toggleResourceComplete = async (resourceId: string): Promise<{ data: Resource }> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/resources/${resourceId}/toggle`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};

// Delete a resource
export const deleteResource = async (resourceId: string): Promise<{ data: { success: boolean } }> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/resources/${resourceId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};
