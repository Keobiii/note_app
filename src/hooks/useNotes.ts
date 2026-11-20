import { useCallback, useEffect, useState } from "react";
import type { CreateNoteInput, Note, UpdateNoteInput } from "../models/Note";
import { noteServices } from "../features/auth/services/noteServices";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // GET ALL NOTES
  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await noteServices.getNotes();
      setNotes(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch notes.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // CREATE NOTE
  const addNote = async (note: CreateNoteInput) => {
    setError(null);

    try {
      const newNote = await noteServices.createNote(note);

      setNotes((prev) => [newNote, ...prev]);

      return newNote;
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create note.",
      );

      throw error;
    }
  };

  // UPDATE NOTE
  const editNote = async (noteId: string, note: UpdateNoteInput) => {
    setError(null);

    try {
      const updatedNote = await noteServices.updateNote(noteId, note);

      setNotes((prev) =>
        prev
          .map((item) => (item.note_id === noteId ? updatedNote : item))
          .sort(
            (a, b) =>
              new Date(b.date_updated).getTime() -
              new Date(a.date_updated).getTime(),
          ),
      );

      return updatedNote;
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update note.",
      );

      throw error;
    }
  };

  // DELETE NOTE
  const removeNote = async (noteId: string) => {
    setError(null);

    try {
      await noteServices.deleteNote(noteId);

      setNotes((prev) => prev.filter((item) => item.note_id !== noteId));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete note.",
      );

      throw error;
    }
  };

  // CLEAR ERROR
  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return {
    notes,
    loading,
    error,
    fetchNotes,
    addNote,
    editNote,
    removeNote,
    clearError,
  };
}
