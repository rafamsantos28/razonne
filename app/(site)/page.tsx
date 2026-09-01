import Hero from "@/components/Hero";
import VideoCard from "@/components/VideoCard";
import { catalog, getFeaturedTitle } from "@/lib/catalog";

export default function HomePage() {
  const featured = getFeaturedTitle();

  return (
    <>
      <Hero title={featured} />

      <section className="mx-auto max-w-content px-6 py-14 md:px-10">
        <h2 className="font-display text-xl font-medium text-frost">
          Catálogo
        </h2>
        <p className="mt-1 text-sm text-mist">
          {catalog.length} títulos disponíveis
        </p>

        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {catalog.map((title) => (
            <VideoCard key={title.slug} title={title} />
          ))}
        </div>

      </section>
    </>
  );
}
