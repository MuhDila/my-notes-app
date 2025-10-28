import { useEffect, useState } from "react";
import NoteCard from "../components/NoteCard";
import { PlusIcon } from "@heroicons/react/24/solid";
import { InboxIcon } from "@heroicons/react/24/outline";
import {
    getActiveNotes, getArchivedNotes,
    archiveNote, unarchiveNote, deleteNote
} from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { useSettings } from "../contexts/SettingsContext";
import { dict } from "../utils/dict";

function HomePage() {
    const navigate = useNavigate();
    const { lang } = useSettings();

    // go to detail
    const openDetail = (id) => navigate(`/detail/${id}`);

    const [active, setActive] = useState([]);
    const [archived, setArchived] = useState([]);
    const [loadingList, setLoadingList] = useState(true);

    // track loading per-note
    const [archivingIds, setArchivingIds] = useState(new Set());
    const [deletingIds, setDeletingIds] = useState(new Set());

    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    const ownerName = currentUser ? (currentUser.name || dict[lang].noteCard.you) : null;

    // empty state
    const hasAnyNote = active.length > 0 || archived.length > 0;
    const emptyTitle =
        (dict[lang].empty && dict[lang].empty.title) ||
        (lang === "id" ? "Belum ada catatan" : "No notes yet");

    async function refresh() {
        setLoadingList(true);
        try {
            const [a, b] = await Promise.all([getActiveNotes(), getArchivedNotes()]);
            setActive(!a.error ? a.data : []);
            setArchived(!b.error ? b.data : []);
        } finally {
            setLoadingList(false);
        }
    }
    useEffect(() => { refresh().then(() => {}); }, []);

    async function onToggleArchive(id, isArchived) {
        setArchivingIds(prev => new Set(prev).add(id));
        try {
            await (isArchived ? unarchiveNote(id) : archiveNote(id));
            await refresh();
        } finally {
            setArchivingIds(prev => { const ns = new Set(prev); ns.delete(id); return ns; });
        }
    }

    async function onDelete(id) {
        if (!window.confirm("Delete this note?")) return;
        setDeletingIds(prev => new Set(prev).add(id));
        try {
            await deleteNote(id);
            await refresh();
        } finally {
            setDeletingIds(prev => { const ns = new Set(prev); ns.delete(id); return ns; });
        }
    }

    if (loadingList) {
        return (
            <div className="p-6">
                <h1 className="mb-4 text-2xl font-semibold">{dict[lang].home}</h1>
                <div className="flex flex-wrap gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="min-w-[280px] w-72">
                            <div className="h-40 rounded-2xl bg-neutral-200 animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const List = ({ items }) => (
        <div className="flex flex-wrap gap-6">
            {items.map((n, i) => (
                <div key={n.id} className="min-w-[280px] w-72">
                    <NoteCard
                        note={n}
                        ownerName={n.owner === currentUser?.id ? dict[lang].noteCard.you : ownerName}
                        onToggleArchive={onToggleArchive}
                        onDelete={onDelete}
                        isArchiving={archivingIds.has(n.id)}
                        isDeleting={deletingIds.has(n.id)}
                        color={i % 2 ? "orange" : "amber"}
                        onOpen={openDetail}
                    />
                </div>
            ))}
        </div>
    );

    return (
        <div className="p-6">
            <h1 className="mb-4 text-2xl font-semibold">{dict[lang].home}</h1>

            {/* Empty state — only icon + header */}
            {!hasAnyNote ? (
                <div
                    className="mx-auto flex max-w-xl flex-col items-center justify-center rounded-2xl border border-dashed
                     border-neutral-300 p-10 text-center text-black dark:text-white"
                    aria-live="polite"
                >
                    <InboxIcon className="mb-3 h-10 w-10 text-neutral-400" aria-hidden="true" />
                    <h2 className="text-xl font-semibold mb-5">{emptyTitle}</h2>

                    <Link
                        to="/create"
                        className="inline-flex items-center gap-2 rounded-full bg-lime-500 px-4 py-2
                       font-medium text-black shadow-lg shadow-lime-500/30 hover:bg-lime-400
                       focus:outline-none focus:ring-4 focus:ring-lime-400/50"
                        aria-label={dict[lang].create}
                        title={dict[lang].create}
                    >
                        <PlusIcon className="h-5 w-5" />
                        <span>{dict[lang].create}</span>
                    </Link>
                </div>
            ) : (
                <>
                    <List items={active} />

                    {archived.length > 0 && (
                        <>
                            <h2 className="mb-4 mt-10 text-xl font-semibold">{dict[lang].archived}</h2>
                            <List items={archived} />
                        </>
                    )}
                </>
            )}

            {/* FAB tetap */}
            <Link
                to="/create"
                className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center
                 rounded-full bg-lime-500 text-black shadow-lg shadow-lime-500/30
                 hover:bg-lime-400 focus:outline-none focus:ring-4 focus:ring-lime-400/50"
                aria-label={dict[lang].create}
                title={dict[lang].create}
            >
                <PlusIcon className="h-7 w-7" />
                <span className="sr-only">{dict[lang].create}</span>
            </Link>
        </div>
    );
}

export default HomePage;