"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, GripVertical, Sparkles } from "lucide-react";
import { Reorder, motion } from "framer-motion";

interface BulletEditorProps {
  bullets: string[];
  onChange: (newBullets: string[]) => void;
}

export function BulletEditor({ bullets, onChange }: BulletEditorProps) {
  const addBullet = () => {
    onChange([...bullets, ""]);
  };

  const removeBullet = (index: number) => {
    onChange(bullets.filter((_, i) => i !== index));
  };

  const handleBulletChange = (index: number, value: string) => {
    const newBullets = [...bullets];
    newBullets[index] = value;
    onChange(newBullets);
  };

  return (
    <div className="space-y-3">
      <Reorder.Group axis="y" values={bullets} onReorder={onChange} className="space-y-2">
        {bullets.map((bullet, index) => (
          <Reorder.Item 
            key={index} 
            value={bullet}
            className="flex items-start gap-2 group"
          >
            <div className="mt-2.5">
               <GripVertical className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity" />
            </div>
            <div className="flex-1 space-y-1">
               <div className="relative">
                  <Input 
                    value={bullet} 
                    onChange={(e) => handleBulletChange(index, e.target.value)}
                    placeholder="e.g. Led a team of 5 to deliver X project ahead of schedule..."
                    className="pr-10 bg-background/30 focus-visible:bg-background"
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute right-1 top-1 h-7 w-7 p-0 text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Optimize with AI"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                  </Button>
               </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-1 h-7 w-7 p-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeBullet(index)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <Button 
        variant="ghost" 
        size="sm" 
        onClick={addBullet}
        className="h-8 text-xs font-bold uppercase tracking-wider gap-2 text-primary hover:bg-primary/5"
      >
        <Plus className="h-3.5 w-3.5" />
        Add Bullet Point
      </Button>
    </div>
  );
}
