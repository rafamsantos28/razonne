import type { MetadataRoute } from "next";
import { catalog } from "@/lib/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://razonneplus.pt";
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    ...catalog.map((t) => ({
      url: `${base}/titulo/${t.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
