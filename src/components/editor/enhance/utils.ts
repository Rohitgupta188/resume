import React from "react";

export function getSafeContent(data: any): any {
  if (!data) return {};
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  }
  return data.content ?? data;
}

export function diffSkills(
  original: string[],
  improved: string[]
): {
  kept: string[];
  added: string[];
} {
  const origSet = new Set(original.map((s) => s.toLowerCase()));
  const kept: string[] = [];
  const added: string[] = [];
  improved.forEach((s) => {
    if (origSet.has(s.toLowerCase())) kept.push(s);
    else added.push(s);
  });
  return { kept, added };
}

export function Divider() {
  return React.createElement("div", {
    className: "h-px bg-zinc-100 dark:bg-zinc-800 my-5",
  });
}
