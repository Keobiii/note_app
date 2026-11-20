import { useState } from "react";
import type { Note } from "../../../models/Note";
import { useNotes } from "../../../hooks/useNotes";

function Notes() {
  const { notes, loading, error, addNote, editNote, removeNote, clearError } =
    useNotes();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);

  const [noteTitle, setNoteTitle] = useState("");
  const [noteDescription, setNoteDescription] = useState("");
  const [search, setSearch] = useState("");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState("");

  // OPEN CREATE MODAL
  const handleCreate = () => {
    setSelectedNote(null);
    setNoteTitle("");
    setNoteDescription("");
    setFormError("");
    clearError();
    setIsModalOpen(true);
  };

  // OPEN EDIT MODAL
  const handleEdit = (note: Note) => {
    setSelectedNote(note);
    setNoteTitle(note.note_title);
    setNoteDescription(note.note_description || "");
    setFormError("");
    clearError();
    setIsModalOpen(true);
  };

  // CLOSE MODAL
  const handleCloseModal = () => {
    if (saving) return;

    setIsModalOpen(false);
    setSelectedNote(null);
    setNoteTitle("");
    setNoteDescription("");
    setFormError("");
  };

  // SAVE NOTE
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFormError("");

    if (!noteTitle.trim()) {
      setFormError("Please enter a note title.");
      return;
    }

    setSaving(true);

    try {
      const noteData = {
        note_title: noteTitle.trim(),
        note_description: noteDescription.trim(),
      };

      if (selectedNote) {
        await editNote(selectedNote.note_id, noteData);
      } else {
        await addNote(noteData);
      }

      handleCloseModal();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Unable to save note.",
      );
    } finally {
      setSaving(false);
    }
  };

  // DELETE NOTE
  const handleDelete = async () => {
    if (!deleteNoteId) return;

    setDeleting(true);

    try {
      await removeNote(deleteNoteId);
      setDeleteNoteId(null);
    } catch (error) {
      // Error is already handled by useNotes.
    } finally {
      setDeleting(false);
    }
  };

  // FILTER NOTES
  const filteredNotes = notes.filter((note) => {
    const keyword = search.toLowerCase();

    return (
      note.note_title.toLowerCase().includes(keyword) ||
      (note.note_description || "").toLowerCase().includes(keyword)
    );
  });

  // FORMAT DATE
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
            <p className="mt-1 text-sm text-gray-500">
              Keep your thoughts and important information organized.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreate}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
          >
            + Create Note
          </button>
        </div>

        {/* SEARCH */}
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your notes..."
            className="w-full max-w-md rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
          />
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-5 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            <span>{error}</span>
            <button
              type="button"
              onClick={clearError}
              className="font-medium hover:text-red-800"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <p className="text-sm text-gray-500">Loading notes...</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          /* EMPTY STATE */
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <div className="mb-4 text-4xl">📝</div>

            <h2 className="text-lg font-semibold text-gray-900">
              {search ? "No matching notes" : "No notes yet"}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {search
                ? "Try searching with a different keyword."
                : "Create your first note to get started."}
            </p>

            {!search && (
              <button
                type="button"
                onClick={handleCreate}
                className="mt-5 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
              >
                Create your first note
              </button>
            )}
          </div>
        ) : (
          /* NOTES GRID */
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredNotes.map((note) => (
              <div
                key={note.note_id}
                className="group flex min-h-52 flex-col rounded-xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-md"
              >
                <div className="flex-1">
                  <h3 className="break-words text-base font-semibold text-gray-900">
                    {note.note_title}
                  </h3>

                  <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-gray-600">
                    {note.note_description || "No description"}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-xs text-gray-400">
                    Updated {formatDate(note.date_updated)}
                  </span>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(note)}
                      className="text-xs font-medium text-gray-600 hover:text-gray-900"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteNoteId(note.note_id)}
                      className="text-xs font-medium text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* NOTES COUNT */}
        {!loading && notes.length > 0 && (
          <p className="mt-6 text-xs text-gray-400">
            Showing {filteredNotes.length} of {notes.length} notes
          </p>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedNote ? "Edit Note" : "Create Note"}
              </h2>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={saving}
                className="text-xl text-gray-400 hover:text-gray-700 disabled:opacity-50"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="space-y-4">
                {/* TITLE */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Note Title
                  </label>

                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="Enter note title"
                    maxLength={150}
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                  />
                </div>

                {/* DESCRIPTION */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Description
                  </label>

                  <textarea
                    value={noteDescription}
                    onChange={(e) => setNoteDescription(e.target.value)}
                    placeholder="Write your note here..."
                    rows={6}
                    className="w-full resize-y rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                  />
                </div>

                {/* FORM ERROR */}
                {formError && (
                  <p className="text-sm text-red-500">{formError}</p>
                )}
              </div>

              {/* ACTIONS */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={saving}
                  className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : selectedNote
                      ? "Save Changes"
                      : "Create Note"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteNoteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">
              Delete Note?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to delete this note? This action cannot be
              undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteNoteId(null)}
                disabled={deleting}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notes;
