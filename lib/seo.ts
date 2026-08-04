import type { CatalogData, DiscoveryBusiness, Product } from "@/lib/types";

function absoluteUrl(value: string, siteUrl: string) {
  if (/^https?:\/\//i.test(value)) return value;
  return new URL(value || "/", `${siteUrl}/`).toString();
}

function getBusinessSchemaType(category: string) {
  const normalized = category.toLocaleLowerCase();
  if (normalized.includes("restaurant")) return "Restaurant";
  if (normalized.includes("bakery")) return "Bakery";
  if (normalized.includes("cafe")) return "CafeOrCoffeeShop";
  if (normalized.includes("homestay")) return "LodgingBusiness";
  if (normalized.includes("boutique")) return "Store";
  return "LocalBusiness";
}

function getOffer(product: Product, siteUrl: string) {
  if (product.price === null) return undefined;
  return {
    "@type": "Offer",
    price: product.price,
    priceCurrency: product.currency,
    availability: product.available
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock",
    url: siteUrl,
  };
}

export function getCatalogStructuredData(
  catalog: CatalogData,
  publicUrl: string,
) {
  const { business, products } = catalog;
  return {
    "@context": "https://schema.org",
    "@type": getBusinessSchemaType(business.category),
    "@id": `${publicUrl}#business`,
    name: business.name,
    description: business.description,
    url: publicUrl,
    image: business.coverImageUrl
      ? absoluteUrl(business.coverImageUrl, publicUrl)
      : undefined,
    telephone: business.phone || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address,
    },
    geo:
      business.latitude !== null && business.longitude !== null
        ? {
            "@type": "GeoCoordinates",
            latitude: business.latitude,
            longitude: business.longitude,
          }
        : undefined,
    openingHours: Object.entries(business.openingHours).map(
      ([day, hours]) => `${day} ${hours}`,
    ),
    sameAs: business.instagramUrl ? [business.instagramUrl] : undefined,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${business.name} catalog`,
      itemListElement: products.map((product, index) => ({
        "@type": "OfferCatalog",
        position: index + 1,
        name: product.name,
        description: product.description,
        image: product.imageUrl
          ? absoluteUrl(product.imageUrl, publicUrl)
          : undefined,
        itemOffered: {
          "@type": "Product",
          name: product.name,
          description: product.description,
          category: product.category,
          image: product.imageUrl
            ? absoluteUrl(product.imageUrl, publicUrl)
            : undefined,
          offers: getOffer(product, publicUrl),
        },
      })),
    },
  };
}

export function getDirectoryStructuredData(
  businesses: DiscoveryBusiness[],
  siteUrl: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Local businesses and catalogs",
    numberOfItems: businesses.length,
    itemListElement: businesses.map((business, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteUrl}/shop/${business.slug}`,
      name: business.name,
      item: {
        "@type": getBusinessSchemaType(business.category),
        name: business.name,
        description: business.description,
        address: business.address,
        image: business.coverImageUrl
          ? absoluteUrl(business.coverImageUrl, siteUrl)
          : undefined,
      },
    })),
  };
}

export function serializeStructuredData(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
