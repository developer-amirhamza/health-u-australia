/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: "https://healthuau.com.au",
  generateRobotsTxt: true,
  changefreq: "daily",
  priority: 0.7,
  autoLastmod: true,
  exclude: ["/non-ndis", "/login", "/register", "/welcome", "/service-agreement-tool"],
};

export default config;

