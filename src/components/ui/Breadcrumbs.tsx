import Link from 'next/link';

type Crumb = {
  label: string;
  href?: string;
};

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="text-sm text-gray-500">
      <ol className="flex items-center space-x-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center space-x-2">
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-gray-700"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-700 font-medium">
                {item.label}
              </span>
            )}
            {i < items.length - 1 && <span>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
