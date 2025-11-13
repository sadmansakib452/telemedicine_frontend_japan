const milestones = [
  {
    title: "Broadcasts that reach every doctor",
    description:
      "Patients share their medical story once. Verified doctors can claim the case instantly and move the conversation forward.",
  },
  {
    title: "Real-time collaboration",
    description:
      "Secure messaging keeps everyone in sync—patients get answers faster, and doctors coordinate with pharmacies without leaving chat.",
  },
  {
    title: "Prescription distribution",
    description:
      "Once a prescription is issued, QuickMed Connect notifies verified shop owners automatically so medication sourcing is seamless.",
  },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative border-t border-gray-200 bg-white py-20 dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-500 dark:bg-brand-500/10 dark:text-brand-300">
            About QuickMed Connect
          </span>
          <h2 className="mt-6 text-3xl font-semibold text-gray-900 dark:text-white/90 md:text-4xl">
            Designed around a single conversation loop.
          </h2>
          <p className="mt-4 text-base text-gray-600 dark:text-gray-300 md:text-lg">
            We replaced dashboards with dialogue so every participant can focus
            on care. QuickMed Connect keeps the patient story at the center,
            from first broadcast to final prescription handoff.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {milestones.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-theme-xs transition hover:border-brand-200 hover:bg-white dark:border-gray-800 dark:bg-gray-800/40 dark:hover:border-brand-500/30 dark:hover:bg-gray-800"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white/90">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

