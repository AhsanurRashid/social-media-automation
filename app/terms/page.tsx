import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Social Automation",
  description: "Terms of Service for Social Automation App",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-8">
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to Dashboard
          </Link>
        </div>

        <h1 className="text-4xl font-bold tracking-tight mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-10">Last updated: March 11, 2026</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-sm leading-7">

          <section>
            <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Social Automation ("the Service"), you agree to be bound by
              these Terms of Service. If you do not agree to these terms, please do not use the
              Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
            <p>
              Social Automation is a web application that allows users to create and publish
              content to multiple social media platforms including Facebook, X (Twitter), TikTok,
              Instagram, and LinkedIn from a single interface.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. User Responsibilities</h2>
            <p>By using the Service, you agree to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Comply with the terms of service of each connected social media platform.</li>
              <li>Not use the Service to post spam, harmful, illegal, or misleading content.</li>
              <li>Keep your API credentials and account information secure and confidential.</li>
              <li>Take full responsibility for all content published through the Service.</li>
              <li>Not attempt to reverse engineer, hack, or disrupt the Service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Intellectual Property</h2>
            <p>
              All content you publish through the Service remains your property. You retain full
              ownership of your posts, images, and other materials. By using the Service, you
              grant us no rights to your content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Third-Party Platforms</h2>
            <p>
              The Service connects to third-party social media platforms via their respective
              APIs. We are not responsible for any changes to those platforms' APIs, terms of
              service, or availability. Your use of those platforms is subject to their own terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Disclaimer of Warranties</h2>
            <p>
              The Service is provided "as is" without warranties of any kind, express or implied.
              We do not guarantee uninterrupted, error-free service, or that posts will be
              successfully published to all platforms at all times.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, we shall not be liable for any indirect,
              incidental, special, or consequential damages arising from your use of the Service,
              including but not limited to loss of data, failed posts, or platform suspensions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Termination</h2>
            <p>
              We reserve the right to suspend or terminate access to the Service at any time,
              with or without notice, for conduct that we believe violates these Terms or is
              harmful to other users, us, or third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Changes to Terms</h2>
            <p>
              We may update these Terms at any time. Continued use of the Service after changes
              are posted constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Contact</h2>
            <p>
              If you have any questions about these Terms, please contact us at{" "}
              <a href="mailto:support@zam.asia" className="underline">
                support@zam.asia
              </a>
              .
            </p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t text-sm text-muted-foreground flex gap-6">
          <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
