export default function ContactInformationPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 text-black">
      <div className="mx-auto max-w-2xl text-left sm:text-justify">

        {/* Heading */}
        <h1 className="mb-6 text-center text-3xl font-semibold">
          Contact Information
        </h1>

        <p className="mb-6 leading-7">
          <strong>Trade Name:</strong> BongoMithai
        </p>

        <p className="mb-6 leading-7">
          📞 <strong>Phone:</strong> +91 9775534553
          <br />
          📧 <strong>Email:</strong> support@bongomithai.com
        </p>

        <h2 className="mb-4 text-2xl font-semibold">
          Registered Address
        </h2>

        <p className="mb-8 leading-7">
          Nimpith, Joynagar <br />
          South 24 Parganas <br />
          West Bengal, India – 743338
        </p>

        <p className="leading-7">
          For any questions, support requests, or feedback, feel free to reach
          out to us. We’re happy to help!
        </p>

      </div>
    </main>
  );
}