import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Social Automation",
  description: "Privacy Policy for Social Automation App",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-8">
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to Dashboard
          </Link>
        </div>

        <h1 className="text-4xl font-bold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-10">Last updated: March 11, 2026</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-sm leading-7">

          <section>
            <h2 className="text-xl font-semibold mb-3">1. Overview</h2>
            <p>
              This Privacy Policy explains how Social Automation ("we", "us", "our") collects,
              uses, and protects information when you use our service at{" "}
              <span className="font-medium">automation.zam.asia</span>. We are committed to
              protecting your privacy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
            <p>We collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>
                <span className="font-medium">Content you create:</span> Post titles, content,
                and the platforms you choose to publish to.
              </li>
              <li>
                <span className="font-medium">API credentials:</span> Social media API keys and
                access tokens you configure in the application (stored only on your server).
              </li>
              <li>
                <span className="font-medium">Usage data:</span> Basic server logs including
                timestamps and IP addresses for security purposes.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
            <p>We use collected information solely to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Publish content to social media platforms on your behalf.</li>
              <li>Generate AI-assisted post content via OpenAI when requested.</li>
              <li>Maintain the security and performance of the Service.</li>
            </ul>
            <p className="mt-3">
              We do not sell, rent, or share your information with third parties for marketing
              purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Third-Party Services</h2>
            <p>The Service integrates with the following third-party platforms:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><span className="font-medium">OpenAI</span> — for AI content generation</li>
              <li><span className="font-medium">Facebook / Meta</span> — for publishing to Facebook</li>
              <li><span className="font-medium">X (Twitter)</span> — for publishing tweets</li>
              <li><span className="font-medium">TikTok</span> — for publishing video posts</li>
              <li><span className="font-medium">Instagram / Meta</span> — for publishing to Instagram</li>
              <li><span className="font-medium">LinkedIn</span> — for publishing to LinkedIn</li>
            </ul>
            <p className="mt-3">
              Each platform has its own privacy policy. Your use of those platforms is governed
              by their respective privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Data Storage & Security</h2>
            <p>
              Your API credentials and content are stored on your own self-hosted server. We do
              not store your social media credentials on any external servers. We take reasonable
              technical measures to protect your data, but no system is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Data Retention</h2>
            <p>
              We do not retain published post content after it has been sent to the respective
              social media platforms. Server logs are retained for up to 30 days for security
              monitoring purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Access any personal data we hold about you.</li>
              <li>Request deletion of your data.</li>
              <li>Revoke API access at any time through the respective social media platforms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Cookies</h2>
            <p>
              The Service uses minimal session cookies necessary for the application to function.
              We do not use tracking or advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. We will notify you of significant
              changes by updating the date at the top of this page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy, please contact us
              at{" "}
              <a href="mailto:support@zam.asia" className="underline">
                support@zam.asia
              </a>
              .
            </p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t text-sm text-muted-foreground flex gap-6">
          <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
