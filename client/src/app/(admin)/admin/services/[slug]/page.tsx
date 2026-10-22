
import { notFound } from "next/navigation";
import ServiceContentManager from "../../components/ServiceContentManager";
import { cmsPages, type CmsPageSlug } from "config/cmsPages";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ServiceAdminPage({ params }: Props) {
  const { slug } = await params;

  if (!Object.prototype.hasOwnProperty.call(cmsPages, slug)) {
    notFound();
  }

  const config = cmsPages[slug as CmsPageSlug];

  return (
    <ServiceContentManager
      pageKey={config.pageKey}
      pageTitle={config.title}
    />
  );
}
