// 🫀 Health test table — stats row, tab filter, search, result list.
//    stat cards use <Card>, counts use <Badge>. No raw <div> style badges.
"use client";

import { useState, useMemo } from "react";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchInput } from "@/components/admin/shared/search-filter";
import { getRisk, ResultCard } from "@/components/admin/health-tests/health-test-parts";
import type { TestResultItem } from "@/lib/actions/health-test";

type TabValue = "all" | "unreplied" | "replied";

// 🎨 Stat card color tokens
const STAT_CARDS = [
  { label: "ریسک بالا",     key: "high",     cardCls: "border-red-100     bg-red-50",     textCls: "text-red-700",     dotCls: "bg-red-500"     },
  { label: "ریسک متوسط",    key: "mid",      cardCls: "border-amber-100   bg-amber-50",   textCls: "text-amber-700",   dotCls: "bg-amber-500"   },
  { label: "ریسک پایین",    key: "low",      cardCls: "border-emerald-100 bg-emerald-50", textCls: "text-emerald-700", dotCls: "bg-emerald-500" },
  { label: "بدون پاسخ",     key: "unreplied",cardCls: "border-orange-100  bg-orange-50",  textCls: "text-orange-700",  dotCls: "bg-orange-400"  },
  { label: "پاسخ داده شده", key: "replied",  cardCls: "border-teal-100    bg-teal-50",    textCls: "text-teal-700",    dotCls: "bg-teal-500"    },
] as const;

type StatKey = typeof STAT_CARDS[number]["key"];

export default function HealthTestTable({ results }: { results: TestResultItem[] }) {
  const [search,    setSearch]    = useState("");
  const [activeTab, setActiveTab] = useState<TabValue>("all");
  // 🔄 Optimistic reply map — testId → ISO timestamp
  const [repliedMap, setRepliedMap] = useState<Record<string, string>>({});

  const handleReplied = (id: string) =>
    setRepliedMap((prev) => ({ ...prev, [id]: new Date().toISOString() }));

  // 🔀 Merge server data + optimistic replies
  const merged = useMemo(
    () => results.map((r) => ({ ...r, repliedAt: repliedMap[r._id] ?? r.repliedAt })),
    [results, repliedMap],
  );

  // 🔍 Search + tab — one pass
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const searched = merged.filter(
      (r) =>
        r.userName.includes(search) ||
        r.userPhone.includes(search) ||
        r.userEmail.toLowerCase().includes(q),
    );
    if (activeTab === "unreplied") return searched.filter((r) => !r.repliedAt);
    if (activeTab === "replied")   return searched.filter((r) =>  r.repliedAt);
    return searched;
  }, [merged, search, activeTab]);

  // 📊 Stats — single pass over merged
  const stats = useMemo(() => {
    const s: Record<StatKey, number> = { high: 0, mid: 0, low: 0, replied: 0, unreplied: 0 };
    for (const r of merged) {
      const { label } = getRisk(r.answers);
      if (label === "ریسک بالا")  s.high++;
      if (label === "ریسک متوسط") s.mid++;
      if (label === "ریسک پایین") s.low++;
      if (r.repliedAt) s.replied++; else s.unreplied++;
    }
    return s;
  }, [merged]);

  const TAB_CONFIG: { value: TabValue; label: string; count: number }[] = [
    { value: "all",       label: "همه",           count: merged.length    },
    { value: "unreplied", label: "بدون پاسخ",     count: stats.unreplied  },
    { value: "replied",   label: "پاسخ داده شده", count: stats.replied    },
  ];

  return (
    <div dir="rtl">
      {/* 📊 Stats row — Card per item */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {STAT_CARDS.map(({ label, key, cardCls, textCls, dotCls }) => (
          <Card key={key} className={`gap-0 px-4 py-3 ${cardCls}`}>
            <CardContent className="flex items-center gap-3 p-0">
              {/* 🔴 Color dot — size-2.5 canonical */}
              <span className={`size-2.5 shrink-0 rounded-full ${dotCls}`} />
              <div>
                <p className={`text-lg font-bold ${textCls}`}>{stats[key]}</p>
                <p className="text-xs text-neutral-500">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 🗂️ Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)} className="mb-4">
        <TabsList className="h-auto w-full gap-1 rounded-xl bg-neutral-100 p-1 sm:w-auto">
          {TAB_CONFIG.map((tab) => (
            <TabsTrigger
              key={tab.value} value={tab.value}
              className="flex flex-1 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm data-[state=inactive]:text-neutral-500 sm:flex-none"
            >
              {tab.label}
              {tab.count > 0 && (
                <Badge variant="secondary" className="h-5 min-w-5 rounded-full px-1 py-0 text-[10px] font-semibold leading-none">
                  {tab.count}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* 🔍 Search */}
      <div className="mb-5">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch("")}
          placeholder="جستجو بر اساس نام، تلفن یا ایمیل..."
        />
      </div>

      {/* 📋 Result list */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-neutral-400">
          <Heart size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">هیچ نتیجه‌ای یافت نشد</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <ResultCard key={r._id} result={r} onReplied={handleReplied} />
          ))}
        </div>
      )}
    </div>
  );
}
