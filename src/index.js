import {createRoot} from "react-dom/client";
import NotesApp from "./components/NotesApp";
import {BrowserRouter} from "react-router-dom";

import './styles/index.css';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <NotesApp />
    </BrowserRouter>
);