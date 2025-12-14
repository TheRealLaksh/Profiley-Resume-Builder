import React, { useState, useRef } from "react";
import {
  Download,
  Plus,
  Trash2,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Heart,
  Globe,
  Mail,
  Linkedin,
  Phone,
  Layout,
  Palette,
  Type,
  Settings,
  Columns,
  Image as ImageIcon,
  Minus,
  CheckCircle,
  FileText,
  Upload,
  X,
  Maximize,
  Clock,
  MapPin,
  Footer,
  GripVertical,
  Eye,
  EyeOff,
  Layers,
  FilePlus
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
  const [activeTab, setActiveTab] = useState("sections");
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const fileInputRef = useRef(null);

  /* ===================== HANDLERS ===================== */

  const handlePersonalChange = (e) => {
    setData({
      ...data,
      personal: { ...data.personal, [e.target.name]: e.target.value }
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setData((prev) => ({
        ...prev,
        personal: { ...prev.personal, photoUrl: reader.result }
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setData((prev) => ({
      ...prev,
      personal: { ...prev.personal, photoUrl: "" }
    }));
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const applyTemplate = (key) => {
    if (templates[key]) {
      setConfig((prev) => ({ ...prev, ...templates[key].config }));
    }
  };

  const toggleSectionVisibility = (id) => {
    setSectionOrder((prev) =>
      prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s))
    );
  };

  const handleDragStart = (_, index) => setDraggedItemIndex(index);

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;

    const updated = [...sectionOrder];
    const [moved] = updated.splice(draggedItemIndex, 1);
    updated.splice(index, 0, moved);

    setSectionOrder(updated);
    setDraggedItemIndex(index);
  };

  const handleDragEnd = () => setDraggedItemIndex(null);

  const addCustomSection = () => {
    const id = `custom-${Date.now()}`;
    setSectionOrder((prev) => [
      ...prev,
      { id, label: "New Custom Section", visible: true, type: "custom" }
    ]);
    setData((prev) => ({
      ...prev,
      custom: {
        ...prev.custom,
        [id]: { title: "Custom Section", content: "Add details here..." }
      }
    }));
    setActiveTab(id);
  };

  const updateCustomSection = (id, field, value) => {
    setData((prev) => ({
      ...prev,
      custom: {
        ...prev.custom,
        [id]: { ...prev.custom[id], [field]: value }
      }
    }));
    if (field === "title") {
      setSectionOrder((prev) =>
        prev.map((s) => (s.id === id ? { ...s, label: value } : s))
      );
    }
  };

  const deleteCustomSection = (id) => {
    setSectionOrder((prev) => prev.filter((s) => s.id !== id));
    setData((prev) => {
      const copy = { ...prev.custom };
      delete copy[id];
      return { ...prev, custom: copy };
    });
    setActiveTab("sections");
  };

  const handleArrayChange = (section, index, field, value) => {
    const updated = [...data[section]];
    updated[index][field] = value;
    setData({ ...data, [section]: updated });
  };

  const addItem = (section, template) => {
    setData({ ...data, [section]: [...data[section], template] });
  };

  const removeItem = (section, index) => {
    setData({
      ...data,
      [section]: data[section].filter((_, i) => i !== index)
    });
  };

  const handleSimpleArrayChange = (section, index, value) => {
    const updated = [...data[section]];
    updated[index] = value;
    setData({ ...data, [section]: updated });
  };

  const printDocument = () => {
    const original = document.title;
    document.title = `${data.personal.name || "Resume"}_CV`;
    window.print();
    setTimeout(() => (document.title = original), 500);
  };

  /* =================================================== */
  /* ===================== JSX ========================= */
  /* =================================================== */

  return (
    <div className="min-h-screen bg-gray-100 flex">

    </div>
  );
};

export default Profiley;
