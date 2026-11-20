export interface Note {
  note_id: string;
  user_id: string;
  note_title: string;
  note_description: string | null;
  date_created: string;
  date_updated: string;
}

export interface CreateNoteInput {
  note_title: string;
  note_description: string;
}

export interface UpdateNoteInput {
  note_title: string;
  note_description: string;
}
