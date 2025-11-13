import Link from "next/link";

const footer_links = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Support", href: "#" },
];

export default function LandingFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white py-10 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex max-w-(--breakpoint-2xl) flex-col gap-6 px-4 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="font-medium text-gray-700 dark:text-gray-300">
          © {new Date().getFullYear()} QuickMed Connect. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          {footer_links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-brand-500 dark:hover:text-brand-400"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

