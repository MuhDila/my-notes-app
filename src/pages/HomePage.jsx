import { useEffect, useState } from "react";
import NoteCard from "../components/NoteCard";
import { PlusIcon } from "@heroicons/react/24/solid";
import {
    getActiveNotes, getArchivedNotes,
    archiveNote, unarchiveNote, deleteNote
} from "../utils/api";
import {Link} from "react-router-dom";
import {useSettings} from "../contexts/SettingsContext";
import {dict} from "../utils/dict";

function HomePage() {
    const { lang } = useSettings();

    const [active, setActive] = useState([]);
    const [archived, setArchived] = useState([]);
    const [loadingList, setLoadingList] = useState(true);

    // track loading per-note
    const [archivingIds, setArchivingIds] = useState(new Set());
    const [deletingIds, setDeletingIds] = useState(new Set());

    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    const ownerName = currentUser ? (currentUser.name || "You") : null;

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
    useEffect(() => { refresh().then(r => r); }, []);

    async function onToggleArchive(id, isArchived) {
        setArchivingIds(prev => new Set(prev).add(id));
        try {
            await (isArchived ? unarchiveNote(id) : archiveNote(id));
            await refresh();
        } finally {
            setArchivingIds(prev => {
                const ns = new Set(prev); ns.delete(id); return ns;
            });
        }
    }

    async function onDelete(id) {
        if (!window.confirm("Delete this note?")) return;
        setDeletingIds(prev => new Set(prev).add(id));
        try {
            await deleteNote(id);
            await refresh();
        } finally {
            setDeletingIds(prev => {
                const ns = new Set(prev); ns.delete(id); return ns;
            });
        }
    }

    // Loading
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
                    />
                </div>
            ))}
        </div>
    );

    return (
        <div className="p-6">
            <h1 className="mb-4 text-2xl font-semibold">{dict[lang].home}</h1>
            <List items={active} />

            {archived.length > 0 && (
                <>
                    <h2 className="mb-4 mt-10 text-xl font-semibold">{dict[lang].archived}</h2>
                    <List items={archived} />
                </>
            )}

            {/* FAB */}
            <Link
                to="/create"
                className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center
                 rounded-full bg-lime-500 text-black shadow-lg shadow-lime-500/30
                 hover:bg-lime-400 focus:outline-none focus:ring-4 focus:ring-lime-400/50"
                aria-label="Create Note"
                title="Create Note"
            >
                <PlusIcon className="h-7 w-7" />
                <span className="sr-only">Create Note</span>
            </Link>
        </div>
    );
}

export default HomePage;