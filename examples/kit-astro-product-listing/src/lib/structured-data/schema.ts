/**
 * Schema.org structured data generators
 * These are pure functions that can be used in both server and client components
 */
import type { JsonLdValue } from './jsonld';

export const schemaToJsonLd = (schema: JsonLdValue): string => {
  return JSON.stringify(schema, null, 2);
};

export interface ArticleSchemaProps {
  headline: string;
  description?: string;
  image?: string | string[];
  datePublished?: string;
  dateModified?: string;
  author?: { name: string; url?: string };
  publisher?: { name: string; logo?: string };
  url?: string;
}

export function generateArticleSchema(props: ArticleSchemaProps): JsonLdValue {
  const { headline, description, image, datePublished, dateModified, author, publisher, url } = props;
  const schema = { '@context': 'https://schema.org', '@type': 'Article', headline } as { [key: string]: JsonLdValue };
  if (description) schema.description = description;
  if (image) schema.image = Array.isArray(image) ? image : [image];
  if (datePublished) schema.datePublished = datePublished;
  if (dateModified) schema.dateModified = dateModified;
  if (author) schema.author = { '@type': 'Person', name: author.name, ...(author.url && { url: author.url }) };
  if (publisher) schema.publisher = { '@type': 'Organization', name: publisher.name, ...(publisher.logo && { logo: { '@type': 'ImageObject', url: publisher.logo } }) };
  if (url) { schema.url = url; schema.mainEntityOfPage = { '@type': 'WebPage', '@id': url }; }
  return schema as JsonLdValue;
}

export interface FAQItem { question: string; answer: string; }
export interface FAQPageSchemaProps { faqs: FAQItem[]; }

export const generateFAQPageSchema = (props: FAQPageSchemaProps): JsonLdValue | null => {
  const { faqs } = props;
  if (!faqs || faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })),
  } as JsonLdValue;
};

export interface OrganizationSchemaProps { name: string; url?: string; logo?: string; sameAs?: string[]; contactPoint?: { telephone?: string; contactType?: string; email?: string }; }

export function generateOrganizationSchema(props: OrganizationSchemaProps): JsonLdValue {
  const { name, url, logo, sameAs, contactPoint } = props;
  const result: { [key: string]: JsonLdValue } = { '@context': 'https://schema.org', '@type': 'Organization', name };
  if (url) result.url = url as JsonLdValue;
  if (logo) result.logo = logo as JsonLdValue;
  if (sameAs && sameAs.length > 0) result.sameAs = sameAs as JsonLdValue;
  if (contactPoint) result.contactPoint = { '@type': 'ContactPoint', ...(contactPoint.telephone && { telephone: contactPoint.telephone }), ...(contactPoint.contactType && { contactType: contactPoint.contactType }), ...(contactPoint.email && { email: contactPoint.email }) } as JsonLdValue;
  return result as JsonLdValue;
}

export interface WebSiteSchemaProps { name: string; url: string; searchUrlTemplate?: string; }

export function generateWebSiteSchema(props: WebSiteSchemaProps): JsonLdValue {
  const { name, url, searchUrlTemplate } = props;
  const result: { [key: string]: JsonLdValue } = { '@context': 'https://schema.org', '@type': 'WebSite', name, url };
  if (searchUrlTemplate) result.potentialAction = { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: searchUrlTemplate }, 'query-input': 'required name=search_term_string' } as JsonLdValue;
  return result as JsonLdValue;
}

export interface WebPageSchemaProps { name: string; url?: string; description?: string; inLanguage?: string; isPartOf?: { name: string; url: string }; }

export function generateWebPageSchema(props: WebPageSchemaProps): JsonLdValue {
  const { name, url, description, inLanguage, isPartOf } = props;
  const schema = { '@context': 'https://schema.org', '@type': 'WebPage', name } as { [key: string]: JsonLdValue };
  if (description) schema.description = description;
  if (url) schema.url = url;
  if (inLanguage) schema.inLanguage = inLanguage;
  if (isPartOf) schema.isPartOf = { '@type': 'WebSite', name: isPartOf.name, url: isPartOf.url };
  return schema as JsonLdValue;
}

export interface BreadcrumbItem { name: string; url: string; position: number; }
export interface BreadcrumbListSchemaProps { items: BreadcrumbItem[]; }

