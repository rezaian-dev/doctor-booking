// 📝 Article editor — Tiptap (offline, no CDN, no hydration issues). All interactive
//    elements use shadcn/ui (ToolbarBtn wraps <Button>, CardHead wraps <Card>). ✅
'use client';

import { useActionState, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapLink from '@tiptap/extension-link';
import TiptapImage from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
  LoaderCircle, FileText, ImageIcon, Tag, User, AlignLeft, CheckCircle2,
  Bold, Italic, List, ListOrdered, Quote, Link2, Undo, Redo,
  Heading2, Heading3, Upload, X,
} from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button, ButtonLink } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils/cn';
import type { ArticleFormState } from '@/lib/actions/articles';

interface ArticleData {
  title?:      string;
  content?:    string;
  excerpt?:    string;
  coverImage?: string;
  author?:     string;
  status?:     string;
  tags?:       string[];
}
interface Props {
  action:       (s: ArticleFormState, f: FormData) => Promise<ArticleFormState>;
  initialData?: ArticleData;
  submitLabel:  string;
}

// 🔘 Tiptap toolbar button — wraps <Button> ghost variant
function ToolbarBtn({
  onClick, active, disabled, title, children,
}: {
  onClick: () => void; active?: boolean; disabled?: boolean;
  title: string; children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant={active ? 'default' : 'ghost'}
      size="icon-sm"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'size-8',
        active && 'shadow-sm',
      )}
    >
      {children}
    </Button>
  );
}

// ─── Divider between toolbar groups ──────────────────────────────────────────
const ToolbarDivider = () => <Separator orientation="vertical" className="mx-1 h-5 shrink-0" />;

