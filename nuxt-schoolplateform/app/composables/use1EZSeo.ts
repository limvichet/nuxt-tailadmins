import type { ResolvableValue } from "@unhead/vue";

export const defaultSeo = {
  desc: "Welcome to 1EZ Platform! Created to improve your productivity!",
  title: "1EZ School",
  site: "1ez.co",
};

interface EZSEOProps {
  title: ResolvableValue<string | undefined>;
  description: ResolvableValue<string | undefined>;
  ogImageHeadline?: string;
  ogImageComponent?: string;
}

export const use1EZSeo = ({
  title,
  description,
  ogImageHeadline = "1EZ Website",
  ogImageComponent = "EachPage",
}: EZSEOProps) => {
  useSeoMeta({
    title: title,
    description,
    ogSiteName: "1ez.co",
    ogTitle: title,
    ogDescription: description,
    twitterTitle: title,
    twitterSite: "1ez.co",
    twitterDescription: description,
  });

  // Render the Open Graph image component:
  defineOgImageComponent(ogImageComponent, {
    headline: ogImageHeadline,
    title: title,
    desc: description,
  });
};
