import { useState } from "react";
import PropTypes from "prop-types";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

function CreateInput({ create, loading = false }) {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();
        if (!loading) create({ title, body });
    };

    return (
        <form onSubmit={onSubmit} className="w-full max-w-sm space-y-3" aria-busy={loading}>
            {/* Title */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Title</label>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={loading}
                    className="h-11 w-full text-black rounded-lg border border-neutral-300 px-3 outline-none focus:ring-2 focus:ring-lime-400 disabled:opacity-60 disabled:cursor-not-allowed"
                />
            </div>

            {/* Body */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Body</label>
                <textarea
                    placeholder="Write your note..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    disabled={loading}
                    className="min-h-[140px] w-full text-black rounded-lg border border-neutral-300 p-3 outline-none focus:ring-2 focus:ring-lime-400 disabled:opacity-60 disabled:cursor-not-allowed"
                />
            </div>

            <button
                type="submit"
                disabled={loading || !title || !body}
                className="mt-2 h-11 w-full rounded-lg bg-lime-500 font-medium text-black hover:bg-lime-400 disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <span className="inline-flex items-center gap-2">
            <ArrowPathIcon className="h-5 w-5 animate-spin" /> Saving...
          </span>
                ) : (
                    "Save"
                )}
            </button>
        </form>
    );
}

CreateInput.propTypes = {
    create: PropTypes.func.isRequired,
    loading: PropTypes.bool,
};

export default CreateInput;