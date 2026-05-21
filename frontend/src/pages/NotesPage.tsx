import { NotesPanel } from '../components/notes/NotesPanel';

export default function NotesPage() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Notes</h1>
        <p className="text-muted-foreground">Your learning notes and summaries</p>
      </div>
      <NotesPanel />
    </div>
  );
}
