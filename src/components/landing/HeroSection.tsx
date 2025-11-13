import Link from "next/link";

const feature_pills = [
  "Chat-first experience",
  "Verified medical network",
  "Prescription distribution",
];

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-b from-white via-white to-brand-50/40 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900/70"
    >
      <div className="mx-auto flex max-w-(--breakpoint-2xl) flex-col gap-10 px-4 pb-24 pt-36 sm:px-6 lg:flex-row lg:items-center lg:gap-20 lg:px-8 lg:pb-32">
        <div className="flex flex-1 flex-col gap-6">
          <span className="inline-flex max-w-max items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-brand-500 dark:bg-brand-500/10 dark:text-brand-400">
            Telemedicine, Simplified
          </span>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white/90 md:text-5xl md:leading-[1.1]">
            Connect patients, doctors, and pharmacies in one secure inbox.
          </h1>
          <p className="max-w-xl text-base text-gray-600 dark:text-gray-300 md:text-lg">
            QuickMed Connect keeps every broadcast, consultation, and
            prescription inside a single conversation loop so care teams can
            respond faster.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/inbox"
              className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-theme-xs transition-colors hover:bg-brand-600"
            >
              Go to Inbox
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-brand-200 hover:text-brand-500 dark:border-gray-700 dark:text-gray-300 dark:hover:border-brand-500/40 dark:hover:text-brand-400"
            >
              Create an Account
            </Link>
          </div>

          <ul className="grid gap-3 pt-2 text-sm text-gray-600 dark:text-gray-300 sm:grid-cols-3 sm:gap-4">
            {feature_pills.map((pill) => (
              <li
                key={pill}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800/50"
              >
                <span className="h-2 w-2 rounded-full bg-brand-500"></span>
                <span>{pill}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex flex-1 justify-center">
          <div className="relative isolate overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-theme-xl dark:border-white/10 dark:bg-gray-900">
            <div className="flex max-w-xl flex-col gap-4 px-6 py-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-300">
                  DM
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white/90">
                    Dr. Mason replied
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Neurology • 5 min ago
                  </p>
                </div>
              </div>
              <div className="rounded-2xl bg-gray-50 p-5 text-sm text-gray-600 dark:bg-white/5 dark:text-gray-300">
                <p>
                  &ldquo;Thanks Sarah, reviewing your broadcast now. Please keep
                  your vitals handy, and I&apos;ll send the prescription to your
                  preferred pharmacy.&rdquo;
                </p>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-dashed border-gray-300 p-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white/90">
                    Prescription ready
                  </p>
                  <p>Auto-shared with verified retailers.</p>
                </div>
                <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-500 dark:bg-brand-500/15 dark:text-brand-300">
                  3 recipients
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

