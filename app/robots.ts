import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.mugenime.my.id";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/api/image-proxy"],

      disallow: ["/search", "/api/", "/admin/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
