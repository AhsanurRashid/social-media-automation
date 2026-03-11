"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface GenerateWithAIButtonProps {
  onGenerate: (title: string, content: string) => void;
}

export default function GenerateWithAIButton({ onGenerate }: GenerateWithAIButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/generate-post", { method: "POST" });
      if (!res.ok) throw new Error("Failed to generate");
      const { title, content } = await res.json();
      onGenerate(title, content);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleClick} disabled={loading}>
      <Sparkles className="w-4 h-4 mr-2" />
      {loading ? "Generating..." : "Generate with AI"}
    </Button>
  );
}
