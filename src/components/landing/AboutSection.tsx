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
  const gradientCards = [
    'from-brand-500/10 via-purple-500/10 to-pink-500/10',
    'from-purple-500/10 via-pink-500/10 to-blue-light-500/10',
    'from-pink-500/10 via-blue-light-500/10 to-brand-500/10',
  ];

  const borderGradients = [
    'from-brand-500 to-purple-500',
    'from-purple-500 to-pink-500',
    'from-pink-500 to-brand-500',
  ];

  return (
    <section
      id="about"
      className="relative border-t border-gray-200/50 bg-gradient-to-b from-white to-gray-50/50 py-20 dark:border-gray-800/50 dark:from-gray-900 dark:to-gray-800/30"
    >
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-brand-500/10 via-purple-500/10 to-pink-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-600 dark:from-brand-500/20 dark:via-purple-500/20 dark:to-pink-500/20 dark:text-brand-400 border border-brand-500/20 dark:border-brand-500/30">
            About QuickMed Connect
          </span>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            Designed around a single conversation loop.
          </h2>
          <p className="mt-4 text-base text-gray-600 dark:text-gray-300 md:text-lg leading-relaxed">
            We replaced dashboards with dialogue so every participant can focus
            on care. QuickMed Connect keeps the patient story at the center,
            from first broadcast to final prescription handoff.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {milestones.map((item, index) => (
            <div
              key={item.title}
              className={`gradient-card relative rounded-2xl bg-gradient-to-br ${gradientCards[index]} p-6 backdrop-blur-sm`}
            >
              {/* Gradient Border Top */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${borderGradients[index]} rounded-t-2xl`} />
              
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
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