// 🏷️ Field label — wraps shadcn <Label>
function FL({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <Label className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
      {children}
      {required && <span className="text-sm font-normal normal-case text-danger-500">*</span>}
    </Label>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ArticleForm({ action, initialData = {}, submitLabel }: Props) {
  const [status,  setStatus]  = useState(initialData.status  ?? 'draft');
  const [content, setContent] = useState(initialData.content ?? '');

  // 🖼️ Cover image — uploaded to /api/articles/cover, submitted via hidden input
  const [coverImage,    setCoverImage]    = useState(initialData.coverImage ?? '');
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverFileRef = useRef<HTMLInputElement>(null);
  const pickCover = () => coverFileRef.current?.click();

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const fd = new FormData();
      fd.append('cover', file);
      const res  = await fetch('/api/articles/cover', { method: 'POST', body: fd });
      const data = (await res.json()) as { url?: string; error?: string }; // 🧠 typed, no implicit any
      if (!res.ok || !data.url) throw new Error(data.error ?? 'آپلود ناموفق');
      setCoverImage(data.url); // ✅ store public URL
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'آپلود ناموفق');
    } finally {
      setUploadingCover(false);
      if (coverFileRef.current) coverFileRef.current.value = ''; // 🔄 allow re-upload of same file
    }
  };

  // 🖼️ In-content image — uploaded to the same endpoint, inserted into the editor at the cursor
  const [uploadingImage, setUploadingImage] = useState(false);
  const contentImageRef = useRef<HTMLInputElement>(null);
  const pickContentImage = () => contentImageRef.current?.click();

  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append('cover', file); // 🔁 reuse the existing /api/articles/cover uploader
      const res  = await fetch('/api/articles/cover', { method: 'POST', body: fd });
      const data = (await res.json()) as { url?: string; error?: string }; // 🧠 typed, no implicit any
      if (!res.ok || !data.url) throw new Error(data.error ?? 'آپلود ناموفق');
      // 📥 Insert at the caret; alt falls back to the file name for a11y
      editor.chain().focus().setImage({ src: data.url, alt: file.name }).run();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'آپلود ناموفق');
    } finally {
      setUploadingImage(false);
      if (contentImageRef.current) contentImageRef.current.value = ''; // 🔄 allow re-upload of same file
    }
  };

  // 🖊️ Tiptap editor — fully offline; immediatelyRender:false prevents SSR mismatch
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading:     { levels: [2, 3] },
        bulletList:  { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      TiptapLink.configure({ openOnClick: false, autolink: true }),
      // 🖼️ In-content images — block node so <img> in saved HTML survives load/save
      TiptapImage.configure({ HTMLAttributes: { class: 'article-content-image' } }),
      Placeholder.configure({ placeholder: 'محتوای مقاله را اینجا بنویسید...' }),
    ],
    content: initialData.content ?? '',
    editorProps: { attributes: { class: 'tiptap-editor focus:outline-none', dir: 'rtl' } },
    onUpdate: ({ editor: e }) => setContent(e.getHTML()),
    immediatelyRender: false,
  });

  const wrappedAction = async (prev: ArticleFormState, formData: FormData): Promise<ArticleFormState> => {
    formData.set('content', editor?.getHTML() ?? content);
    const result = await action(prev, formData);
    if (result?.error) toast.error(result.error);
    return result;
  };

  const [, formAction, isPending] = useActionState(wrappedAction, {});
  const editorReady = !!editor;

  return (
    <form action={formAction} className="space-y-5 pb-10">

      {/* ══ Meta card ══════════════════════════════════════════════════════════ */}
      <Card className="gap-0 overflow-hidden p-0">
        <CardHeader className="flex items-center gap-3 border-b border-neutral-100 px-6 py-4 [.border-b]:pb-4">
          {/* 🟦 Section icon */}
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
            <FileText size={15} />
          </span>
          <span className="text-sm font-semibold text-neutral-800">اطلاعات مقاله</span>
        </CardHeader>

        <CardContent className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
          {/* 🖼️ Cover image uploader */}
          <div className="sm:col-span-2">
            <FL>تصویر کاور</FL>
            {/* 📨 Submitted with the form; updated by the uploader below */}
            <input type="hidden" name="coverImage" value={coverImage} />
            <input ref={coverFileRef} type="file" accept="image/jpeg,image/png,image/webp"
              className="hidden" onChange={handleCoverUpload} />

            <div className="group relative aspect-16/7 w-full overflow-hidden rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 transition-colors hover:border-primary-300">
              {uploadingCover ? (
                <div className="flex h-full items-center justify-center">
                  <LoaderCircle size={26} className="animate-spin text-primary-500" />
                </div>
              ) : coverImage ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img key={coverImage} src={coverImage} alt="کاور مقاله" className="size-full object-cover" />
                  {/* 🌑 Hover overlay with change / remove actions */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-neutral-900/45 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button type="button" size="sm" onClick={pickCover}>
                      <Upload size={14} /> تغییر
                    </Button>
                    <Button type="button" size="sm" variant="destructive" onClick={() => setCoverImage('')}>
                      <X size={14} /> حذف
                    </Button>
                  </div>
                </>
              ) : (
                <button type="button" onClick={pickCover}
                  className="flex size-full flex-col items-center justify-center gap-1.5 text-neutral-400 transition-colors hover:text-primary-500">
                  <ImageIcon size={28} />
                  <span className="text-sm font-medium">آپلود تصویر کاور</span>
                  <span className="text-xs">PNG، JPG یا WebP — حداکثر ۵ مگابایت</span>
                </button>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="sm:col-span-2">
            <FL required>عنوان مقاله</FL>
            <Input name="title" defaultValue={initialData.title} required placeholder="عنوان جذاب مقاله را بنویسید..." />
          </div>

          {/* Author */}
          <div>
            <FL>نویسنده</FL>
            <div className="relative">
              <User size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <Input name="author" defaultValue={initialData.author} className="pr-9" placeholder="نام نویسنده" />
            </div>
          </div>

          {/* Status select */}
          <div>
            <FL>وضعیت انتشار</FL>
            <input type="hidden" name="status" value={status} />
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">
                  <span className="flex items-center gap-2">
                    {/* 🔘 status dot — size-2 canonical */}
                    <span className="size-2 shrink-0 rounded-full bg-neutral-400" />پیش‌نویس
                  </span>
                </SelectItem>
                <SelectItem value="published">
                  <span className="flex items-center gap-2">
                    <span className="size-2 shrink-0 rounded-full bg-secondary-500" />منتشر شده
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div>
            <FL>تگ‌ها</FL>
            <div className="relative">
              <Tag size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <Input name="tags" defaultValue={(initialData.tags ?? []).join(', ')} className="pr-9" placeholder="سلامت, قلب, تغذیه" />
            </div>
            <p className="mt-1 text-xs text-neutral-400">با کاما جدا کنید</p>
          </div>

          {/* Excerpt */}
          <div className="sm:col-span-2">
            <FL>خلاصه مقاله</FL>
            <Textarea name="excerpt" defaultValue={initialData.excerpt} rows={3}
              className="resize-none" placeholder="یک خلاصه کوتاه و جذاب از مقاله..." />
          </div>
        </CardContent>
      </Card>

      {/* ══ Content editor card ═════════════════════════════════════════════════ */}
      <Card className="gap-0 overflow-hidden p-0">
        <CardHeader className="flex items-center gap-3 border-b border-neutral-100 px-6 py-4 [.border-b]:pb-4">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
            <AlignLeft size={15} />
          </span>
          <span className="text-sm font-semibold text-neutral-800">
            محتوای مقاله <span className="text-danger-500 mr-0.5">*</span>
          </span>
          {/* 🟢 Editor ready badge */}
          <Badge variant={editorReady ? 'success' : 'secondary'} className="mr-auto gap-1.5">
            {editorReady
              ? <><CheckCircle2 size={11} />آماده</>
              : <><LoaderCircle size={11} className="animate-spin" />در حال بارگذاری</>
            }
          </Badge>
        </CardHeader>

        <CardContent className="p-6">
          <input type="hidden" name="content" value={content} />

          {/* 🖼️ Hidden picker used by the toolbar "image" button */}
          <input ref={contentImageRef} type="file" accept="image/jpeg,image/png,image/webp"
            className="hidden" onChange={handleContentImageUpload} />

          {/* Tiptap editor box */}
          <div className="overflow-hidden rounded-xl border border-neutral-200 transition-all duration-200 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100">

            {/* Toolbar */}
            {editor && (
              <div className="flex flex-wrap items-center gap-0.5 border-b border-neutral-200 bg-neutral-50 px-3 py-2">
                <ToolbarBtn title="عنوان ۲" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  active={editor.isActive('heading', { level: 2 })}><Heading2 size={15} /></ToolbarBtn>
                <ToolbarBtn title="عنوان ۳" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  active={editor.isActive('heading', { level: 3 })}><Heading3 size={15} /></ToolbarBtn>

                <ToolbarDivider />

                <ToolbarBtn title="درشت" onClick={() => editor.chain().focus().toggleBold().run()}
                  active={editor.isActive('bold')} disabled={!editor.can().toggleBold()}><Bold size={14} /></ToolbarBtn>
                <ToolbarBtn title="کج" onClick={() => editor.chain().focus().toggleItalic().run()}
                  active={editor.isActive('italic')} disabled={!editor.can().toggleItalic()}><Italic size={14} /></ToolbarBtn>
                <ToolbarBtn title="پیوند" active={editor.isActive('link')}
                  onClick={() => {
                    if (typeof window === 'undefined') return;
                    const url = window.prompt('آدرس لینک:');
                    if (url) editor.chain().focus().setLink({ href: url }).run();
                  }}><Link2 size={14} /></ToolbarBtn>
                {/* 🖼️ Insert image — uploads then drops it at the caret */}
                <ToolbarBtn title="افزودن تصویر" disabled={uploadingImage} onClick={pickContentImage}>
                  {uploadingImage ? <LoaderCircle size={14} className="animate-spin" /> : <ImageIcon size={15} />}
                </ToolbarBtn>

                <ToolbarDivider />

                <ToolbarBtn title="لیست نقطه‌ای" onClick={() => editor.chain().focus().toggleBulletList().run()}
                  active={editor.isActive('bulletList')}><List size={15} /></ToolbarBtn>
                <ToolbarBtn title="لیست شماره‌ای" onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  active={editor.isActive('orderedList')}><ListOrdered size={15} /></ToolbarBtn>
                <ToolbarBtn title="نقل‌قول" onClick={() => editor.chain().focus().toggleBlockquote().run()}
                  active={editor.isActive('blockquote')}><Quote size={15} /></ToolbarBtn>

                <ToolbarDivider />

                <ToolbarBtn title="برگشت" onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().undo()}><Undo size={14} /></ToolbarBtn>
                <ToolbarBtn title="جلو" onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().redo()}><Redo size={14} /></ToolbarBtn>
              </div>
            )}

            <EditorContent editor={editor} className="tiptap-content" />
          </div>
        </CardContent>
      </Card>

      {/* ══ Actions ═══════════════════════════════════════════════════════════ */}
      <div className="flex items-center justify-between">
        {/* 🔗 Client-side nav — ButtonLink avoids the Slot+next/link hydration mismatch */}
        <ButtonLink href="/admin/articles" variant="ghost" className="text-neutral-500 hover:text-neutral-700">
          انصراف
        </ButtonLink>
        <Button type="submit" disabled={isPending || !editorReady} className="min-w-32 gap-2">
          {isPending ? <LoaderCircle size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
