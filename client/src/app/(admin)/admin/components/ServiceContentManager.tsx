
'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SummeryApi } from 'app/common/SummeryApi';
import Axios from 'utils/Axios';
import AxiosToastError from 'utils/AxiosToastError';
import toast from 'react-hot-toast';

type Bullet = { keyword: string; text: string };

type Body = {
  title1: string;
  title2: string;
  title3: string;
  title4: string;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
  bullet_title: string;
  bullet_points: Bullet[];
};

type Post = {
  id: string;
  pageKey: string;
  title: string;
  section: string | null;
  body: unknown;
  images: unknown;
  order: number;
  isPublished: boolean;
};

type Form = {
  body: Body;
  image: string;
  order: number;
  isPublished: boolean;
};

const blankBody = (): Body => ({
  title1: '',
  title2: '',
  title3: '',
  title4: '',
  paragraph1: '',
  paragraph2: '',
  paragraph3: '',
  bullet_title: '',
  bullet_points: [],
});

const blankForm = (order = 0): Form => ({
  body: blankBody(),
  image: '',
  order,
  isPublished: true,
});

function parseBody(value: unknown): Body {
  let parsed: unknown = value;

  if (typeof value === 'string') {
    try {
      parsed = JSON.parse(value);
    } catch {
      parsed = { paragraph1: value };
    }
  }

  const obj =
    parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};

  const result = blankBody();

  (
    [
      'title1',
      'title2',
      'title3',
      'title4',
      'paragraph1',
      'paragraph2',
      'paragraph3',
      'bullet_title',
    ] as const
  ).forEach((key) => {
    if (typeof obj[key] === 'string') {
      result[key] = obj[key] as string;
    }
  });

  result.bullet_points = Array.isArray(obj.bullet_points)
    ? obj.bullet_points.map((item: unknown) => {
        if (typeof item === 'string') {
          return { keyword: '', text: item };
        }

        if (item && typeof item === 'object') {
          const bullet = item as Record<string, unknown>;

          return {
            keyword:
              typeof bullet.keyword === 'string'
                ? bullet.keyword
                : '',
            text:
              typeof bullet.text === 'string'
                ? bullet.text
                : '',
          };
        }

        return { keyword: '', text: '' };
      })
    : [];

  return result;
}

function firstImage(images: unknown): string {
  if (!Array.isArray(images) || !images.length) return '';

  const first: unknown = images[0];

  if (typeof first === 'string') return first;

  if (
    first &&
    typeof first === 'object' &&
    'url' in first &&
    typeof first.url === 'string'
  ) {
    return first.url;
  }

  return '';
}

function apiSuccess(payload: any): boolean {
  return (
    payload?.success === true ||
    (payload?.success === undefined && payload?.error === false)
  );
}

