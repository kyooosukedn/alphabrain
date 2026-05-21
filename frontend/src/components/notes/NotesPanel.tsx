import { useState, useEffect } from 'react';
import { NoteEditor } from './NoteEditor';
import { NoteSummary } from '@/types/note';
import { getNotes, createNote, deleteNote } from '@/services/notesApi';
import { Loader2, FileText, Trash2, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { safeFormat } from '@/utils/dateUtils';

export function NotesPanel({ topicId }: { topicId?: string }) {
  const [notes, setNotes] = useState<NoteSummary[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<NoteSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    fetchNotes();
  }, [topicId]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(notes);
    }
  }, [searchQuery, notes]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const data = await getNotes();
      const allNotes = data.data || [];
      const topicNotes = topicId
        ? allNotes.filter((n: NoteSummary) => n.topicId === topicId)
        : allNotes;
      setNotes(topicNotes);
      setFilteredNotes(topicNotes);
    } catch (error) {
      console.error('Failed to load notes:', error);
      setNotes([]);
      setFilteredNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (noteData: any) => {
    try {
      await createNote(noteData);
      setCreating(false);
      fetchNotes();
      toast({
        title: 'Note created',
        description: 'Your note has been saved.',
      });
    } catch (error) {
      console.error('Failed to create note:', error);
      toast({
        title: 'Failed to create note',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteNote(noteId);
      fetchNotes();
      toast({
        title: 'Note deleted',
        description: 'Your note has been deleted.',
      });
    } catch (error) {
      console.error('Failed to delete note:', error);
      toast({
        title: 'Failed to delete note',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-orange-500 mr-2" />
        <span className="text-muted-foreground">Loading notes...</span>
      </div>
    );
  }

  if (creating) {
    return (
      <NoteEditor
        topicId={topicId}
        onSave={handleCreateNote}
        onCancel={() => setCreating(false)}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-orange-500" />
          <div>
            <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
              Notes
            </p>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
            </p>
          </div>
        </div>
        <Button onClick={() => setCreating(true)} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          New Note
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Notes List */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="inline-flex h-20 w-20 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-950/40 dark:to-orange-950/20 items-center justify-center mb-6 border-2 border-orange-200 dark:border-orange-900/30">
            <FileText className="h-10 w-10 text-orange-500" />
          </div>
          <h3 className="text-2xl font-semibold mb-3">
            {searchQuery ? 'No notes found' : 'No notes yet'}
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            {searchQuery
              ? 'Try a different search term'
              : 'Create your first note to start documenting your learning journey.'}
          </p>
          {!searchQuery && (
            <Button onClick={() => setCreating(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Create Note
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredNotes.map((note) => (
            <Card
              key={note.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {/* Navigate to note detail */}}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-lg mb-1 truncate">{note.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {note.preview}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {note.tags?.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      <span className="text-xs text-muted-foreground">
                        {safeFormat(note.updatedAt, 'relative')}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0 text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingId(note.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete note?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Your note will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && handleDeleteNote(deletingId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
