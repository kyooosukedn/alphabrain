import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RoadmapService } from '../services/RoadmapService';
import { Roadmap } from '../types/Roadmap';

const RoadmapList: React.FC = () => {
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');

  useEffect(() => {
    loadRoadmaps();
  }, [category, difficulty]);

  const loadRoadmaps = async () => {
    try {
      let result: Roadmap[];
      if (category !== 'all') {
        result = await RoadmapService.getRoadmapsByCategory(category);
      } else if (difficulty !== 'all') {
        result = await RoadmapService.getRoadmapsByDifficulty(difficulty);
      } else {
        result = await RoadmapService.getPublicRoadmaps();
      }
      setRoadmaps(result);
    } catch (error) {
      console.error('Error loading roadmaps:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadRoadmaps();
      return;
    }
    try {
      const result = await RoadmapService.searchRoadmaps(searchTerm);
      setRoadmaps(result);
    } catch (error) {
      console.error('Error searching roadmaps:', error);
    }
  };

  const handleRoadmapClick = (id: string) => {
    navigate(`/roadmap/${id}`);
  };

  const filteredRoadmaps = roadmaps.filter(
    (roadmap) =>
      roadmap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roadmap.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const difficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'advanced':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6">
      {/* Header + Filters */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-4">Learning Roadmaps</h1>

        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Search roadmaps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 bg-slate-800 border-slate-700 text-white"
          />

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[160px] bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="programming">Programming</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="science">Science</SelectItem>
            </SelectContent>
          </Select>

          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="w-[160px] bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Roadmap Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoadmaps.map((roadmap) => (
          <Card
            key={roadmap.id}
            className="bg-slate-900 border-slate-800 cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300"
            onClick={() => handleRoadmapClick(roadmap.id)}
          >
            {roadmap.thumbnailUrl && (
              <img
                src={roadmap.thumbnailUrl}
                alt={roadmap.title}
                className="w-full h-36 object-cover rounded-t-lg"
              />
            )}
            <CardContent className="p-4 flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-white">{roadmap.title}</h2>
              <p className="text-sm text-slate-400 line-clamp-3">
                {roadmap.description}
              </p>
              <div className="flex gap-2 mt-2">
                <Badge className={difficultyColor(roadmap.difficultyLevel)}>
                  {roadmap.difficultyLevel}
                </Badge>
                <Badge variant="outline" className="text-slate-400 border-slate-700">
                  {roadmap.estimatedTimeToComplete} mins
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredRoadmaps.length === 0 && (
        <div className="text-center mt-12">
          <p className="text-lg text-slate-400">No roadmaps found</p>
          <Button onClick={loadRoadmaps} className="mt-4">
            Reset filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default RoadmapList;