export default function ServiceContentManager({
  pageKey,
  pageTitle,
}: {
  pageKey: string;
  pageTitle: string;
}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [form, setForm] = useState<Form>(blankForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [draftWarning, setDraftWarning] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);

    try {
      const response = await Axios({
        ...SummeryApi.getContent,
        params: { pageKey },
      });

      if (!apiSuccess(response.data)) {
        throw new Error(
          response.data?.message || 'Failed to load sections'
        );
      }

      const list = Array.isArray(response.data?.data)
        ? (response.data.data as Post[])
        : [];

      setPosts(
        list
          .filter((post) => post.pageKey === pageKey)
          .sort((a, b) => a.order - b.order)
      );
    } catch (err) {
      AxiosToastError(err);
    } finally {
      setLoading(false);
    }
  }, [pageKey]);

  useEffect(() => {
    setShowForm(false);
    setEditingId(null);
    setForm(blankForm());
    void load();
  }, [load]);

  const setBodyField = (
    key: Exclude<keyof Body, 'bullet_points'>,
    value: string
  ) => {
    setForm((old) => ({
      ...old,
      body: { ...old.body, [key]: value },
    }));
  };

  const startNew = () => {
    setEditingId(null);
    setForm(blankForm(posts.length));
    setShowForm(true);
  };

  const edit = (post: Post) => {
    setEditingId(post.id);

    setForm({
      body: parseBody(post.body),
      image: firstImage(post.images),
      order: post.order,
      isPublished: post.isPublished,
    });

    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const close = () => {
    setEditingId(null);
    setShowForm(false);
    setForm(blankForm());
  };

  const addBullet = () => {
    setForm((old) => ({
      ...old,
      body: {
        ...old.body,
        bullet_points: [
          ...old.body.bullet_points,
          { keyword: '', text: '' },
        ],
      },
    }));
  };

  const changeBullet = (
    index: number,
    field: keyof Bullet,
    value: string
  ) => {
    setForm((old) => ({
      ...old,
      body: {
        ...old.body,
        bullet_points: old.body.bullet_points.map((bullet, i) =>
          i === index ? { ...bullet, [field]: value } : bullet
        ),
      },
    }));
  };

  const removeBullet = (index: number) => {
    setForm((old) => ({
      ...old,
      body: {
        ...old.body,
        bullet_points: old.body.bullet_points.filter(
          (_, i) => i !== index
        ),
      },
    }));
  };

  const uploadImage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (
      !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
    ) {
      toast.error('Select JPG, PNG or WebP');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be smaller than 10 MB');
      return;
    }

    setUploading(true);

    try {
      const data = new FormData();
      data.append('image', file);

      const response = await Axios({
        ...SummeryApi.imageUpload,
        data,
      });

      if (!apiSuccess(response.data)) {
        throw new Error(
          response.data?.message || 'Upload failed'
        );
      }

      const url =
        response.data?.data?.secure_url ||
        response.data?.data?.url;

      if (typeof url !== 'string' || !url) {
        throw new Error(
          'Cloudinary did not return an image URL'
        );
      }

      setForm((old) => ({
        ...old,
        image: url,
      }));

      toast.success('Image uploaded');
    } catch (err) {
      AxiosToastError(err);
    } finally {
      setUploading(false);

      if (fileRef.current) {
        fileRef.current.value = '';
      }
    }
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.body.title1.trim()) {
      return toast.error('Heading 1 is required');
    }

    if (!form.image) {
      return toast.error('Upload a section image');
    }

    setSaving(true);

    try {
      
const bullets = form.body.bullet_points
    .filter((bullet) => bullet.text.trim())
    .map((bullet) => ({
        keyword: bullet.keyword.trim(),
        text: bullet.text.trim(),
    }));

const bullet_points = bullets.every(
    (bullet) => !bullet.keyword
)
    ? bullets.map((bullet) => bullet.text)
    : bullets;

const payload = {
    pageKey,
    section: `section-${form.order + 1}`,
    title: `${form.body.title1} ${form.body.title2}`.trim(),
    body: {
        ...form.body,
        bullet_points,
    },
    images: [form.image],
    order: Number(form.order),
    isPublished: form.isPublished,
};


      const response = editingId
        ? await Axios({
            ...SummeryApi.updateContent,
            data: { id: editingId, ...payload },
          })
        : await Axios({
            ...SummeryApi.createContent,
            data: payload,
          });

      if (!apiSuccess(response.data)) {
        throw new Error(
          response.data?.message || 'Save failed'
        );
      }

      toast.success(
        editingId ? 'Section updated' : 'Section created'
      );

      if (!form.isPublished) {
        setDraftWarning(true);
      }

      close();
      await load();
    } catch (err) {
      AxiosToastError(err);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (post: Post) => {
    if (
      !window.confirm(
        `Delete "${post.title}" permanently?`
      )
    ) {
      return;
    }

    setBusyId(post.id);

    try {
      const response = await Axios({
        ...SummeryApi.deleteContent,
        data: { id: post.id },
      });

      if (!apiSuccess(response.data)) {
        throw new Error(
          response.data?.message || 'Delete failed'
        );
      }

      toast.success('Section deleted');

      if (editingId === post.id) {
        close();
      }

      await load();
    } catch (err) {
      AxiosToastError(err);
    } finally {
      setBusyId(null);
    }
  };

  const togglePublish = async (post: Post) => {
    if (
      post.isPublished &&
      !window.confirm(
        'Unpublish this section? It will disappear from the current list until admin draft retrieval is enabled.'
      )
    ) {
      return;
    }

    setBusyId(post.id);

    try {
      const response = await Axios({
        ...SummeryApi.updateContent,
        data: {
          id: post.id,
          isPublished: !post.isPublished,
        },
      });

      if (!apiSuccess(response.data)) {
        throw new Error(
          response.data?.message || 'Status update failed'
        );
      }

      if (post.isPublished) {
        setDraftWarning(true);
      }

      toast.success('Publication status updated');
      await load();
    } catch (err) {
      AxiosToastError(err);
    } finally {
      setBusyId(null);
    }
  };

  const move = async (
    index: number,
    delta: -1 | 1
  ) => {
    const other = posts[index + delta];
    const current = posts[index];

    if (!other || !current) return;

    setBusyId(current.id);

    try {
      const temp =
        Math.max(0, ...posts.map((post) => post.order)) + 1000;

      const updates = [
        { id: current.id, order: temp },
        { id: other.id, order: current.order },
        { id: current.id, order: other.order },
      ];

      for (const data of updates) {
        const response = await Axios({
          ...SummeryApi.updateContent,
          data,
        });

        if (!apiSuccess(response.data)) {
          throw new Error(
            response.data?.message || 'Reorder failed'
          );
        }
      }

      toast.success('Order updated');
      await load();
    } catch (err) {
      AxiosToastError(err);
      await load();
    } finally {
      setBusyId(null);
    }
  };

  const input =
    'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary';

  const headings = [
    'title1',
    'title2',
    'title3',
    'title4',
  ] as const;

  const paragraphs = [
    'paragraph1',
    'paragraph2',
    'paragraph3',
  ] as const;

  return (
    <div className="container mx-auto space-y-6 p-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {pageTitle}
          </h1>
          <p className="text-sm text-gray-500">
            Manage website content sections
          </p>
        </div>

        <button
          type="button"
          onClick={startNew}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-secondary"
        >
          + Add Section
        </button>
      </div>

      {draftWarning && (
        <p
          role="alert"
          className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900"
        >
          Drafts are not returned by the existing public
          getContent endpoint. Add an authenticated admin
          listing endpoint before managing drafts.
        </p>
      )}

      {showForm && (
        <form
          onSubmit={save}
          className="space-y-5 rounded-xl border bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {editingId ? 'Edit Section' : 'Add Section'}
            </h2>

            <button
              type="button"
              onClick={close}
              className="text-sm text-gray-500"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {headings.map((key, i) => (
              <label
                key={key}
                className="block text-sm font-medium"
              >
                Heading {i + 1}
                <input
                  className={`${input} mt-1`}
                  value={form.body[key]}
                  onChange={(e) =>
                    setBodyField(key, e.target.value)
                  }
                />
              </label>
            ))}

            {paragraphs.map((key, i) => (
              <label
                key={key}
                className="block text-sm font-medium md:col-span-2"
              >
                Paragraph {i + 1}
                <textarea
                  rows={4}
                  className={`${input} mt-1`}
                  value={form.body[key]}
                  onChange={(e) =>
                    setBodyField(key, e.target.value)
                  }
                />
              </label>
            ))}
          </div>

          <div className="space-y-3 border-t pt-4">
            <label className="block text-sm font-medium">
              Bullet List Heading
              <input
                className={`${input} mt-1`}
                value={form.body.bullet_title}
                onChange={(e) =>
                  setBodyField(
                    'bullet_title',
                    e.target.value
                  )
                }
              />
            </label>

            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                Bullet Points
              </h3>

              <button
                type="button"
                onClick={addBullet}
                className="rounded-md border px-3 py-2 text-sm"
              >
                + Add Bullet
              </button>
            </div>

            {form.body.bullet_points.map((bullet, index) => (
              <div
                key={index}
                className="grid gap-2 md:grid-cols-[1fr_2fr_auto]"
              >
                <input
                  className={input}
                  placeholder="Keyword (optional)"
                  value={bullet.keyword}
                  onChange={(e) =>
                    changeBullet(
                      index,
                      'keyword',
                      e.target.value
                    )
                  }
                />

                <input
                  className={input}
                  placeholder="Bullet text"
                  value={bullet.text}
                  onChange={(e) =>
                    changeBullet(
                      index,
                      'text',
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  onClick={() => removeBullet(index)}
                  className="rounded-md border border-red-300 px-3 py-2 text-sm text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-3 border-t pt-4">
            <h3 className="font-semibold">
              Section Image
            </h3>

            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={uploadImage}
              disabled={uploading}
              className="block w-full text-sm"
            />

            {uploading && (
              <p className="text-sm text-gray-500">
                Uploading image to Cloudinary...
              </p>
            )}

            {form.image && (
              <div className="flex items-start gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.image}
                  alt="Section preview"
                  className="h-36 w-48 rounded-md object-cover"
                />

                <button
                  type="button"
                  onClick={() =>
                    setForm((old) => ({
                      ...old,
                      image: '',
                    }))
                  }
                  className="text-sm text-red-600"
                >
                  Remove image
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-6 border-t pt-4">
            <label className="text-sm font-medium">
              Order
              <input
                type="number"
                className={`${input} mt-1 w-28`}
                value={form.order}
                onChange={(e) =>
                  setForm((old) => ({
                    ...old,
                    order: Number(e.target.value),
                  }))
                }
              />
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) =>
                  setForm((old) => ({
                    ...old,
                    isPublished: e.target.checked,
                  }))
                }
              />
              Published
            </label>
          </div>

          <button
            type="submit"
            disabled={saving || uploading}
            className="rounded-full bg-primary px-6 py-3 font-semibold text-white disabled:opacity-50"
          >
            {saving
              ? 'Saving...'
              : editingId
                ? 'Update Section'
                : 'Create Section'}
          </button>
        </form>
      )}

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">
          Existing Sections ({posts.length})
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : posts.length === 0 ? (
          <p className="rounded-md border p-4 text-gray-500">
            No published sections found.
          </p>
        ) : (
          posts.map((post, index) => {
            const body = parseBody(post.body);
            const image = firstImage(post.images);

            return (
              <div
                key={post.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  {image && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={image}
                      alt=""
                      className="h-20 w-24 rounded object-cover"
                    />
                  )}

                  <div>
                    <h3 className="font-semibold">
                      {body.title1 || post.title}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {body.title2}
                    </p>

                    <p className="text-xs text-gray-500">
                      Order {post.order} ·{' '}
                      {post.isPublished
                        ? 'Published'
                        : 'Draft'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={
                      busyId !== null || index === 0
                    }
                    onClick={() => move(index, -1)}
                    className="rounded border px-3 py-1.5 disabled:opacity-40"
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    disabled={
                      busyId !== null ||
                      index === posts.length - 1
                    }
                    onClick={() => move(index, 1)}
                    className="rounded border px-3 py-1.5 disabled:opacity-40"
                  >
                    ↓
                  </button>

                  <button
                    type="button"
                    onClick={() => edit(post)}
                    className="rounded border px-3 py-1.5"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    disabled={busyId !== null}
                    onClick={() => togglePublish(post)}
                    className="rounded border px-3 py-1.5 disabled:opacity-40"
                  >
                    {post.isPublished
                      ? 'Unpublish'
                      : 'Publish'}
                  </button>

                  <button
                    type="button"
                    disabled={busyId !== null}
                    onClick={() => remove(post)}
                    className="rounded border border-red-300 px-3 py-1.5 text-red-600 disabled:opacity-40"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
