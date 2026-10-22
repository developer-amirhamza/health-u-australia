/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: "https://healthuau.com.au",
  generateRobotsTxt: true,
  changefreq: "daily",
  priority: 0.7,
  autoLastmod: true,
  exclude: ["/admin", "/admin/*", "/non-ndis", "/login", "/register", "/signin", "/signup", "/verify-email", "/welcome", "/service-agreement-tool", "/contract/sign", "/gardening-yard-maintenance", "/support-independent-living"],
};

export default config;

