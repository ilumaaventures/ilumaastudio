/**
 * Section Helper Utilities for Storefront Templates
 * Enables individual template components to respect section visibility, order, and dynamic content overrides
 * without sacrificing their bespoke, unique visual design.
 */

/**
 * Checks whether a given section is enabled in the storefront configuration.
 * If sections array is empty or section not present, defaults to true for backward compatibility.
 * @param {Array} sections - Storefront or customization sections
 * @param {string} key - Section key (e.g., "hero", "categories", "featured_products")
 * @returns {boolean}
 */
export function isSectionEnabled(sections, key) {
  if (!Array.isArray(sections) || sections.length === 0) return true;
  const target = sections.find(
    (s) => String(s.key || "").toLowerCase() === String(key || "").toLowerCase()
  );
  if (!target) return true;
  return target.enabled !== false;
}

/**
 * Retrieves the content overrides for a section, merging on top of optional fallback values.
 * @param {Array} sections - Storefront or customization sections
 * @param {string} key - Section key
 * @param {Object} fallback - Default hardcoded fallback values
 * @returns {Object}
 */
export function getSectionContent(sections, key, fallback = {}) {
  if (!Array.isArray(sections) || sections.length === 0) return fallback;
  const target = sections.find(
    (s) => String(s.key || "").toLowerCase() === String(key || "").toLowerCase()
  );
  if (!target || !target.content) return fallback;

  const content = target.content || {};

  // Custom user content values take precedence over fallbacks
  const customTitle = content.title || content.headline || content.heading || content.name;
  const fallbackTitle = fallback.title || fallback.headline || fallback.heading || fallback.name;
  const resolvedTitle = customTitle !== undefined && customTitle !== "" ? customTitle : fallbackTitle;

  const customDesc = content.description || content.subtitle || content.text;
  const fallbackDesc = fallback.description || fallback.subtitle || fallback.text;
  const resolvedDesc = customDesc !== undefined && customDesc !== "" ? customDesc : fallbackDesc;

  const customBadge = content.badge || content.tag || content.studioTag || content.floralTag || content.eyebrow;
  const fallbackBadge = fallback.badge || fallback.tag || fallback.studioTag || fallback.floralTag || fallback.eyebrow;
  const resolvedBadge = customBadge !== undefined && customBadge !== "" ? customBadge : fallbackBadge;

  const customCta = content.ctaText || content.primaryCtaText || content.buttonText || content.buttonLabel || content.linkText;
  const fallbackCta = fallback.ctaText || fallback.primaryCtaText || fallback.buttonText || fallback.buttonLabel || fallback.linkText;
  const resolvedCta = customCta !== undefined && customCta !== "" ? customCta : fallbackCta;

  const customImage = content.image || content.bgImage || content.heroBanner || content.bannerImage;
  const fallbackImage = fallback.image || fallback.bgImage || fallback.heroBanner || fallback.bannerImage;
  const resolvedImage = customImage !== undefined && customImage !== "" ? customImage : fallbackImage;

  return {
    ...fallback,
    ...content,
    ...(resolvedTitle !== undefined ? { title: resolvedTitle, headline: resolvedTitle, heading: resolvedTitle, name: resolvedTitle } : {}),
    ...(resolvedDesc !== undefined ? { description: resolvedDesc, subtitle: resolvedDesc, text: resolvedDesc } : {}),
    ...(resolvedBadge !== undefined ? { badge: resolvedBadge, tag: resolvedBadge } : {}),
    ...(resolvedCta !== undefined ? { ctaText: resolvedCta, primaryCtaText: resolvedCta, buttonText: resolvedCta } : {}),
    ...(resolvedImage !== undefined ? { image: resolvedImage, bgImage: resolvedImage } : {}),
  };
}

/**
 * Returns the sections sorted by their configured order.
 * @param {Array} sections - Array of sections
 * @returns {Array}
 */
export function getOrderedSections(sections) {
  if (!Array.isArray(sections)) return [];
  return [...sections].sort((a, b) => (a.order || 0) - (b.order || 0));
}
