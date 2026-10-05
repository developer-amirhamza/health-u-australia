"use client";

import React, { useEffect, useState } from "react";
import { SummeryApi } from "app/common/SummeryApi";
import Axios from "utils/Axios";
import AxiosToastError from "utils/AxiosToastError";
import toast from "react-hot-toast";

interface ContentPost {
    id: string;
    pageKey: string;
    section: string | null;
    title: string;
    slug: string | null;
    body: {
        title1?: string;
        title2?: string;
        paragraph1?: string;
        bullet_points?: string[];
        paragraph2?: string;
        paragraph3?: string;
    };
    images: string[];
    order: number;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

const AdminContentManagementPage = () => {
    const [content, setContent] = useState<ContentPost[]>([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [form, setForm] = useState({
        title1: "",
        title2: "",
        paragraph1: "",
        paragraph2: "",
        paragraph3: "",
        bulletPoints: "",
        image: "",
        order: 0,
        isPublished: true,
    });

    const fetchContent = async () => {
        try {
            setLoading(true);

            const response = await Axios({
                ...SummeryApi.getContent,
                params: {
                    pageKey: "community_participation",
                },
            });

            if (response.data?.success) {
                setContent(response.data.data || []);
            } else {
                toast.error(
                    response.data?.message || "Failed to fetch content"
                );
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    const handleAddSection = () => {
        setEditingId(null);

        setForm({
            title1: "",
            title2: "",
            paragraph1: "",
            paragraph2: "",
            paragraph3: "",
            bulletPoints: "",
            image: "",
            order: content.length,
            isPublished: true,
        });

        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingId(null);
    };
    const handleSubmit = async () => {
    if (!form.title1.trim()) {
        toast.error("Title 1 is required");
        return;
    }

    try {
        const bulletPoints = form.bulletPoints
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean);

        const data = {
            pageKey: "community_participation",
            section: `community-section-${form.order + 1}`,
            title: `${form.title1} ${form.title2}`.trim(),

            body: {
                title1: form.title1.trim(),
                title2: form.title2.trim(),
                paragraph1: form.paragraph1.trim(),
                bullet_points: bulletPoints,
                paragraph2: form.paragraph2.trim(),
                paragraph3: form.paragraph3.trim(),
            },

            images: form.image ? [form.image] : [],
            order: form.order,
            isPublished: form.isPublished,
        };

        const response = await Axios({
            ...SummeryApi.createContent,
            data,
        });

        if (response.data?.success) {
            toast.success("Content section created successfully");

            setShowForm(false);
            setEditingId(null);

            await fetchContent();
        } else {
            toast.error(
                response.data?.message || "Failed to create content"
            );
        }
    } catch (error) {
        AxiosToastError(error);
    }
};

    return (
        <div className="container mx-auto p-4 py-12">

            {/* Page header */}
            <div className="flex justify-between items-center my-6">
                <div>
                    <h1 className="text-2xl font-bold">
                        Content Management
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage website content from the admin panel.
                    </p>
                </div>

                <button
                    onClick={handleAddSection}
                    className="text-sm font-semibold text-white bg-primary hover:bg-secondary transition-colors duration-300 rounded-full px-5 py-2.5"
                >
                    + Add Section
                </button>
            </div>

            {/* Content count */}
            {loading ? (
                <p className="mt-6 text-gray-500">
                    Loading content...
                </p>
            ) : (
                <p className="mt-6 text-gray-500">
                    {content.length} content section
                    {content.length !== 1 ? "s" : ""} found.
                </p>
            )}

            {/* Add / Edit form */}
            {showForm && (
    <div className="bg-white rounded-lg shadow p-6 mt-6 mb-6">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">
                {editingId ? "Edit Section" : "Add Section"}
            </h2>

            <button
                type="button"
                onClick={handleCloseForm}
                className="text-gray-500 hover:text-gray-800 text-2xl"
            >
                ×
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Title 1 */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Title 1
                </label>
                <input
                    type="text"
                    value={form.title1}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            title1: e.target.value,
                        })
                    }
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="Enter first title"
                />
            </div>

            {/* Title 2 */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Title 2
                </label>
                <input
                    type="text"
                    value={form.title2}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            title2: e.target.value,
                        })
                    }
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="Enter second title"
                />
            </div>

            {/* Paragraph 1 */}
            <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                    Paragraph 1
                </label>
                <textarea
                    value={form.paragraph1}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            paragraph1: e.target.value,
                        })
                    }
                    rows={4}
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="Enter paragraph"
                />
            </div>

            {/* Bullet points */}
            <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                    Bullet Points
                </label>
                <textarea
                    value={form.bulletPoints}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            bulletPoints: e.target.value,
                        })
                    }
                    rows={5}
                    className="w-full border rounded-md px-3 py-2"
                    placeholder={"One bullet point per line"}
                />

                <p className="text-xs text-gray-500 mt-1">
                    Enter one bullet point per line.
                </p>
            </div>

            {/* Paragraph 2 */}
            <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                    Paragraph 2
                </label>
                <textarea
                    value={form.paragraph2}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            paragraph2: e.target.value,
                        })
                    }
                    rows={4}
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="Optional second paragraph"
                />
            </div>

            {/* Paragraph 3 */}
            <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                    Paragraph 3
                </label>
                <textarea
                    value={form.paragraph3}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            paragraph3: e.target.value,
                        })
                    }
                    rows={4}
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="Optional third paragraph"
                />
            </div>

            {/* Image */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Image
                </label>

                <select
                    value={form.image}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            image: e.target.value,
                        })
                    }
                    className="w-full border rounded-md px-3 py-2"
                >
                    <option value="">Select image</option>
                    <option value="community_participation1">
                        Community Participation Image 1
                    </option>
                    <option value="community_participation2">
                        Community Participation Image 2
                    </option>
                    <option value="community_participation3">
                        Community Participation Image 3
                    </option>
                    <option value="community_participation4">
                        Community Participation Image 4
                    </option>
                </select>
            </div>

            {/* Order */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Display Order
                </label>

                <input
                    type="number"
                    min="0"
                    value={form.order}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            order: Number(e.target.value),
                        })
                    }
                    className="w-full border rounded-md px-3 py-2"
                />
            </div>

            {/* Published */}
            <div className="md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={form.isPublished}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                isPublished: e.target.checked,
                            })
                        }
                    />

                    <span className="text-sm font-medium">
                        Published
                    </span>
                </label>
            </div>

        </div>

        <div className="flex justify-end gap-3 mt-6">
            <button
                type="button"
                onClick={handleCloseForm}
                className="px-5 py-2 border rounded-md"
            >
                Cancel
            </button>

            <button
                type="button"
                onClick={handleSubmit}
                className="px-5 py-2 bg-primary text-white rounded-md hover:bg-secondary"
            >
                {editingId ? "Update Section" : "Save Section"}
            </button>
        </div>
    </div>
)}

        </div>
    );
};

export default AdminContentManagementPage;