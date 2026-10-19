export const cmsPages = {
  'community-participation': { title: 'Community Participation', pageKey: 'community_participation' },
  'capacity-building': { title: 'Capacity Building', pageKey: 'capacity_building' },
  'support-coordination': { title: 'Support Coordination', pageKey: 'support_coordination' },
  'assist-in-self-care': { title: 'Assist In Self-Care', pageKey: 'assist_in_self_care' },
  'assist-in-transport': { title: 'Assist In Transport', pageKey: 'assist_in_transport' },
  'home-modification': { title: 'Home Modification', pageKey: 'home_modification' },
  'gardening-house-yard': { title: 'Gardening / House and Yard Maintenance', pageKey: 'gardening_house_yard' },
} as const;
export type CmsPageSlug = keyof typeof cmsPages;
