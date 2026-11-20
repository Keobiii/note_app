import { supabase } from "../../../lib/supabase";
import type {
  CreateNoteInput,
  Note,
  UpdateNoteInput,
} from "../../../models/Note";

// Get all Notes
export async function getNotes(): Promise<Note[]> {
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    throw new Error("You must be logged in to create a note.");
  }

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", authData.user.id)
    .order("date_updated", { ascending: false });

  if (error) {
    throw error;
  }

  return data as Note[];
}

// get note by id
export async function getNoteById(noteId: string): Promise<Note> {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("note_id", noteId)
    .single();

  if (error) {
    throw error;
  }

  return data as Note;
}

// create note
export async function createNote(note: CreateNoteInput): Promise<Note> {
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    throw new Error("You must be logged in to create a note.");
  }

  const { data, error } = await supabase
    .from("notes")
    .insert({
      user_id: authData.user.id,
      note_title: note.note_title,
      note_description: note.note_description,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Note;
}

// Update Note
export async function updateNote(
  noteId: string,
  note: UpdateNoteInput,
): Promise<Note> {
  const { data, error } = await supabase
    .from("notes")
    .update({
      note_title: note.note_title,
      note_description: note.note_description,
    })
    .eq("note_id", noteId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Note;
}

// Delete Note
export async function deleteNote(noteId: string): Promise<void> {
  const { error } = await supabase.from("notes").delete().eq("note_id", noteId);

  if (error) {
    throw error;
  }
}

export const noteServices = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
};
