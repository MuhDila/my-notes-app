import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
    getNote,
    archiveNote,
    unarchiveNote,
    deleteNote,
} from "../utils/api";
import NoteDetail from "../components/NoteDetail";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

function DetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingToggle, setLoadingToggle] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [error, setError] = useState("");

    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    const ownerName = note?.owner === currentUser?.id
        ? (currentUser?.name || "You")
        : (currentUser?.name || note?.owner || "");

    async function fetchNote() {
        setLoading(true);
        setError("");
        try {
            const res = await getNote(id);
            if (res.error) throw new Error(res.message || "Failed to load note");
            setNote(res.data);
        } catch (e) {
            setError(e.message || "Failed to load note");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchNote(); }, [id]);

    async function onToggleArchive(noteId, isArchived) {
        setLoadingToggle(true);
        try {
            const res = isArchived ? await unarchiveNote(noteId) : await archiveNote(noteId);
            if (!res.error) await fetchNote();
        } finally {
            setLoadingToggle(false);
        }
    }

    async function onDelete(noteId) {
        if (!window.confirm("Delete this note?")) return;
        setLoadingDelete(true);
        try {
            const res = await deleteNote(noteId);
            if (!res.error) navigate("/", { replace: true });
        } finally {
            setLoadingDelete(false);
        }
    }

    return (
        <div className="mx-auto max-w-3xl space-y-4">
            {/* Back */}
            <div className="flex items-center">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm
                     hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-300
                     dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                >
                    <ArrowLeftIcon className="h-4 w-4" />
                    <span>Back</span>
                </Link>
            </div>

            {/* States */}
            {loading && (
                <div className="mx-auto w-full max-w-2xl rounded-2xl bg-neutral-200 p-5 animate-pulse dark:bg-neutral-800">
                    <div className="h-6 w-2/3 rounded bg-neutral-300 dark:bg-neutral-700" />
                    <div className="mt-2 h-4 w-1/3 rounded bg-neutral-300 dark:bg-neutral-700" />
                    <div className="mt-6 h-32 rounded bg-neutral-300 dark:bg-neutral-700" />
                </div>
            )}

            {error && !loading && (
                <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                    {error}
                    <div className="mt-3">
                        <button
                            onClick={fetchNote}
                            className="rounded-md bg-red-600 px-3 py-1.5 text-white hover:bg-red-500"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            )}

            {!loading && !error && note && (
                <NoteDetail
                    note={note}
                    ownerName={ownerName}
                    onToggleArchive={onToggleArchive}
                    onDelete={onDelete}
                    loadingToggle={loadingToggle}
                    loadingDelete={loadingDelete}
                />
            )}
        </div>
    );
}

export default DetailPage;