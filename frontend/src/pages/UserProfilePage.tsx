import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Copy,
  Loader2,
  Map,
  Star,
  User,
} from 'lucide-react';
import { RoadmapService } from '../services/RoadmapService';
import { Roadmap, UserProfile } from '../types/Roadmap';

export default function UserProfilePage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;
    const load = async () => {
      try {
        const [profileData, roadmapsData] = await Promise.all([
          RoadmapService.getUserProfile(username),
          RoadmapService.getUserPublicRoadmaps(username),
        ]);
        setProfile(profileData);
        setRoadmaps(roadmapsData);
      } catch {
        // user not found
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [username]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto py-8 text-center">
        <p className="text-slate-400">User not found</p>
      </div>
    );
  }

  if (!profile.publicProfile) {
    return (
      <div className="max-w-2xl mx-auto py-8 text-center">
        <User className="h-16 w-16 text-slate-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">{profile.username}</h2>
        <p className="text-slate-400">This profile is private.</p>
      </div>
    );
  }

  const difficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="text-slate-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </Button>

      {/* Profile Header */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-6 flex items-start gap-5">
          <div className="h-16 w-16 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <User className="h-8 w-8 text-violet-400" />
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">
              {profile.displayName || profile.username}
            </h1>
            <p className="text-sm text-slate-400">@{profile.username}</p>
            {profile.bio && (
              <p className="text-slate-300 mt-2">{profile.bio}</p>
            )}
            <div className="flex gap-4 mt-3 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <Map className="h-4 w-4" />
                {profile.publicRoadmapCount ?? roadmaps.length} public roadmaps
              </span>
              {profile.createdAt && (
                <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Public Roadmaps */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Public Roadmaps</h2>
        {roadmaps.length === 0 ? (
          <p className="text-slate-500 text-sm">No public roadmaps yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {roadmaps.map((roadmap) => (
              <Card
                key={roadmap.id}
                className="bg-slate-900 border-slate-800 cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300"
                onClick={() => navigate(`/roadmap/${roadmap.id}`)}
              >
                <CardContent className="p-4 flex flex-col gap-2">
                  <h3 className="text-lg font-semibold text-white">{roadmap.title}</h3>
                  <p className="text-sm text-slate-400 line-clamp-2">{roadmap.description}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge className={difficultyColor(roadmap.difficultyLevel)}>
                      {roadmap.difficultyLevel}
                    </Badge>
                    {(roadmap.ratingCount ?? 0) > 0 && (
                      <Badge variant="outline" className="text-yellow-400 border-yellow-500/30 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400" />
                        {roadmap.averageRating?.toFixed(1)}
                      </Badge>
                    )}
                    {(roadmap.cloneCount ?? 0) > 0 && (
                      <Badge variant="outline" className="text-slate-400 border-slate-700 flex items-center gap-1">
                        <Copy className="w-3 h-3" />
                        {roadmap.cloneCount}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
