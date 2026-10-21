// Admin-panel access by role (mirrors server/src/utils/permissions.ts).
//
// ADMIN and OWNER reach every section. MODERATOR (developers working on the
// site) reaches only the sections an admin has granted them on the Users page.
// A new moderator starts with the website sections and none of the official
// records; the admin can then open or close any section.

export const FULL_ADMIN_ROLES = ["ADMIN", "OWNER"];

export type AdminSection =
  | "about" | "handbook" | "ndis" | "services" | "silHouses" | "compassion" | "events"
  | "feedback" | "career" | "training" | "contactUs" | "referral"
  | "users" | "scBilling" | "serviceAgreements" | "contracts";

export const ADMIN_SECTIONS: { key: AdminSection; label: string; group: "Website" | "Official records"; paths: string[] }[] = [
  { key: "about", label: "About Health U", group: "Website", paths: ["/admin/about"] },
  { key: "handbook", label: "Participant Handbook", group: "Website", paths: ["/admin/participant-handbook"] },
  { key: "ndis", label: "NDIS", group: "Website", paths: ["/admin/ndis"] },
  {
    key: "services", label: "Services", group: "Website", paths: [
      "/admin/community-participation", "/admin/capacity-building", "/admin/support-coordination",
      "/admin/assist-in-self-care", "/admin/assist-in-transport", "/admin/home-modification",
      "/admin/non-ndis-service", "/admin/gardening-house-yard",
    ],
  },
  { key: "silHouses", label: "SIL House", group: "Website", paths: ["/admin/sil-houses"] },
  { key: "compassion", label: "Compassion in Action", group: "Website", paths: ["/admin/compassion-in-action"] },
  { key: "events", label: "Events and News", group: "Website", paths: ["/admin/current-events", "/admin/past-events"] },
  { key: "feedback", label: "Feedback", group: "Website", paths: ["/admin/participant-feedback"] },
  { key: "career", label: "Career", group: "Website", paths: ["/admin/career"] },
  { key: "training", label: "Training", group: "Website", paths: ["/admin/training"] },
  { key: "contactUs", label: "Contact Us", group: "Website", paths: ["/admin/contact-us"] },
  { key: "referral", label: "Referral", group: "Website", paths: ["/admin/referral"] },
  { key: "users", label: "All Users", group: "Official records", paths: ["/admin/users", "/all-users"] },
  { key: "scBilling", label: "SC Billing", group: "Official records", paths: ["/admin/sc-billing"] },
  { key: "serviceAgreements", label: "Service Agreements", group: "Official records", paths: ["/admin/service-agreements", "/admin/service-agreement-tool"] },
  { key: "contracts", label: "Contracts", group: "Official records", paths: ["/admin/contracts", "/admin/contract-generator"] },
];

type AccessUser = { role?: string | null; permissions?: string[] | null } | null | undefined;

export const isFullAdmin = (role?: string | null) =>
  typeof role === "string" && FULL_ADMIN_ROLES.includes(role.toUpperCase());

export const canAccessSection = (user: AccessUser, key: AdminSection) =>
  isFullAdmin(user?.role) ||
  (user?.role?.toUpperCase() === "MODERATOR" && (user.permissions || []).includes(key));

// the section a path belongs to, if any (the dashboard belongs to none)
export const sectionForPath = (path?: string | null): AdminSection | null => {
  if (!path) return null;
  const hit = ADMIN_SECTIONS.find((s) => s.paths.some((p) => path === p || path.startsWith(p + "/")));
  return hit ? hit.key : null;
};

// The dashboard is open to every panel user. Any other /admin page must belong
// to a granted section, so a page added later stays closed to moderators until
// it is listed above.
export const canAccessPath = (user: AccessUser, path?: string | null) => {
  if (isFullAdmin(user?.role)) return true;
  const key = sectionForPath(path);
  if (key) return canAccessSection(user, key);
  return path === "/admin" || !path?.startsWith("/admin");
};
