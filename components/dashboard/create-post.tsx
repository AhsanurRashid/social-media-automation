"use client";

import { useState } from "react";
import { useActionState } from "react";
import { publishPostAction } from "@/actions/publish";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import GenerateWithAIButton from "@/components/dashboard/generate-with-ai-button";
import PlatformSelector, { Platform } from "@/components/dashboard/platform-selector";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [state, formAction, pending] = useActionState(publishPostAction, {
    success: false,
    results: [],
  });

  function handleReset() {
    setTitle("");
    setContent("");
    setPlatforms([]);
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Post</h1>
        <p className="text-muted-foreground mt-1">
          Write and publish a new post to your audience.
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>New Post</CardTitle>
              <CardDescription>Fill in the details below to create your post.</CardDescription>
            </div>
            <GenerateWithAIButton onGenerate={(t, c) => { setTitle(t); setContent(c); }} />
          </div>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex flex-col gap-5">
            {/* Hidden inputs carry the selected platforms into FormData */}
            {platforms.map((p) => (
              <input key={p} type="hidden" name="platform" value={p} />
            ))}

            <PlatformSelector selected={platforms} onChange={setPlatforms} />

            {/* Per-platform publish results */}
            {state.results.length > 0 && (
              <div className="flex flex-col gap-1">
                {state.results.map((r) => (
                  <p
                    key={r.platform}
                    className={r.success ? "text-sm text-green-600" : "text-sm text-destructive"}
                  >
                    <span className="font-medium">{r.platform}:</span> {r.message}
                  </p>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter post title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Write your post content here..."
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              {platforms.includes("x") && (() => {
                const xMessage = title ? `${title}\n\n${content}` : content;
                const count = xMessage.length;
                const over = count > 280;
                return (
                  <p className={`text-xs ${over ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                    X character count: {count} / 280{over ? ` — ${count - 280} over limit` : ""}
                  </p>
                );
              })()}
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={pending || platforms.length === 0}>
                {pending ? "Publishing..." : "Publish"}
              </Button>
              <Button type="button" variant="outline">Save to Draft</Button>
              <Button type="button" variant="ghost" onClick={handleReset}>
                Reset Post
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
