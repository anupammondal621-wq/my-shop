export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 text-black">
      <div className="mx-auto max-w-2xl text-left sm:text-justify">
        <h1 className="mb-6 text-center text-3xl font-semibold">
          Terms of Service
        </h1>

        <h2 className="mb-4 text-2xl font-semibold">Overview</h2>

        <p className="mb-6 leading-7">
          This website is operated by <strong>BongoMithai</strong>. Throughout
          the site, the terms “we”, “us” and “our” refer to BongoMithai.
          BongoMithai offers this website, including all information, tools, and
          services available from this site to you, the user, conditioned upon
          your acceptance of all terms, conditions, policies, and notices stated
          herein.
        </p>

        <p className="mb-6 leading-7">
          By visiting our site and/or purchasing something from us, you engage in
          our “Service” and agree to be bound by the following Terms of Service
          (“Terms”), including those additional terms and conditions and policies
          referenced herein and/or available by hyperlink.
        </p>

        <p className="mb-8 leading-7">
          We reserve the right to update, change, or replace any part of these
          Terms by posting updates to our website. Your continued use of the
          website constitutes acceptance of those changes.
        </p>

        {[
          {
            title: "SECTION 1 – ONLINE STORE TERMS",
            text: [
              "By using this Site, you represent that you are at least the age of majority in your jurisdiction, or that you are accessing the Site under the supervision of a parent or legal guardian.",
              "You agree not to use our products or services for any illegal or unauthorized purpose, nor violate any applicable laws, including intellectual property laws.",
              "You must not transmit any viruses, malware, or destructive code.",
              "A breach of any Terms may result in immediate termination of your access to the Service.",
            ],
          },
          {
            title: "SECTION 2 – GENERAL CONDITIONS",
            text: [
              "We reserve the right to refuse service to anyone at any time for any reason.",
              "You understand that your content, excluding payment information, may be transferred unencrypted across networks and adapted to technical requirements. Payment information is always processed securely through encrypted channels.",
              "You agree not to reproduce, duplicate, copy, sell, resell, or exploit any portion of the Service without express written permission.",
            ],
          },
          {
            title: "SECTION 3 – ACCURACY, COMPLETENESS AND TIMELINESS OF INFORMATION",
            text: [
              "We do not guarantee that all information on this Site is accurate, complete, or current. The material is provided for general information only and should not be solely relied upon.",
              "We reserve the right to modify content at any time without obligation to update it.",
            ],
          },
          {
            title: "SECTION 4 – MODIFICATIONS TO SERVICE AND PRICES",
            text: [
              "Prices for products are subject to change without notice.",
              "We reserve the right to modify, suspend, or discontinue the Service, or any part of it, at any time without notice.",
              "We shall not be liable for any modification, price change, or discontinuation.",
            ],
          },
          {
            title: "SECTION 5 – PRODUCTS OR SERVICES",
            text: [
              "Certain products may be available exclusively online and may have limited quantities.",
              "We strive to display product colors and images as accurately as possible, but cannot guarantee exact display across all devices.",
              "We reserve the right to limit sales by region, customer, or quantity at our sole discretion.",
              "All products are subject to our Refund Policy.",
            ],
          },
          {
            title: "SECTION 6 – BILLING AND ACCOUNT INFORMATION",
            text: [
              "We reserve the right to refuse or cancel any order placed with us.",
              "You agree to provide accurate, complete, and current account and purchase information.",
              "Payments are securely processed through Razorpay. We do not store your card details or sensitive payment information.",
              "Orders suspected of fraud, resale, or misuse may be cancelled at our discretion.",
            ],
          },
          {
            title: "SECTION 7 – THIRD-PARTY TOOLS",
            text: [
              "We may provide access to third-party tools, including payment gateways, analytics, and integrations, which we do not control.",
              "These tools are provided “as is” and “as available” without warranties of any kind.",
            ],
          },
          {
            title: "SECTION 8 – THIRD-PARTY LINKS",
            text: [
              "Certain content or services may include links to third-party websites.",
              "We are not responsible for the content, accuracy, or practices of third-party sites. Use them at your own risk.",
            ],
          },
          {
            title: "SECTION 9 – USER COMMENTS AND FEEDBACK",
            text: [
              "If you submit feedback, suggestions, or other materials, you agree that we may use, edit, and distribute them without restriction.",
              "You must not submit unlawful, abusive, defamatory, or harmful content.",
              "You are solely responsible for the content you provide.",
            ],
          },
          {
            title: "SECTION 10 – PERSONAL INFORMATION",
            text: [
              "Your submission of personal information is governed by our Privacy Policy.",
            ],
          },
          {
            title: "SECTION 11 – ERRORS, INACCURACIES AND OMISSIONS",
            text: [
              "We reserve the right to correct any errors, inaccuracies, or omissions related to product descriptions, pricing, or availability at any time without prior notice.",
            ],
          },
          {
            title: "SECTION 12 – PROHIBITED USES",
            text: [
              "You are prohibited from using the Site for unlawful purposes, to violate intellectual property rights, to upload malicious code, to spam, scrape, or misuse data, or to interfere with the security of the Service.",
              "We reserve the right to terminate access for violations.",
            ],
          },
          {
            title: "SECTION 13 – DISCLAIMER OF WARRANTIES",
            text: [
              "We do not guarantee that the Service will be uninterrupted, timely, secure, or error-free.",
              "The Service and all products are provided “as is” and “as available” without warranties of any kind.",
            ],
          },
          {
            title: "SECTION 14 – LIMITATION OF LIABILITY",
            text: [
              "In no case shall BongoMithai be liable for any direct, indirect, incidental, or consequential damages arising from your use of the Service or products.",
            ],
          },
          {
            title: "SECTION 15 – INDEMNIFICATION",
            text: [
              "You agree to indemnify and hold harmless BongoMithai from any claims, damages, or expenses arising from your violation of these Terms.",
            ],
          },
          {
            title: "SECTION 16 – TERMINATION",
            text: [
              "These Terms remain effective unless terminated by either you or us.",
              "We may terminate access to the Service at any time without notice if you fail to comply with these Terms.",
            ],
          },
          {
            title: "SECTION 17 – GOVERNING LAW",
            text: [
              "These Terms shall be governed by and interpreted in accordance with the laws of India.",
            ],
          },
          {
            title: "SECTION 18 – CHANGES TO TERMS",
            text: [
              "We reserve the right to update these Terms at any time. Continued use of the Site constitutes acceptance of those changes.",
            ],
          },
        ].map((section) => (
          <section key={section.title} className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">{section.title}</h2>
            {section.text.map((paragraph) => (
              <p key={paragraph} className="mb-4 leading-7">
                {paragraph}
              </p>
            ))}
          </section>
        ))}

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">
            SECTION 19 – CONTACT INFORMATION
          </h2>

          <p className="mb-2 leading-7">
            For any questions regarding these Terms:
          </p>

          <p className="leading-7">
            📧 <strong>support@bongomithai.com</strong>
            <br />
            📞 <strong>+91 9775534553</strong>
          </p>
        </section>

        <p className="text-sm text-gray-600">
          <strong>Last Updated:</strong> May 2026
        </p>
      </div>
    </main>
  );
}