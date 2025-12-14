import React, { useState, useRef } from "react";
import {
    Layout,
    Download
} from "lucide-react";

/* ✅ IMPORTED CONSTANTS */
import { initialData } from "../constants/initialData";
import { initialConfig } from "../constants/initialConfig";
import { initialSections } from "../constants/sections";
import { colorThemes } from "../constants/themes";
import { templates } from "../constants/templates";

const Profiley = () => {
    const [data, setData] = useState(initialData);
    const [config, setConfig] = useState(initialConfig);
    const [sectionOrder, setSectionOrder] = useState(initialSections);
    const fileInputRef = useRef(null);

    const printDocument = () => {
        const original = document.title;
        document.title = `${data.personal.name || "Resume"}_CV`;
        window.print();
        setTimeout(() => (document.title = original), 500);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* LEFT PANEL */}
            <div className="w-80 bg-white border-r border-gray-200 p-4">
                <h2 className="text-lg font-bold mb-4">Profiley</h2>
                <p className="text-sm text-gray-500">
                    Editor panel (coming next)
                </p>
            </div>

            {/* RIGHT PANEL */}
            <div className="flex-1 flex items-center justify-center">
                <div className="bg-white w-[21cm] h-[29.7cm] shadow-xl flex items-center justify-center">
                    <span className="text-gray-400 font-medium">
                        Resume preview (coming next)
                    </span>
                </div>
            </div>
        </div>
    );

};

export default Profiley;
