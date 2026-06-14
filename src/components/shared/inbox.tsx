// 📬 Inbox — main container (sub-components extracted to inbox-parts.tsx)
// ✅ FIX: Added select-all + bulk delete
"use client";

import { useState, useTransition } from "react";
import {
  Inbox as InboxIcon, Sparkles,
  Trash2, CheckSquare, Square,
} from "lucide-react";
import { Badge }                       from "@/components/ui/badge";
import { Button }                      from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea }                  from "@/components/ui/scroll-area";
import { cn }                          from "@/lib/utils/cn";
import { markMessageRead, deleteMessages, type InboxMessage } from "@/lib/actions/message";
import { MessageCard, EmptyState, StatsBanner } from "@/components/shared/inbox-parts";

type TabValue = "all" | "unread" | "read";

export default function Inbox({ messages }: { messages: InboxMessage[] }) {
  const [, startTransition]  = useTransition();
  const [readIds,      setReadIds]      = useState<Set<string>>(new Set());
  const [activeTab,    setActiveTab]    = useState<TabValue>("all");
  const [selectedIds,  setSelectedIds]  = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const [localMessages, setLocalMessages] = useState(messages);
  const [isDeleting,   setIsDeleting]   = useState(false);

  // 📬 Live unread count — respects optimistic read state
  const unreadCount = localMessages.filter((m) => !m.isRead && !readIds.has(m._id)).length;

  // ✅ Optimistic read: update UI immediately, then sync server
  const handleRead = (id: string) => {
    startTransition(async () => {
      setReadIds((prev) => new Set([...prev, id]));
      await markMessageRead(id);
    });
  };

  // 🔍 Filter messages by active tab
  const filtered = localMessages.filter((m) => {
    const isRead = m.isRead || readIds.has(m._id);
    if (activeTab === "unread") return !isRead;
    if (activeTab === "read")   return isRead;
    return true;
  });

  // ✅ Toggle single item selection
  const handleSelect = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // ✅ Select all visible / deselect all
  const handleSelectAll = () =>
    setSelectedIds(
      selectedIds.size === filtered.length
        ? new Set()
        : new Set(filtered.map((m) => m._id))
    );

  // 🗑️ Bulk delete — optimistic + server sync
  const handleBulkDelete = async () => {
    if (!selectedIds.size) return;
    setIsDeleting(true);
    const ids = Array.from(selectedIds);
    setLocalMessages((prev) => prev.filter((m) => !selectedIds.has(m._id)));
    setSelectedIds(new Set());
    setSelectionMode(false);
    await deleteMessages(ids);
    setIsDeleting(false);
  };

  const tabConfig: { value: TabValue; label: string; count: number }[] = [
    { value: "all",    label: "همه",         count: localMessages.length               },
    { value: "unread", label: "خوانده نشده", count: unreadCount                        },
    { value: "read",   label: "خوانده شده",  count: localMessages.length - unreadCount },
  ];

  return (
    <div>
      {/* ── Page Header ── */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-600 shadow-lg shadow-primary-600/30">
            <InboxIcon size={22} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-neutral-900">صندوق ورودی</h1>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1 rounded-full bg-primary-100 text-primary-700 hover:bg-primary-100 text-xs font-bold px-2.5 py-1 h-auto">
                  <Sparkles size={10} />
                  {unreadCount} جدید
                </Badge>
              )}
            </div>
            <p className="mt-0.5 text-sm text-neutral-500">پیام‌های دریافتی از تیم پزشکی</p>
          </div>
        </div>

        {/* 🗑️ Selection toolbar */}
        {localMessages.length > 0 && (
          <div className="flex items-center gap-2">
            {selectionMode ? (
              <>
                <Button variant="ghost" size="sm" onClick={handleSelectAll} className="text-xs gap-1">
                  {selectedIds.size === filtered.length
                    ? <><CheckSquare size={14} /> لغو انتخاب همه</>
                    : <><Square size={14} /> انتخاب همه</>
                  }
                </Button>
                {selectedIds.size > 0 && (
                  <Button variant="destructive" size="sm" onClick={handleBulkDelete} disabled={isDeleting} className="text-xs gap-1">
                    <Trash2 size={14} />
                    حذف ({selectedIds.size})
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => { setSelectionMode(false); setSelectedIds(new Set()); }} className="text-xs">
                  انصراف
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setSelectionMode(true)} className="text-xs gap-1">
                <CheckSquare size={14} />
                انتخاب
              </Button>
            )}
          </div>
        )}
      </div>

      {/* ── Stats Banner ── */}
      {localMessages.length > 0 && (
        <StatsBanner total={localMessages.length} unread={unreadCount} />
      )}

      {/* ── Tabs ── */}
      {localMessages.length > 0 && (
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)} className="mb-5">
          <TabsList className="w-full rounded-xl bg-neutral-75 p-1 h-auto gap-1">
            {tabConfig.map((tab) => (
              <TabsTrigger
                key={tab.value} value={tab.value}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-all duration-200",
                  "data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm",
                  "data-[state=inactive]:text-neutral-500 data-[state=inactive]:hover:text-neutral-700",
                )}
              >
                {tab.label}
                {tab.count > 0 && (
                  <Badge variant="secondary"
                    className={cn(
                      "mr-1 rounded-full px-1.5 py-0 text-[10px] font-semibold leading-none h-4.5 flex items-center",
                      activeTab === tab.value
                        ? tab.value === "unread"
                          ? "bg-primary-100 text-primary-700 hover:bg-primary-100"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-100"
                        : "bg-neutral-200 text-neutral-500 hover:bg-neutral-200",
                    )}
                  >
                    {tab.count}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {/* ── Content ── */}
      {localMessages.length === 0 ? (
        <EmptyState />
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-sm text-neutral-400">پیامی در این دسته وجود ندارد</div>
      ) : (
        <ScrollArea className="w-full">
          <div className="space-y-3 pb-2">
            {filtered.map((msg) => (
              <MessageCard
                key={msg._id}
                msg={{ ...msg, _optimisticRead: readIds.has(msg._id) }}
                onRead={handleRead}
                selected={selectedIds.has(msg._id)}
                onSelect={handleSelect}
                selectionMode={selectionMode}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
