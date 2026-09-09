import type { MetadataRoute } from "next";

// Unlisted writing lives under one prefix precisely so it can be excluded here
// without naming a single essay — listing the slugs would defeat the point.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/archive/", "/writing/private/", "/audio/"],
      },
    ],
  };
}
