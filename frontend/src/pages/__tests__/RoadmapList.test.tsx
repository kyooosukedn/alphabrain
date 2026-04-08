import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RoadmapList from '../RoadmapList';
import { RoadmapService } from '../../services/RoadmapService';

// Mock the RoadmapService
jest.mock('../../services/RoadmapService');

const mockRoadmaps = [
  {
    id: '1',
    title: 'React Fundamentals',
    description: 'Learn React from scratch',
    category: 'programming',
    difficultyLevel: 'beginner',
    estimatedTimeToComplete: 120,
    isPublic: true,
    isTemplate: false,
    tags: ['react', 'javascript'],
    completionPercentage: 0,
    nodeIds: [],
    items: [],
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z',
  },
  {
    id: '2',
    title: 'Advanced TypeScript',
    description: 'Master TypeScript',
    category: 'programming',
    difficultyLevel: 'advanced',
    estimatedTimeToComplete: 240,
    isPublic: true,
    isTemplate: false,
    tags: ['typescript'],
    completionPercentage: 0,
    nodeIds: [],
    items: [],
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z',
  },
];

describe('RoadmapList', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Mock the service methods
    (RoadmapService.getPublicRoadmaps as jest.Mock).mockResolvedValue(mockRoadmaps);
    (RoadmapService.getRoadmapsByCategory as jest.Mock).mockResolvedValue(mockRoadmaps);
    (RoadmapService.getRoadmapsByDifficulty as jest.Mock).mockResolvedValue(mockRoadmaps);
    (RoadmapService.searchRoadmaps as jest.Mock).mockResolvedValue(mockRoadmaps);
  });
  
  it('renders roadmap list', async () => {
    render(
      <BrowserRouter>
        <RoadmapList />
      </BrowserRouter>
    );
    
    // Check if the title is rendered
    expect(screen.getByText('Learning Roadmaps')).toBeInTheDocument();
    
    // Wait for roadmaps to be loaded
    await waitFor(() => {
      expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
      expect(screen.getByText('Advanced TypeScript')).toBeInTheDocument();
    });
  });
  
  it('filters roadmaps by category', async () => {
    render(
      <BrowserRouter>
        <RoadmapList />
      </BrowserRouter>
    );
    
    // Select programming category
    const categorySelect = screen.getByLabelText('Category');
    fireEvent.change(categorySelect, { target: { value: 'programming' } });
    
    // Verify that getRoadmapsByCategory was called
    await waitFor(() => {
      expect(RoadmapService.getRoadmapsByCategory).toHaveBeenCalledWith('programming');
    });
  });
  
  it('filters roadmaps by difficulty', async () => {
    render(
      <BrowserRouter>
        <RoadmapList />
      </BrowserRouter>
    );
    
    // Select beginner difficulty
    const difficultySelect = screen.getByLabelText('Difficulty');
    fireEvent.change(difficultySelect, { target: { value: 'beginner' } });
    
    // Verify that getRoadmapsByDifficulty was called
    await waitFor(() => {
      expect(RoadmapService.getRoadmapsByDifficulty).toHaveBeenCalledWith('beginner');
    });
  });
  
  it('searches roadmaps', async () => {
    render(
      <BrowserRouter>
        <RoadmapList />
      </BrowserRouter>
    );
    
    // Type in search field
    const searchInput = screen.getByLabelText('Search roadmaps');
    fireEvent.change(searchInput, { target: { value: 'React' } });
    
    // Press Enter to search
    fireEvent.keyPress(searchInput, { key: 'Enter', code: 13, charCode: 13 });
    
    // Verify that searchRoadmaps was called
    await waitFor(() => {
      expect(RoadmapService.searchRoadmaps).toHaveBeenCalledWith('React');
    });
  });
  
  it('displays difficulty chip with correct color', async () => {
    render(
      <BrowserRouter>
        <RoadmapList />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      const beginnerChip = screen.getByText('beginner');
      const advancedChip = screen.getByText('advanced');
      
      expect(beginnerChip).toHaveClass('MuiChip-colorSuccess');
      expect(advancedChip).toHaveClass('MuiChip-colorError');
    });
  });
  
  it('displays estimated time chip', async () => {
    render(
      <BrowserRouter>
        <RoadmapList />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('120 mins')).toBeInTheDocument();
      expect(screen.getByText('240 mins')).toBeInTheDocument();
    });
  });
  
  it('shows no roadmaps found message when filtered results are empty', async () => {
    // Mock empty results
    (RoadmapService.searchRoadmaps as jest.Mock).mockResolvedValue([]);
    
    render(
      <BrowserRouter>
        <RoadmapList />
      </BrowserRouter>
    );
    
    // Search for non-existent roadmap
    const searchInput = screen.getByLabelText('Search roadmaps');
    fireEvent.change(searchInput, { target: { value: 'NonExistent' } });
    fireEvent.keyPress(searchInput, { key: 'Enter', code: 13, charCode: 13 });
    
    await waitFor(() => {
      expect(screen.getByText('No roadmaps found')).toBeInTheDocument();
      expect(screen.getByText('Reset filters')).toBeInTheDocument();
    });
  });
}); 