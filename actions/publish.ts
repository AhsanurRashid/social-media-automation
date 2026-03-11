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

async function postToTikTok(text: string): Promise<void> {
  void text;
  // TikTok Content Posting API requires OAuth 2.0 + video upload flow.
  // Configure TIKTOK_ACCESS_TOKEN in your environment when ready.
  throw new Error("TikTok integration is not yet configured.");
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
          case "tiktok":
            await postToTikTok(message);
            results.push({ platform: "TikTok", success: true, message: "Published successfully." });
            break;
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
