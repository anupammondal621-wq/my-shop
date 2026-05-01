export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 text-black">
      <div className="mx-auto max-w-2xl text-left sm:text-justify">

        {/* Heading */}
        <h1 className="mb-6 text-center text-3xl font-semibold">
          Privacy Policy
        </h1>

        <p className="mb-6 leading-7">
          This Privacy Policy describes how your personal information is
          collected, used, and disclosed by BongoMithai (“we”, “us”, or “our”)
          when you visit or make a purchase from{" "}
          <strong>https://www.bongomithai.com/</strong> (the “Site”). This Privacy
          Policy should be read in conjunction with our Terms of Service.
        </p>

        <h2 className="mb-4 text-2xl font-semibold">
          Personal Information We Collect
        </h2>

        <p className="mb-6 leading-7">
          When you visit the Site, we automatically collect certain information
          about your device, including your web browser, IP address, time zone,
          and certain cookies installed on your device. Additionally, as you
          browse the Site, we collect information about the individual web pages
          or products that you view, what websites or search terms referred you
          to the Site, and how you interact with the Site (“Device Information”).
        </p>

        <p className="mb-4 leading-7">
          We collect Device Information using:
        </p>

        <ul className="mb-6 list-disc pl-6 leading-7">
          <li><strong>Cookies</strong> – data files stored on your device</li>
          <li><strong>Log files</strong> – track activity such as IP, browser, timestamps</li>
          <li><strong>Web beacons, tags, pixels</strong> – record browsing behavior</li>
        </ul>

        <h2 className="mb-4 text-2xl font-semibold">Order Information</h2>

        <p className="mb-6 leading-7">
          When you make a purchase, we collect your name, billing address,
          shipping address, payment details, email, and phone number (“Order
          Information”).
        </p>

        <p className="mb-6 leading-7">
          Payments are securely processed via <strong>Razorpay</strong>. We do
          not store sensitive payment details like card numbers.
        </p>

        <p className="mb-6 leading-7">
          Our infrastructure uses <strong>Supabase</strong> (database) and{" "}
          <strong>Vercel</strong> (hosting), which may process data only to
          provide our services.
        </p>

        <h2 className="mb-4 text-2xl font-semibold">
          Use of Personal Information
        </h2>

        <ul className="mb-6 list-disc pl-6 leading-7">
          <li>Process and fulfill orders</li>
          <li>Arrange shipping and confirmations</li>
          <li>Communicate with you</li>
          <li>Prevent fraud and risks</li>
        </ul>

        <p className="mb-6 leading-7">
          We also use Device Information to improve performance, analyze user
          behavior, and measure marketing effectiveness.
        </p>

        <h2 className="mb-4 text-2xl font-semibold">
          Sharing of Personal Information
        </h2>

        <ul className="mb-6 list-disc pl-6 leading-7">
          <li>Payment providers (Razorpay)</li>
          <li>Hosting & backend (Vercel, Supabase)</li>
          <li>Analytics & ads (Google, Facebook/Instagram)</li>
        </ul>

        <p className="mb-6 leading-7">
          We may also share information to comply with legal obligations or
          protect our rights.
        </p>

        <h2 className="mb-4 text-2xl font-semibold">
          Behavioural Advertising
        </h2>

        <p className="mb-4 leading-7">
          You can opt out of targeted ads:
        </p>

        <ul className="mb-6 list-disc pl-6 leading-7">
          <li>Facebook: https://www.facebook.com/settings/?tab=ads</li>
          <li>Google: https://www.google.com/settings/ads</li>
          <li>General: http://optout.aboutads.info/</li>
        </ul>

        <h2 className="mb-4 text-2xl font-semibold">Your Rights</h2>

        <ul className="mb-6 list-disc pl-6 leading-7">
          <li>Access your data</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion</li>
        </ul>

        <h2 className="mb-4 text-2xl font-semibold">Data Retention</h2>

        <p className="mb-6 leading-7">
          We retain your Order Information unless you request deletion, subject
          to legal obligations.
        </p>

        <h2 className="mb-4 text-2xl font-semibold">Do Not Track</h2>

        <p className="mb-6 leading-7">
          We do not alter data collection in response to “Do Not Track” browser
          signals.
        </p>

        <h2 className="mb-4 text-2xl font-semibold">
          Changes to This Privacy Policy
        </h2>

        <p className="mb-6 leading-7">
          We may update this policy to reflect changes in practices or legal
          requirements.
        </p>

        <h2 className="mb-4 text-2xl font-semibold">Contact Information</h2>

        <p className="mb-6 leading-7">
          📧 <strong>support@bongomithai.com</strong> <br />
          📞 <strong>+91 9775534553</strong>
        </p>

        <p className="mb-4 text-sm text-gray-600">
          Last Updated: May 2026
        </p>

        <p className="text-sm text-gray-600">
          By using our Site, you acknowledge that you have read and understood
          this Privacy Policy.
        </p>

      </div>
    </main>
  );
}