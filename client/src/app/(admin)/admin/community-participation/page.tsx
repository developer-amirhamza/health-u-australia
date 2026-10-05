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
        paragraph2?: string;
        paragraph3?: string;
        bullet_points?: string[];
    };
    images: string[];
    order: number;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

const AdminCommunityParticipationPage= () => {
    const [content, setContent] = useState<ContentPost[]>([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [uploadingImage, setUploadingImage] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

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

    // Fetch Community Participation content from the CMS API.
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

    // Reset the content form.
    const resetForm = () => {
        setForm({
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
    };

    // Open an empty form for a new content section.
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

    // Open the form with an existing section's values.
    const handleEdit = (item: ContentPost) => {
        setEditingId(item.id);

        setForm({
            title1: item.body?.title1 || "",
            title2: item.body?.title2 || "",
            paragraph1: item.body?.paragraph1 || "",
            paragraph2: item.body?.paragraph2 || "",
            paragraph3: item.body?.paragraph3 || "",
            bulletPoints:
                item.body?.bullet_points?.join("\n") || "",
            image: item.images?.[0] || "",
            order: item.order,
            isPublished: item.isPublished,
        });

        setShowForm(true);

        // Move back to the top so the edit form is visible.
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // Close the form without saving.
    const handleCloseForm = () => {
        setShowForm(false);
        setEditingId(null);
        resetForm();
    };

    // Upload a CMS image to Cloudinary.
    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        try {
            setUploadingImage(true);

            const formData = new FormData();

            // Backend middleware expects the multipart field name "image".
            formData.append("image", file);

            const response = await Axios({
                ...SummeryApi.imageUpload,
                data: formData,
            });

            if (response.data?.success) {
                const imageUrl =
                    response.data?.data?.secure_url ||
                    response.data?.data?.url;

                if (!imageUrl) {
                    toast.error("Image URL was not returned");
                    return;
                }

                setForm((previous) => ({
                    ...previous,
                    image: imageUrl,
                }));

                toast.success("Image uploaded successfully");
            } else {
                toast.error(
                    response.data?.message || "Image upload failed"
                );
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setUploadingImage(false);
        }
    };

    // Create a new section or update the section currently being edited.
    const handleSubmit = async () => {
        if (!form.title1.trim()) {
            toast.error("Title 1 is required");
            return;
        }

        if (!form.image) {
            toast.error("Please upload a section image");
            return;
        }

        try {
            setSaving(true);

            const bulletPoints = form.bulletPoints
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean);

            const payload = {
                pageKey: "community_participation",
                section: `community-section-${form.order + 1}`,
                title: `${form.title1} ${form.title2}`.trim(),

                body: {
                    title1: form.title1.trim(),
                    title2: form.title2.trim(),
                    paragraph1: form.paragraph1.trim(),
                    paragraph2: form.paragraph2.trim(),
                    paragraph3: form.paragraph3.trim(),
                    bullet_points: bulletPoints,
                },

                images: [form.image],
                order: form.order,
                isPublished: form.isPublished,
            };

            // If editingId exists, update the existing record.
            // Otherwise create a new record.
            const response = editingId
                ? await Axios({
                      ...SummeryApi.updateContent,
                      data: {
                          id: editingId,
                          ...payload,
                      },
                  })
                : await Axios({
                      ...SummeryApi.createContent,
                      data: payload,
                  });

            if (response.data?.success) {
                toast.success(
                    editingId
                        ? "Content section updated successfully"
                        : "Content section created successfully"
                );

                setShowForm(false);
                setEditingId(null);
                resetForm();

                await fetchContent();
            } else {
                toast.error(
                    response.data?.message ||
                        "Failed to save content section"
                );
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setSaving(false);
        }
    };

    // Delete an existing CMS section.
    const handleDelete = async (item: ContentPost) => {
        const confirmed = window.confirm(
            `Delete "${item.body?.title1 || item.title}"?`
        );

        if (!confirmed) return;

        try {
            setDeletingId(item.id);

            const response = await Axios({
                ...SummeryApi.deleteContent,
                data: {
                    id: item.id,
                },
            });

            if (response.data?.success) {
                toast.success("Content section deleted successfully");

                // Close the form if the deleted section was being edited.
                if (editingId === item.id) {
                    setShowForm(false);
                    setEditingId(null);
                    resetForm();
                }

                await fetchContent();
            } else {
                toast.error(
                    response.data?.message ||
                        "Failed to delete content section"
                );
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="container mx-auto p-4 py-12">

            {/* Page Header */}
            <div className="flex justify-between items-center my-6">
                <div>
                    <h1 className="text-2xl font-bold">
                        Community Participation
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage community participation content from the admin panel.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleAddSection}
                    className="text-sm font-semibold text-white bg-primary hover:bg-secondary transition-colors duration-300 rounded-full px-5 py-2.5"
                >
                    + Add Section
                </button>
            </div>

            {/* Content Count */}
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

            {/* Add / Edit Content Form */}
            {showForm && (
                <div className="bg-white rounded-lg shadow p-6 mt-6 mb-6">

                    {/* Form Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-lg font-bold">
                                {editingId
                                    ? "Edit Section"
                                    : "Add Section"}
                            </h2>

                            {editingId && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Update the content below and save your changes.
                                </p>
                            )}
                        </div>

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

                        {/* Bullet Points */}
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
                                placeholder="One bullet point per line"
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

                        {/* Section Image */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">
                                Section Image
                            </label>

                            {editingId && form.image && (
                                <p className="text-xs text-gray-500 mb-2">
                                    Leave this unchanged to keep the current image,
                                    or choose a new image to replace it.
                                </p>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploadingImage || saving}
                                className="w-full border rounded-md px-3 py-2"
                            />

                            {uploadingImage && (
                                <p className="text-sm text-gray-500 mt-2">
                                    Uploading image...
                                </p>
                            )}

                            {form.image && !uploadingImage && (
                                <div className="mt-3">
                                    <p className="text-sm text-green-600 mb-2">
                                        {editingId
                                            ? "Current section image"
                                            : "Image uploaded successfully"}
                                    </p>

                                    <img
                                        src={form.image}
                                        alt="Content preview"
                                        className="w-48 h-40 object-cover rounded-md border"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Display Order */}
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

                        {/* Published Status */}
                        <div className="flex items-center">
                            <label className="flex items-center gap-2 cursor-pointer mt-6">
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

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={handleCloseForm}
                            disabled={saving}
                            className="px-5 py-2 border rounded-md disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={uploadingImage || saving}
                            className="px-5 py-2 bg-primary text-white rounded-md hover:bg-secondary disabled:opacity-50"
                        >
                            {saving
                                ? editingId
                                    ? "Updating..."
                                    : "Saving..."
                                : editingId
                                  ? "Update Section"
                                  : "Save Section"}
                        </button>
                    </div>
                </div>
            )}

            {/* Existing CMS Content */}
            {!loading && content.length > 0 && (
                <div className="space-y-6 mt-8">
                    {content.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-lg shadow p-6"
                        >
                            <div className="flex flex-col md:flex-row gap-6">

                                {/* Section Image */}
                                {item.images?.[0] && (
                                    <img
                                        src={item.images[0]}
                                        alt={
                                            item.body?.title1 ||
                                            item.title
                                        }
                                        className="w-full md:w-56 h-48 object-cover rounded-lg border"
                                    />
                                )}

                                {/* Section Content */}
                                <div className="flex-1">

                                    {/* Header */}
                                    <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
                                        <div>
                                            <h2 className="text-xl font-bold">
                                                {item.body?.title1 ||
                                                    item.title}
                                            </h2>

                                            {item.body?.title2 && (
                                                <h3 className="text-lg font-semibold mt-1">
                                                    {item.body.title2}
                                                </h3>
                                            )}
                                        </div>

                                        <div className="flex items-start gap-2">

                                            {/* Published Status */}
                                            <span
                                                className={`text-xs px-3 py-1 rounded-full ${
                                                    item.isPublished
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-100 text-gray-600"
                                                }`}
                                            >
                                                {item.isPublished
                                                    ? "Published"
                                                    : "Draft"}
                                            </span>

                                            {/* Edit */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleEdit(item)
                                                }
                                                className="text-sm px-3 py-1 border rounded-md hover:bg-gray-50"
                                            >
                                                Edit
                                            </button>

                                            {/* Delete */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(item)
                                                }
                                                disabled={
                                                    deletingId === item.id
                                                }
                                                className="text-sm px-3 py-1 border border-red-300 text-red-600 rounded-md hover:bg-red-50 disabled:opacity-50"
                                            >
                                                {deletingId === item.id
                                                    ? "Deleting..."
                                                    : "Delete"}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Paragraph 1 */}
                                    {item.body?.paragraph1 && (
                                        <p className="text-gray-600 mt-4">
                                            {item.body.paragraph1}
                                        </p>
                                    )}

                                    {/* Bullet Points */}
                                    {item.body?.bullet_points &&
                                        item.body.bullet_points.length >
                                            0 && (
                                            <ul className="list-disc pl-5 mt-4 space-y-1 text-gray-600">
                                                {item.body.bullet_points.map(
                                                    (bullet, index) => (
                                                        <li key={index}>
                                                            {bullet}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        )}

                                    {/* Paragraph 2 */}
                                    {item.body?.paragraph2 && (
                                        <p className="text-gray-600 mt-4">
                                            {item.body.paragraph2}
                                        </p>
                                    )}

                                    {/* Paragraph 3 */}
                                    {item.body?.paragraph3 && (
                                        <p className="text-gray-600 mt-4">
                                            {item.body.paragraph3}
                                        </p>
                                    )}

                                    <div className="flex flex-wrap gap-4 mt-5 text-xs text-gray-400">
                                        <span>
                                            Display order: {item.order}
                                        </span>

                                        {item.section && (
                                            <span>
                                                Section: {item.section}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && content.length === 0 && !showForm && (
                <div className="bg-white rounded-lg shadow p-8 mt-8 text-center">
                    <p className="text-gray-500">
                        No content sections have been created yet.
                    </p>

                    <button
                        type="button"
                        onClick={handleAddSection}
                        className="mt-4 text-sm font-semibold text-primary"
                    >
                        Create your first section
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminCommunityParticipationPage;