import Container from '@/components/container/Container.astro';
import RowSplitter from '@/components/row-splitter/RowSplitter.astro';
import ColumnSplitter from '@/components/column-splitter/ColumnSplitter.astro';
import Title from '@/components/title/Title.astro';
import RichText from '@/components/rich-text/RichText.astro';
import Image from '@/components/image/Image.astro';
import Promo from '@/components/promo/Promo.astro';
import Navigation from '@/components/navigation/Navigation.astro';
import LinkList from '@/components/link-list/LinkList.astro';
import PageContent from '@/components/page-content/PageContent.astro';
import ContentBlock from '@/components/content-block/ContentBlock.astro';
import PartialDesignDynamicPlaceholder from '@/components/partial-design-dynamic-placeholder/PartialDesignDynamicPlaceholder.astro';
import StructuredData from '@/components/structured-data/StructuredData.astro';

const components = new Map<string, any>([
  ['Container', Container],
  ['RowSplitter', RowSplitter],
  ['ColumnSplitter', ColumnSplitter],
  ['Title', Title],
  ['RichText', RichText],
  ['Image', Image],
  ['Promo', Promo],
  ['Navigation', Navigation],
  ['LinkList', LinkList],
  ['PageContent', PageContent],
  ['ContentBlock', ContentBlock],
  ['PartialDesignDynamicPlaceholder', PartialDesignDynamicPlaceholder],
  ['StructuredData', StructuredData],
]);

export default components;
