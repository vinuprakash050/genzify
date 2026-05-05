import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 sm:px-6 lg:px-10">
      <div className="glass-panel max-w-xl rounded-[2.5rem] p-10 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-secondary">404</p>
        <h1 className="mt-4 text-4xl font-black uppercase text-white sm:text-5xl">
          Lost in the drop
        </h1>
        <p className="mt-4 leading-8 muted-copy">
          The page you were looking for is missing, but the next collection is still within reach.
        </p>
        <Link
          href="/"
          className="glass-button mt-8 inline-flex rounded-full px-7 py-4 text-sm font-black uppercase tracking-[0.25em]"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