export const generateBreadcrumbListSchema = (props: BreadcrumbListSchemaProps): JsonLdValue | null => {
  const { items } = props;
  if (!items || items.length === 0) return null;
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((item) => ({ '@type': 'ListItem', position: item.position, name: item.name, item: item.url })) } as JsonLdValue;
};

export interface PersonSchemaProps { name: string; jobTitle?: string; image?: string; url?: string; sameAs?: string[]; }

export function generatePersonSchema(props: PersonSchemaProps): JsonLdValue {
  const { name, jobTitle, image, url, sameAs } = props;
  const schema = { '@context': 'https://schema.org', '@type': 'Person', name } as { [key: string]: JsonLdValue };
  if (jobTitle) schema.jobTitle = jobTitle;
  if (image) schema.image = image;
  if (url) schema.url = url;
  if (sameAs && sameAs.length > 0) schema.sameAs = sameAs;
  return schema as JsonLdValue;
}

// --- Reference project compatibility functions (used by SXA components) ---

export type ArticleJsonLd = {
  '@context': 'https://schema.org';
  '@type': 'Article';
  headline?: string;
  articleBody?: string;
  inLanguage?: string;
};

export type ProductJsonLd = {
  '@context': 'https://schema.org';
  '@type': 'Product';
  name?: string;
  description?: string;
  image?: string | string[];
  url?: string;
};

export type PlaceJsonLd = {
  '@context': 'https://schema.org';
  '@type': 'Place';
  name?: string;
  address?: JsonLdValue;
  geo?: JsonLdValue;
  url?: string;
};

export type FaqPageJsonLd = {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: { '@type': 'Answer'; text: string };
  }>;
};

const stripHtml = (html: string): string =>
  html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script[^>]*>/gi, ' ')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style[^>]*>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const extractFaqEntriesFromHtml = (html?: string): Array<{ question: string; answer: string }> => {
  if (!html) return [];
  const entries: Array<{ question: string; answer: string }> = [];
  const detailsRe = /<details[\s\S]*?>[\s\S]*?<summary[^>]*>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/gi;
  const strip = (v: string) => v.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  let match: RegExpExecArray | null;
  while ((match = detailsRe.exec(html)) !== null) {
    const question = strip(match[1] ?? '');
    const answer = strip(match[2] ?? '');
    if (question && answer) entries.push({ question, answer });
  }
  return entries;
};

const extractAddressTextFromHtml = (html?: string): string | undefined => {
  if (!html) return undefined;
  const match = /<address[^>]*>([\s\S]*?)<\/address>/i.exec(html);
  if (!match?.[1]) return undefined;
  return match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || undefined;
};

export function buildArticleJsonLd(input: {
  headline?: string;
  articleBodyHtml?: string;
  inLanguage?: string;
}): ArticleJsonLd {
  const articleBody = input.articleBodyHtml ? stripHtml(input.articleBodyHtml) : undefined;
  return { '@context': 'https://schema.org', '@type': 'Article', headline: input.headline, articleBody, inLanguage: input.inLanguage };
}

export function buildProductJsonLd(input: {
  name?: string;
  descriptionHtml?: string;
  image?: string | string[];
  url?: string;
}): ProductJsonLd {
  const description = input.descriptionHtml ? stripHtml(input.descriptionHtml) : undefined;
  return { '@context': 'https://schema.org', '@type': 'Product', name: input.name, description, image: input.image, url: input.url };
}

export function buildPlaceJsonLd(input: {
  name?: string;
  html?: string;
  address?: JsonLdValue;
  geo?: JsonLdValue;
  url?: string;
}): PlaceJsonLd | null {
  const addressText = extractAddressTextFromHtml(input.html);
  const address = input.address ?? (addressText ? { '@type': 'PostalAddress', streetAddress: addressText } : undefined);
  if (!address) return null;
  return { '@context': 'https://schema.org', '@type': 'Place', name: input.name, address, geo: input.geo, url: input.url };
}

export function buildFaqPageJsonLd(input: {
  html?: string;
  mainEntity?: Array<{ question: string; answer: string }>;
}): FaqPageJsonLd | null {
  const faqEntries = input.mainEntity ?? extractFaqEntriesFromHtml(input.html);
  if (faqEntries.length === 0) return null;
  return {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqEntries.map(({ question, answer }) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })),
  };
}
