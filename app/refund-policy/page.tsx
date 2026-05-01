export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 text-black">
      <div className="mx-auto max-w-2xl text-left sm:text-justify">
        
        {/* Heading */}
        <h1 className="mb-6 text-center text-3xl font-semibold">
          Refund Policy
        </h1>

        <p className="mb-6 leading-7">
          At BongoMithai, we take great pride in crafting our sweets with care
          and quality. We truly hope you enjoy them as much as we love making
          them!
        </p>

        <p className="mb-6 leading-7">
          Due to the perishable nature of our products, we do not accept returns.
          However, if you:
        </p>

        <ul className="mb-6 list-disc pl-6 leading-7">
          <li>Are not satisfied with a product</li>
          <li>Have received an incorrect or damaged order</li>
        </ul>

        <p className="mb-6 leading-7">
          please contact us within 24 hours of delivery with a clear photo of
          your order.
        </p>

<p className="mb-6 leading-7">
  Once we receive the required details, our Quality Control team will
  review the issue in coordination with our shipping partner. If your
  request is approved, the{" "}
  <strong>refund will be processed within 7–14 working days</strong>.
</p>

        <div className="mb-6 leading-7">
          <p>📞 Phone: +91 9775534553 (10:00 AM – 8:00 PM)</p>
          <p>📧 Email: support@bongomithai.com</p>
        </div>

        <p className="mb-8 leading-7">
          We always strive to make every order perfect and if something isn’t
          right, we’ll do our best to fix it!
        </p>

        <h2 className="mb-4 text-2xl font-semibold">Cancellations</h2>

        <p className="leading-7">
          Once an order is confirmed, it cannot be cancelled or modified. If you
          wish to add more items, please place a new order and leave us a note so
          we can ship everything together.
        </p>

      </div>
    </main>
  );
}