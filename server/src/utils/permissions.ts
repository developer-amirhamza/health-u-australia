// Admin-panel access by role.
//
// ADMIN and OWNER reach every section. MODERATOR (developers working on the
// site) reaches only the sections an admin has granted them on the Users page,
// stored as keys in User.permissions. A new moderator starts with the website
// sections and none of the official-records ones (contracts, service
// agreements, SC billing, users); the admin can then open or close any of them.
// Mirrored on the client in client/src/utils/adminAccess.ts.

export const FULL_ADMIN_ROLES = ["ADMIN", "OWNER"];
export const PANEL_ROLES = [...FULL_ADMIN_ROLES, "MODERATOR"];

export const WEBSITE_SECTIONS = [
  "home", "about", "handbook", "ndis", "services", "silHouses", "compassion", "events",
  "feedback", "career", "training", "contactUs", "referral",
] as const;
export const OFFICIAL_SECTIONS = ["users", "scBilling", "serviceAgreements", "contracts"] as const;
export const ADMIN_SECTIONS = [...WEBSITE_SECTIONS, ...OFFICIAL_SECTIONS] as const;
export type AdminSection = (typeof ADMIN_SECTIONS)[number];

// what a moderator gets when an admin first gives them the role
export const DEFAULT_MODERATOR_SECTIONS: AdminSection[] = [...WEBSITE_SECTIONS];

export const isFullAdmin = (role?: string | null) => !!role && FULL_ADMIN_ROLES.includes(role);

export const canAccessSection = (role: string | null | undefined, permissions: string[] | null | undefined, section: AdminSection) =>
  isFullAdmin(role) || (role === "MODERATOR" && (permissions || []).includes(section));

// keeps only known section keys, once each
export const cleanPermissions = (value: unknown): AdminSection[] =>
  Array.isArray(value) ? ADMIN_SECTIONS.filter((s) => value.includes(s)) : [];
