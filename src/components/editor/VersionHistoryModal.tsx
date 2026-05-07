import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import {
  History,
  Sparkles,
  User,
  FileText,
  RotateCcw,
  Ghost,
} from "lucide-react";
import { ResumeVersionItem } from "@/hooks/useResume";

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  versions: ResumeVersionItem[];
  isLoading: boolean;
  onRestore: (versionId: string) => void;
  currentVersionId?: string; // the most recent one
}

export function VersionHistoryModal({
  isOpen,
  onClose,
  versions,
  isLoading,
  onRestore,
}: VersionHistoryModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-slate-950 text-slate-100 border-slate-800 max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Version History
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            View and restore previous versions of your resume. Restoring will
            create a new version on top of your current work.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 mt-4 space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : versions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-slate-800">
                <Ghost className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-200 mb-2">
                No History Yet
              </h3>
              <p className="text-sm text-slate-500 max-w-sm">
                As you make edits and apply AI enhancements to your resume, your
                previous versions will automatically appear here.
              </p>
            </div>
          ) : (
            versions.map((version, index) => {
              const isCurrent = index === 0; // Assuming versions are sorted by newest first

              let Icon = User;
              let badgeColor = "bg-slate-800 text-slate-300";
              let typeLabel = "Manual Edit";

              if (version.type === "ai_improved") {
                Icon = Sparkles;
                badgeColor =
                  "bg-primary/20 text-primary border border-primary/30";
                typeLabel = "AI Enhanced";
              } else if (version.type === "original") {
                Icon = FileText;
                badgeColor = "bg-slate-800 text-slate-400";
                typeLabel = "Created";
              }

              return (
                <div
                  key={version._id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    isCurrent
                      ? "bg-slate-900 border-primary/50"
                      : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2 rounded-md shrink-0 ${isCurrent ? "bg-primary/20 text-primary" : "bg-slate-800 text-slate-400"}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm">
                          Version {version.versionNumber}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] uppercase tracking-wider font-bold bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                            Current
                          </span>
                        )}
                        <span
                          className={`text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${badgeColor}`}
                        >
                          {typeLabel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {formatDistanceToNow(new Date(version.createdAt), {
                          addSuffix: true,
                        })}
                        {" · "}
                        {new Date(version.createdAt).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </div>

                  {!isCurrent && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 gap-1.5 border-slate-700 hover:bg-slate-800 hover:text-white h-8"
                      onClick={() => onRestore(version._id)}
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Restore
                    </Button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
