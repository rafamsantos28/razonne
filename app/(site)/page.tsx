import Hero from "@/components/Hero";
import CatalogBrowser from "@/components/CatalogBrowser";
import { catalog, getFeaturedItem } from "@/lib/catalog";

export default function HomePage() {
  const featured = getFeaturedItem();

  return (
    <>
      <Hero item={featured} />

      <section className="mx-auto max-w-content px-6 py-14 md:px-10">
        <h2 className="font-display text-xl font-medium text-frost">
          Catálogo
        </h2>

        <div className="mt-5">
          <CatalogBrowser items={catalog} />
        </div>
      </section>
    </>
  );
}
