export type ConditionCategory =
  | 'pediatric'
  | 'pregnancy-women'
  | 'neurological'
  | 'adult-pain'
  | 'general-wellness'
  | 'special-populations';

export interface ConditionPageData {
  slug: string;
  title: string;
  subtitle: string;
  category: ConditionCategory;
  heroImage?: string; // defaults to /images/hero-family.webp
  seo: {
    title: string;
    description: string;
  };
  intro: string[];
  highlightBox?: {
    icon?: string;
    label: string;
    text: string;
  };
  symptoms?: {
    sectionTitle: string;
    items: Array<{
      icon?: string;
      title: string;
      description: string;
    }>;
  };
  benefits?: {
    sectionTitle: string;
    items: Array<{
      icon?: string;
      title: string;
      description: string;
    }>;
  };
  approach?: {
    sectionTitle: string;
    description?: string;
    steps: Array<{
      title: string;
      description: string;
    }>;
  };
  outcomes?: {
    sectionTitle: string;
    items: string[];
  };
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  relatedConditions?: Array<{
    slug: string;
    title: string;
  }>;
  cta?: {
    title: string;
    description: string;
    buttonText: string;
  };
  schema?: {
    condition?: {
      name: string;
      description?: string;
      wikipediaUrl?: string;
    };
    therapy?: {
      name: string;
      description: string;
    };
    datePublished?: string;
    dateModified?: string;
    wordCount?: number;
  };
}

export const CATEGORY_LABELS: Record<ConditionCategory, string> = {
  'pediatric': 'Pediatric',
  'pregnancy-women': 'Pregnancy & Women',
  'neurological': 'Neurological',
  'adult-pain': 'Adult Pain',
  'general-wellness': 'General Wellness',
  'special-populations': 'Special Populations',
};

export const CATEGORY_ORDER: ConditionCategory[] = [
  'pediatric',
  'pregnancy-women',
  'neurological',
  'adult-pain',
  'general-wellness',
  'special-populations',
];
