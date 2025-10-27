import TopBar from "../components/TopBar";
import PropTypes from "prop-types";

export default function PrivateLayout({ title, children }) {
    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
            <TopBar title={title} />
            <main className="mx-auto max-w-screen-xl px-4 py-6">{children}</main>
        </div>
    );
}

PrivateLayout.propTypes = {
    title: PropTypes.string,
    children: PropTypes.node,
};