import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';

interface Resource {
  title: string;
  url: string;
  type: string;
  estimatedTimeToComplete?: number;
}

interface StudySession {
  date: string;
  duration: number;
  notes?: string;
}

interface RelatedNode {
  id: string;
  title: string;
  type: string;
  relationshipType: string;
}

interface NodeDetailsProps {
  nodeId: string;
  title: string;
  description?: string;
  type: string;
  progress: number;
  difficulty?: number;
  resources?: Resource[];
  prerequisites?: RelatedNode[];
  relatedTopics?: RelatedNode[];
  studySessions?: StudySession[];
  onClose: () => void;
}

const NodeDetailsView: React.FC<NodeDetailsProps> = ({
  nodeId,
  title,
  description,
  type,
  progress,
  difficulty = 1,
  resources = [],
  prerequisites = [],
  relatedTopics = [],
  studySessions = [],
  onClose,
}) => {
  // For demo purposes, generate some mock data if not provided
  const mockResources: Resource[] = resources.length > 0 ? resources : [
    { title: 'Introduction Tutorial', url: 'https://example.com/tutorial', type: 'Video', estimatedTimeToComplete: 15 },
    { title: 'Documentation', url: 'https://example.com/docs', type: 'Reading', estimatedTimeToComplete: 30 },
    { title: 'Practice Exercises', url: 'https://example.com/practice', type: 'Interactive', estimatedTimeToComplete: 45 },
  ];

  const mockStudySessions: StudySession[] = studySessions.length > 0 ? studySessions : [
    { date: '2025-03-20', duration: 45, notes: 'Completed introduction chapter' },
    { date: '2025-03-22', duration: 60, notes: 'Worked on practical examples' },
    { date: '2025-03-24', duration: 30, notes: 'Reviewed concepts and took notes' },
  ];

  // Format dates nicely
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Calculate total study time
  const totalStudyTime = mockStudySessions.reduce((total, session) => total + session.duration, 0);
  
  return (
    <Card className="w-full max-w-4xl shadow-lg">
      <CardHeader className="border-b">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <div className="flex gap-2 mt-2">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                {type}
              </span>
              <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-700/10">
                Difficulty: {difficulty}/5
              </span>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        {description && (
          <CardDescription className="text-sm text-slate-600 mb-6">
            {description}
          </CardDescription>
        )}
        
        <div className="mb-6">
          <div className="text-sm font-medium mb-2">Progress</div>
          <Progress value={progress} className="h-2 mb-1" />
          <div className="flex justify-between text-xs text-slate-500">
            <span>Beginner</span>
            <span>Proficient</span>
            <span>Expert</span>
          </div>
        </div>
        
        <Tabs defaultValue="resources">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="sessions">Study Sessions</TabsTrigger>
            <TabsTrigger value="related">Related Topics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="resources" className="py-4">
            <h4 className="text-sm font-semibold mb-4">Learning Resources</h4>
            <div className="space-y-3">
              {mockResources.map((resource, index) => (
                <div key={index} className="border p-3 rounded-md hover:shadow-sm">
                  <div className="flex justify-between">
                    <h5 className="font-medium">{resource.title}</h5>
                    <span className="text-xs px-2 py-1 bg-slate-100 rounded-full">{resource.type}</span>
                  </div>
                  <a 
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    {resource.url}
                  </a>
                  {resource.estimatedTimeToComplete && (
                    <div className="text-xs text-slate-500 mt-1">
                      Estimated time: {resource.estimatedTimeToComplete} min
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button size="sm">Add Resource</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="sessions" className="py-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-semibold">Study Sessions</h4>
              <div className="text-xs text-slate-500">
                Total time: {totalStudyTime} minutes
              </div>
            </div>
            <div className="space-y-3">
              {mockStudySessions.map((session, index) => (
                <div key={index} className="border p-3 rounded-md hover:shadow-sm">
                  <div className="flex justify-between">
                    <h5 className="font-medium">{formatDate(session.date)}</h5>
                    <span className="text-xs px-2 py-1 bg-slate-100 rounded-full">
                      {session.duration} min
                    </span>
                  </div>
                  {session.notes && (
                    <div className="text-xs text-slate-600 mt-1">
                      {session.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button size="sm">Record Session</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="related" className="py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold mb-4">Prerequisites</h4>
                {prerequisites.length > 0 ? (
                  <div className="space-y-2">
                    {prerequisites.map((node, index) => (
                      <div key={index} className="border p-2 rounded-md text-sm">
                        {node.title}
                        <span className="text-xs ml-2 text-slate-500">{node.type}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-slate-500">No prerequisites defined</div>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-4">Related Topics</h4>
                {relatedTopics.length > 0 ? (
                  <div className="space-y-2">
                    {relatedTopics.map((node, index) => (
                      <div key={index} className="border p-2 rounded-md text-sm">
                        {node.title}
                        <span className="text-xs ml-2 text-slate-500">{node.type}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-slate-500">No related topics</div>
                )}
              </div>
            </div>
            <div className="mt-4">
              <Button size="sm">Add Relationship</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t flex justify-between">
        <div className="text-xs text-slate-500">
          ID: {nodeId}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Edit</Button>
          <Button variant="default" size="sm">Start Learning</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NodeDetailsView;