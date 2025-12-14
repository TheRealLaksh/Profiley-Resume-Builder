import React, { useState, useRef } from "react";
import LeftPanel from "../components/layout/LeftPanel";
import RightPanel from "../components/layout/RightPanel";
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
    <LeftPanel />
    <RightPanel />
  </div>
);

};

export default Profiley;
