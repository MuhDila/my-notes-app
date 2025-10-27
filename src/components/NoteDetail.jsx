import PropTypes from "prop-types";
import {
    StarIcon,
    ArchiveBoxArrowDownIcon,
    ArrowUturnUpIcon,
    TrashIcon,
    ArrowPathIcon,
} from "@heroicons/react/24/solid";

function formatDate(iso) {
    try {
        return new Date(iso).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    } catch {
        return iso;
    }
}

function NoteDetail({note, ownerName, onToggleArchive, onDelete, loadingToggle = false, loadingDelete = false,}) {
    if (!note) return null;

    return (
        <article className="mx-auto w-full max-w-2xl rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm
                        dark:border-neutral-800 dark:bg-neutral-900">
            {/* header */}
            <div className="mb-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h1 className="truncate text-xl font-semibold text-neutral-900 dark:text-neutral-50">
                        {note.title}
                    </h1>
                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                        {ownerName} • {formatDate(note.createdAt)}
                    </p>
                </div>

                {note.archived && (
                    <StarIcon className="h-6 w-6 shrink-0 text-amber-500" title="Archived" />
                )}
            </div>

            {/* body */}
            <div className="prose max-w-none text-neutral-800 dark:prose-invert dark:text-neutral-100">
                <p className="whitespace-pre-wrap leading-7">{note.body}</p>
            </div>

            {/* actions */}
            <div className="mt-6 flex justify-end gap-2">
                <button
                    type="button"
                    onClick={() => onToggleArchive(note.id, note.archived)}
                    disabled={loadingToggle || loadingDelete}
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-neutral-900 px-3 text-white
                     hover:bg-black focus:outline-none focus:ring-2 focus:ring-neutral-400
                     disabled:cursor-not-allowed disabled:opacity-60"
                    title={note.archived ? "Unarchive" : "Archive"}
                >
                    {loadingToggle ? (
                        <ArrowPathIcon className="h-5 w-5 animate-spin" />
                    ) : note.archived ? (
                        <ArrowUturnUpIcon className="h-5 w-5" />
                    ) : (
                        <ArchiveBoxArrowDownIcon className="h-5 w-5" />
                    )}
                    <span>{note.archived ? "Unarchive" : "Archive"}</span>
                </button>

                <button
                    type="button"
                    onClick={() => onDelete(note.id)}
                    disabled={loadingToggle || loadingDelete}
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-red-600 px-3 text-white
                     hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400
                     disabled:cursor-not-allowed disabled:opacity-60"
                    title="Delete"
                >
                    {loadingDelete ? (
                        <ArrowPathIcon className="h-5 w-5 animate-spin" />
                    ) : (
                        <TrashIcon className="h-5 w-5" />
                    )}
                    <span>Delete</span>
                </button>
            </div>
        </article>
    );
}

NoteDetail.propTypes = {
    note: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        body: PropTypes.string.isRequired,
        owner: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        archived: PropTypes.bool.isRequired,
    }),
    ownerName: PropTypes.string.isRequired,
    onToggleArchive: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    loadingToggle: PropTypes.bool,
    loadingDelete: PropTypes.bool,
};

export default NoteDetail;