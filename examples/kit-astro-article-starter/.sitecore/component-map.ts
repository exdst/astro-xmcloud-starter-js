import Container from "@/components/container/Container.astro";
import RowSplitter from "@/components/row-splitter/RowSplitter.astro";
import ColumnSplitter from "@/components/column-splitter/ColumnSplitter.astro";
import Title from "@/components/title/Title.astro";
import RichText from "@/components/rich-text/RichText.astro";
import Image from "@/components/image/Image.astro";
import Promo from "@/components/promo/Promo.astro";
import Navigation from "@/components/navigation/Navigation.astro";
import LinkList from "@/components/link-list/LinkList.astro";
import PageContent from "@/components/page-content/PageContent.astro";
import ContentBlock from "@/components/content-block/ContentBlock.astro";
import PartialDesignDynamicPlaceholder from "@/components/partial-design-dynamic-placeholder/PartialDesignDynamicPlaceholder.astro";
import StructuredData from "@/components/structured-data/StructuredData.astro";
import GlobalHeader from "@/components/global-header/GlobalHeader.astro";
import GlobalFooter from "@/components/global-footer/GlobalFooter.astro";
import FooterNavigationColumn from "@/components/global-footer/FooterNavigationColumn.astro";
import Hero from "@/components/hero/Hero.astro";
import AccordionBlock from "@/components/accordion-block/AccordionBlock.astro";
import ArticleHeader from "@/components/article-header/ArticleHeader.astro";
import ArticleListing from "@/components/article-listing/ArticleListing.astro";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs.astro";
import ButtonComponent from "@/components/button-component/ButtonComponent.astro";
import CtaBanner from "@/components/cta-banner/CtaBanner.astro";
import RichTextBlock from "@/components/rich-text-block/RichTextBlock.astro";
import PromoBlock from "@/components/promo-block/PromoBlock.astro";
import TextBanner from "@/components/text-banner/TextBanner.astro";
import MultiPromo from "@/components/multi-promo/MultiPromo.astro";
import MultiPromoTabsWrapper from "@/components/multi-promo-tabs/MultiPromoTabsWrapper.astro";
import LogoTabsWrapper from "@/components/logo-tabs/LogoTabsWrapper.astro";
import TestimonialCarouselWrapper from "@/components/testimonial-carousel/TestimonialCarouselWrapper.astro";
import SubscriptionBannerWrapper from "@/components/subscription-banner/SubscriptionBannerWrapper.astro";
import PromoAnimated from "@/components/promo-animated/PromoAnimated.astro";
import PageHeader from "@/components/page-header/PageHeader.astro";
import SecondaryNavigation from "@/components/secondary-navigation/SecondaryNavigation.astro";
import TopicListing from "@/components/topic-listing/TopicListing.astro";
import SiteMetadata from "@/components/site-metadata/SiteMetadata.astro";
import Icon from "@/components/icon/Icon.astro";
import ImageBlock from "@/components/image-block/ImageBlock.astro";
import Video from "@/components/video/Video.astro";
import VerticalImageAccordion from "@/components/vertical-image-accordion/VerticalImageAccordion.astro";

const components = new Map<string, any>([
  // Structural / SXA components
  ["Container", Container],
  ["Container5050", Container],
  ["Container7030", Container],
  ["Container3070", Container],
  ["Container4060", Container],
  ["Container6040", Container],
  ["Container6321", Container],
  ["Container70", Container],
  ["Container303030", Container],
  ["Container25252525", Container],
  ["ContainerFullWidth", Container],
  ["ContainerFullBleed", Container],
  ["RowSplitter", RowSplitter],
  ["ColumnSplitter", ColumnSplitter],
  ["Title", Title],
  ["RichText", RichText],
  ["Image", Image],
  ["Promo", Promo],
  ["Navigation", Navigation],
  ["LinkList", LinkList],
  ["PageContent", PageContent],
  ["ContentBlock", ContentBlock],
  ["PartialDesignDynamicPlaceholder", PartialDesignDynamicPlaceholder],
  ["StructuredData", StructuredData],

  // Article-starter specific components
  ["GlobalHeader", GlobalHeader],
  ["GlobalFooter", GlobalFooter],
  ["FooterNavigationColumn", FooterNavigationColumn],
  ["Hero", Hero],
  ["AccordionBlock", AccordionBlock],
  ["ArticleHeader", ArticleHeader],
  ["ArticleListing", ArticleListing],
  ["Breadcrumbs", Breadcrumbs],
  ["ButtonComponent", ButtonComponent],
  ["CtaBanner", CtaBanner],
  ["RichTextBlock", RichTextBlock],
  ["PromoBlock", PromoBlock],
  ["TextBanner", TextBanner],
  ["TextBanner01", TextBanner],
  ["TextBanner02", TextBanner],
  ["MultiPromo", MultiPromo],
  ["MultiPromoTabs", MultiPromoTabsWrapper],
  ["LogoTabs", LogoTabsWrapper],
  ["TestimonialCarousel", TestimonialCarouselWrapper],
  ["SubscriptionBanner", SubscriptionBannerWrapper],
  ["PromoAnimated", PromoAnimated],
  ["PageHeader", PageHeader],
  ["SecondaryNavigation", SecondaryNavigation],
  ["TopicListing", TopicListing],
  ["SiteMetadata", SiteMetadata],
  ["Icon", Icon],
  ["ImageBlock", ImageBlock],
  ["Video", Video],
  ["VerticalImageAccordion", VerticalImageAccordion],
]);

export default components;
