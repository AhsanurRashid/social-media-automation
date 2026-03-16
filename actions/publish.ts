"use server";

// ─── Facebook ────────────────────────────────────────────────────────────────

async function postToFacebook(message: string): Promise<void> {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  if (!pageId || !accessToken) {
    throw new Error("Facebook credentials are not configured.");
  }

  const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, access_token: accessToken }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error?.message ?? "Failed to post to Facebook.");
  }
}

// ─── X (Twitter) ────────────────────────────────────────────────────────────────

async function postToX(text: string): Promise<void> {
  const apiKey = process.env.X_API_KEY;
  const apiSecret = process.env.X_API_SECRET;
  const accessToken = process.env.X_ACCESS_TOKEN;
  const accessTokenSecret = process.env.X_ACCESS_TOKEN_SECRET;

  if (!apiKey || !apiSecret || !accessToken || !accessTokenSecret) {
    throw new Error("X (Twitter) credentials are not configured.");
  }

  const oauthTimestamp = Math.floor(Date.now() / 1000).toString();
  const oauthNonce = crypto.randomUUID().replace(/-/g, "");

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: apiKey,
    oauth_nonce: oauthNonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: oauthTimestamp,
    oauth_token: accessToken,
    oauth_version: "1.0",
  };

  const method = "POST";
  const url = "https://api.twitter.com/2/tweets";

  const allParams = Object.entries(oauthParams)
    .map(([k, v]) => [encodeURIComponent(k), encodeURIComponent(v)])
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");

  const signingKey = `${encodeURIComponent(apiSecret)}&${encodeURIComponent(accessTokenSecret)}`;
  const baseString = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(allParams)}`;

  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(signingKey),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );
  const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(baseString));
  const signature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));

  const authHeader =
    "OAuth " +
    Object.entries({ ...oauthParams, oauth_signature: signature })
      .map(([k, v]) => `${encodeURIComponent(k)}="${encodeURIComponent(v)}"`)
      .join(", ");

  const res = await fetch(url, {
    method,
    headers: { Authorization: authHeader, "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(
      `X API ${res.status}: ${error?.detail ?? error?.title ?? error?.errors?.[0]?.message ?? JSON.stringify(error)}`
    );
  }
}

// ─── TikTok ───────────────────────────────────────────────────────────────────

interface TikTokOptions {
  video: File;
  title: string;
  privacyLevel: string;
  disableComment: boolean;
  disableDuet: boolean;
  disableStitch: boolean;
}

async function postToTikTok(opts: TikTokOptions): Promise<void> {
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("TikTok credentials are not configured (missing TIKTOK_ACCESS_TOKEN).");
  }

  const CHUNK_SIZE = 10 * 1024 * 1024; // 10 MB
  const videoSize = opts.video.size;
  const totalChunks = Math.ceil(videoSize / CHUNK_SIZE);

  // Step 1 — Initialise the upload
  const initRes = await fetch("https://open.tiktokapis.com/v2/post/publish/video/init/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      post_info: {
        title: opts.title,
        privacy_level: opts.privacyLevel,
        disable_comment: opts.disableComment,
        disable_duet: opts.disableDuet,
        disable_stitch: opts.disableStitch,
      },
      source_info: {
        source: "FILE_UPLOAD",
        video_size: videoSize,
        chunk_size: CHUNK_SIZE,
        total_chunk_count: totalChunks,
      },
    }),
  });

  const initJson = await initRes.json();
  if (!initRes.ok || initJson?.error?.code !== "ok") {
    throw new Error(
      initJson?.error?.message ?? `TikTok init failed (HTTP ${initRes.status}).`
    );
  }

  const { upload_url: uploadUrl } = initJson.data as { publish_id: string; upload_url: string };

  // Step 2 — Upload video in chunks
  const videoBuffer = await opts.video.arrayBuffer();
  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, videoSize) - 1;
    const chunk = videoBuffer.slice(start, end + 1);

    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": opts.video.type || "video/mp4",
        "Content-Length": String(end - start + 1),
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      },
      body: chunk,
    });

    // TikTok returns 2xx (often 206 Partial Content) for each chunk
    if (!uploadRes.ok && uploadRes.status !== 206) {
      throw new Error(`TikTok chunk upload failed at chunk ${i + 1} (HTTP ${uploadRes.status}).`);
    }
  }
}

// ─── Instagram ────────────────────────────────────────────────────────────────

async function postToInstagram(text: string): Promise<void> {
  void text;
  // Instagram Graph API requires a connected Facebook Page and media container flow.
  // Configure INSTAGRAM_BUSINESS_ACCOUNT_ID and INSTAGRAM_ACCESS_TOKEN when ready.
  throw new Error("Instagram integration is not yet configured.");
}

// ─── LinkedIn ─────────────────────────────────────────────────────────────────

async function postToLinkedIn(text: string): Promise<void> {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  const authorUrn = process.env.LINKEDIN_AUTHOR_URN; // e.g. "urn:li:person:xxxxxx"

  if (!accessToken || !authorUrn) {
    throw new Error("LinkedIn credentials are not configured.");
  }

  const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      author: authorUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text },
          shareMediaCategory: "NONE",
        },
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.message ?? "Failed to post to LinkedIn.");
  }
}

// ─── Unified publish action ───────────────────────────────────────────────────

export interface PublishFormState {
  success: boolean;
  results: { platform: string; success: boolean; message: string }[];
}

export async function publishPostAction(
  _prevState: PublishFormState,
  formData: FormData
): Promise<PublishFormState> {
  const title = formData.get("title")?.toString().trim();
  const content = formData.get("content")?.toString().trim();
  const platforms = formData.getAll("platform") as string[];

  if (!title) {
    return {
      success: false,
      results: [{ platform: "general", success: false, message: "Title is required." }],
    };
  }

  if (!content) {
    return {
      success: false,
      results: [{ platform: "general", success: false, message: "Content is required." }],
    };
  }

  if (platforms.length === 0) {
    return {
      success: false,
      results: [{ platform: "general", success: false, message: "Select at least one platform." }],
    };
  }

  const message = `${title}\n\n${content}`;
  const results: PublishFormState["results"] = [];

  // TikTok-specific options from FormData
  const tiktokVideo = formData.get("tiktok_video");
  const tiktokPrivacy = formData.get("tiktok_privacy")?.toString() ?? "PUBLIC_TO_EVERYONE";
  const tiktokDisableComment = formData.get("tiktok_disable_comment") === "true";
  const tiktokDisableDuet    = formData.get("tiktok_disable_duet")    === "true";
  const tiktokDisableStitch  = formData.get("tiktok_disable_stitch")  === "true";

  await Promise.allSettled(
    platforms.map(async (platform) => {
      try {
        switch (platform) {
          case "facebook":
            await postToFacebook(message);
            results.push({ platform: "Facebook", success: true, message: "Published successfully." });
            break;
          case "x": {
            if (message.length > 280) {
              results.push({
                platform: "X",
                success: false,
                message: `Exceeds X's 280-character limit (${message.length} chars).`,
              });
              break;
            }
            await postToX(message);
            results.push({ platform: "X", success: true, message: "Published successfully." });
            break;
          }
          case "tiktok": {
            if (!(tiktokVideo instanceof File) || tiktokVideo.size === 0) {
              results.push({ platform: "TikTok", success: false, message: "Please select a video file to upload." });
              break;
            }
            await postToTikTok({
              video: tiktokVideo,
              title: title ?? "",
              privacyLevel: tiktokPrivacy,
              disableComment: tiktokDisableComment,
              disableDuet: tiktokDisableDuet,
              disableStitch: tiktokDisableStitch,
            });
            results.push({ platform: "TikTok", success: true, message: "Published successfully." });
            break;
          }
          case "instagram":
            await postToInstagram(message);
            results.push({ platform: "Instagram", success: true, message: "Published successfully." });
            break;
          case "linkedin":
            await postToLinkedIn(message);
            results.push({ platform: "LinkedIn", success: true, message: "Published successfully." });
            break;
          default:
            results.push({ platform, success: false, message: "Unknown platform." });
        }
      } catch (err) {
        const name =
          platform.charAt(0).toUpperCase() + platform.slice(1);
        results.push({
          platform: name,
          success: false,
          message: err instanceof Error ? err.message : "Unknown error.",
        });
      }
    })
  );

  const allSuccess = results.every((r) => r.success);
  return { success: allSuccess, results };
}
