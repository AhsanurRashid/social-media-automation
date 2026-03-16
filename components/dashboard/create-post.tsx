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

type TikTokPrivacy = "PUBLIC_TO_EVERYONE" | "MUTUAL_FOLLOW_FRIENDS" | "FOLLOWER_OF_CREATOR" | "SELF_ONLY";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [state, formAction, pending] = useActionState(publishPostAction, {
    success: false,
    results: [],
  });

  // TikTok-specific state
  const [tiktokVideo, setTiktokVideo] = useState<File | null>(null);
  const [tiktokPrivacy, setTiktokPrivacy] = useState<TikTokPrivacy>("PUBLIC_TO_EVERYONE");
  const [tiktokDisableComment, setTiktokDisableComment] = useState(false);
  const [tiktokDisableDuet, setTiktokDisableDuet] = useState(false);
  const [tiktokDisableStitch, setTiktokDisableStitch] = useState(false);

  function handleReset() {
    setTitle("");
    setContent("");
    setPlatforms([]);
    setTiktokVideo(null);
    setTiktokPrivacy("PUBLIC_TO_EVERYONE");
    setTiktokDisableComment(false);
    setTiktokDisableDuet(false);
    setTiktokDisableStitch(false);
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

            {/* TikTok-specific fields */}
            {platforms.includes("tiktok") && (
              <div className="flex flex-col gap-4 rounded-lg border border-border p-4">
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.31 6.31 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
                  </svg>
                  <span className="text-sm font-semibold">TikTok Settings</span>
                </div>

                {/* Video upload */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="tiktok-video">Video File <span className="text-destructive">*</span></Label>
                  <div
                    className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/40 px-4 py-8 text-center cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() => document.getElementById("tiktok-video")?.click()}
                  >
                    {tiktokVideo ? (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-green-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-medium">{tiktokVideo.name}</p>
                        <p className="text-xs text-muted-foreground">{(tiktokVideo.size / (1024 * 1024)).toFixed(2)} MB</p>
                        <button
                          type="button"
                          className="text-xs text-destructive hover:underline mt-1"
                          onClick={(e) => { e.stopPropagation(); setTiktokVideo(null); }}
                        >
                          Remove
                        </button>
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-muted-foreground">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        <p className="text-sm font-medium">Click to upload video</p>
                        <p className="text-xs text-muted-foreground">MP4, MOV, WebM — max 4 GB</p>
                      </>
                    )}
                  </div>
                  <input
                    id="tiktok-video"
                    name="tiktok_video"
                    type="file"
                    accept="video/mp4,video/quicktime,video/webm,video/*"
                    className="hidden"
                    onChange={(e) => setTiktokVideo(e.target.files?.[0] ?? null)}
                  />
                </div>

                {/* Privacy level */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="tiktok-privacy">Privacy Level</Label>
                  <select
                    id="tiktok-privacy"
                    name="tiktok_privacy"
                    value={tiktokPrivacy}
                    onChange={(e) => setTiktokPrivacy(e.target.value as TikTokPrivacy)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="PUBLIC_TO_EVERYONE">Public to Everyone</option>
                    <option value="FOLLOWER_OF_CREATOR">Followers Only</option>
                    <option value="MUTUAL_FOLLOW_FRIENDS">Mutual Follow Friends</option>
                    <option value="SELF_ONLY">Private (Only Me)</option>
                  </select>
                </div>

                {/* Interaction toggles */}
                <div className="flex flex-col gap-2">
                  <Label>Allow Interactions</Label>
                  <div className="flex flex-col gap-2">
                    {([
                      { id: "tiktok-comment", label: "Comments", checked: !tiktokDisableComment, onChange: (v: boolean) => setTiktokDisableComment(!v) },
                      { id: "tiktok-duet",    label: "Duet",     checked: !tiktokDisableDuet,    onChange: (v: boolean) => setTiktokDisableDuet(!v) },
                      { id: "tiktok-stitch",  label: "Stitch",   checked: !tiktokDisableStitch,  onChange: (v: boolean) => setTiktokDisableStitch(!v) },
                    ] as const).map(({ id, label, checked, onChange }) => (
                      <label key={id} htmlFor={id} className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          id={id}
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => onChange(e.target.checked)}
                          className="h-4 w-4 rounded border border-input accent-foreground cursor-pointer"
                        />
                        <span className="text-sm">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Hidden fields to carry tiktok options into FormData */}
                <input type="hidden" name="tiktok_disable_comment" value={tiktokDisableComment ? "true" : "false"} />
                <input type="hidden" name="tiktok_disable_duet"    value={tiktokDisableDuet    ? "true" : "false"} />
                <input type="hidden" name="tiktok_disable_stitch"  value={tiktokDisableStitch  ? "true" : "false"} />
              </div>
            )}

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
