"use client";

import { useState } from "react";
import { useEditor } from "@/contexts/EditorContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   CUSTOM SECTIONS — User-defined sections (Hobbies, Interests…)

   Data shape inside content:
     customSections: [
       { title: "Hobbies",       items: ["Reading", "Chess"] },
       { title: "Key Interests", items: ["Open Source", "AI"] },
     ]
   ═══════════════════════════════════════════════════════════════ */

export function CustomSectionsSection() {
  const { resume, setResume } = useEditor();
  const customSections: { title: string; items: string[] }[] =
    resume?.content?.customSections || [];

  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newItems, setNewItems] = useState<Record<number, string>>({});
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  /* ── helpers ── */
  const update = (sections: { title: string; items: string[] }[]) => {
    setResume({ ...resume.content, customSections: sections });
  };

  const addSection = () => {
    const title = newSectionTitle.trim();
    if (!title) return;
    const next = [...customSections, { title, items: [] }];
    update(next);
    setExpanded((prev) => ({ ...prev, [next.length - 1]: true }));
    setNewSectionTitle("");
  };

  const removeSection = (idx: number) => {
    update(customSections.filter((_, i) => i !== idx));
  };

  const addItem = (sectionIdx: number) => {
    const item = (newItems[sectionIdx] || "").trim();
    if (!item) return;
    const next = customSections.map((s, i) =>
      i === sectionIdx ? { ...s, items: [...s.items, item] } : s
    );
    update(next);
    setNewItems((prev) => ({ ...prev, [sectionIdx]: "" }));
  };

  const removeItem = (sectionIdx: number, itemIdx: number) => {
    const next = customSections.map((s, i) =>
      i === sectionIdx
        ? { ...s, items: s.items.filter((_, j) => j !== itemIdx) }
        : s
    );
    update(next);
  };

  const toggleExpanded = (idx: number) => {
    setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="space-y-5">
      {/* Existing sections */}
      {customSections.map((section, sIdx) => (
        <div
          key={sIdx}
          className="border rounded-xl overflow-hidden bg-card shadow-sm"
        >
          {/* Section header */}
          <div className="flex items-center justify-between px-4 py-3 bg-accent/5 border-b">
            <button
              onClick={() => toggleExpanded(sIdx)}
              className="flex items-center gap-2 flex-1 text-left"
            >
              {expanded[sIdx] ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="font-semibold text-sm">{section.title}</span>
              <Badge variant="outline" className="text-[10px] ml-1">
                {section.items.length} item{section.items.length !== 1 ? "s" : ""}
              </Badge>
            </button>
            <button
              onClick={() => removeSection(sIdx)}
              className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Items */}
          {(expanded[sIdx] ?? true) && (
            <div className="p-4 space-y-4">
              {/* Item chips */}
              <div className="flex flex-wrap gap-2 min-h-[36px] p-3 rounded-lg border bg-accent/5 border-dashed">
                {section.items.length === 0 ? (
                  <p className="text-xs text-muted-foreground w-full text-center py-1 italic">
                    No items yet — add some below
                  </p>
                ) : (
                  section.items.map((item, iIdx) => (
                    <Badge
                      key={iIdx}
                      variant="secondary"
                      className="py-1.5 pl-3 pr-1 text-sm rounded-lg flex items-center gap-1 bg-card border hover:bg-accent transition-colors"
                    >
                      {item}
                      <button
                        onClick={() => removeItem(sIdx, iIdx)}
                        className="h-5 w-5 rounded-md flex items-center justify-center hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                )}
              </div>

              {/* Add item input */}
              <div className="flex gap-2">
                <Input
                  placeholder={`Add item to "${section.title}"…`}
                  value={newItems[sIdx] || ""}
                  onChange={(e) =>
                    setNewItems((prev) => ({ ...prev, [sIdx]: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addItem(sIdx);
                    }
                  }}
                  className="h-9 rounded-xl text-sm"
                />
                <Button
                  onClick={() => addItem(sIdx)}
                  size="icon"
                  className="h-9 w-9 shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add new section */}
      <div className="border border-dashed rounded-xl p-4 space-y-3 bg-primary/5 border-primary/20">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">
          + Add Custom Section
        </p>
        <div className="flex gap-2">
          <Input
            placeholder='Section name e.g. "Hobbies", "Key Interests"…'
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSection();
              }
            }}
            className="h-9 rounded-xl text-sm"
          />
          <Button
            onClick={addSection}
            size="icon"
            className="h-9 w-9 shrink-0"
            disabled={!newSectionTitle.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Create any section you need — Hobbies, Volunteer Work, Publications, Awards, etc.
        </p>
      </div>
    </div>
  );
}
