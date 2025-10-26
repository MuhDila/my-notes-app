import PropTypes from "prop-types";
import {StarIcon, ArchiveBoxArrowDownIcon, ArrowUturnUpIcon, TrashIcon} from "@heroicons/react/24/solid";

// util kecil buat clamp teks tanpa plugin line-clamp
const clamp = (lines) => ({
    display: "-webkit-box",
    WebkitLineClamp: lines,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
});

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

function NoteCard({
                      note,
                      ownerName,
                      onToggleArchive,
                      onDelete,
                      color = "amber",
                  }) {
    const bg = color === "orange" ? "bg-orange-300/90" : "bg-amber-300/90";

    return (
        <div className={`relative rounded-2xl ${bg} p-4 shadow-sm text-neutral-900 w-72`}>
            {note.archived && (
                <StarIcon className="absolute right-3 top-3 h-5 w-5 text-amber-700" />
            )}

            <h3 className="text-base font-semibold" style={clamp(3)} title={note.title}>
                {note.title}
            </h3>

            <p className="mt-2 text-sm/6 text-neutral-800" style={clamp(4)} title={note.body}>
                {note.body}
            </p>

            <div className="mt-6 flex items-center justify-between">
                <div className="text-xs text-neutral-700">
                    <div className="font-medium">{ownerName ?? note.owner}</div>
                    <div>{formatDate(note.createdAt)}</div>
                </div>

                {/* tombol-tombol aksi */}
                <div className="flex items-center gap-2">
                    {/* Archive / Unarchive */}
                    <button
                        type="button"
                        onClick={() => onToggleArchive(note.id, note.archived)}
                        className="grid h-9 w-9 place-items-center rounded-full bg-black/70 text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-black/40"
                        title={note.archived ? "Unarchive" : "Archive"}
                        aria-label={note.archived ? "Unarchive note" : "Archive note"}
                    >
                        {note.archived ? (
                            <ArrowUturnUpIcon className="h-5 w-5" />
                        ) : (
                            <ArchiveBoxArrowDownIcon className="h-5 w-5" />
                        )}
                    </button>

                    {/* Delete */}
                    <button
                        type="button"
                        onClick={() => onDelete(note.id)}
                        className="grid h-9 w-9 place-items-center rounded-full bg-red-600 text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
                        title="Delete"
                        aria-label="Delete note"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

NoteCard.propTypes = {
    note: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        body: PropTypes.string.isRequired,
        owner: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        archived: PropTypes.bool.isRequired,
    }).isRequired,
    ownerName: PropTypes.string,
    onToggleArchive: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    color: PropTypes.oneOf(["amber", "orange"]),
};

export default NoteCard;