import type { ConditionPageData } from '../types';

export const earInfections: ConditionPageData = {
  slug: 'ear-infections',
  title: 'Ear Infections in Children',
  subtitle: 'A Natural Approach to Breaking the Cycle',
  category: 'pediatric',
  heroImage: '/images/hero/baby-1.webp',
  seo: {
    title: 'Ear Infections in Children | Chiropractic Care Rochester Hills, MI',
    description:
      'Drug-free chiropractic care for recurrent ear infections in children. Dr. Zach at Cultivate Wellness helps break the cycle with gentle, neurologically-focused adjustments.',
  },
  intro: [
    'Ear infections (otitis media) are one of the most common reasons children visit the doctor -- and one of the top reasons for antibiotic prescriptions. But what if there was a drug-free way to help your child break the cycle of recurrent ear infections? At Cultivate Wellness, we\'ve helped countless children find relief through gentle, neurologically-focused chiropractic care.',
    'Five out of six children will have at least one ear infection by age 3. Children are more prone because their Eustachian tubes are more horizontal, shorter, and narrower than adults\', making it harder for fluid to drain from the middle ear. When fluid can\'t drain properly, it creates a perfect environment for bacteria to grow -- leading to infection.',
  ],
  highlightBox: {
    icon: 'ear',
    label: 'The Spinal Connection',
    text: 'The upper cervical spine (neck) plays a crucial role in ear health. The nerves controlling the muscles of the Eustachian tube originate in the upper neck. When this area is misaligned, it can create the conditions that lead to recurrent ear infections -- regardless of how many rounds of antibiotics are prescribed.',
  },
  symptoms: {
    sectionTitle: 'How Spinal Misalignment Affects the Ears',
    items: [
      {
        icon: 'zap',
        title: 'Nerve Interference',
        description: 'The nerves controlling the muscles of the Eustachian tube originate in the upper neck. Misalignment disrupts their function.',
      },
      {
        icon: 'activity',
        title: 'Muscle Tension',
        description: 'Subluxations can cause tension in the muscles that open and close the Eustachian tube, preventing proper drainage.',
      },
      {
        icon: 'droplets',
        title: 'Lymphatic Drainage',
        description: 'Upper cervical misalignment can impede proper lymphatic drainage from the head and neck area.',
      },
      {
        icon: 'shield',
        title: 'Immune Function',
        description: 'Nervous system interference can affect overall immune response, making your child more susceptible to infections.',
      },
    ],
  },
  benefits: {
    sectionTitle: 'How Chiropractic Helps',
    items: [
      {
        icon: 'scan-line',
        title: 'Gentle Upper Cervical Assessment',
        description:
          'We carefully examine the upper neck area, looking for subluxations that may be contributing to your child\'s ear problems with a gentle, child-friendly examination.',
      },
      {
        icon: 'hand',
        title: 'Light-Touch Adjustments',
        description:
          'Using our gentle, neurologically-focused approach, we deliver incredibly gentle adjustments -- so gentle that babies often sleep through them. No cracking, popping, or discomfort.',
      },
      {
        icon: 'droplets',
        title: 'Support Proper Drainage',
        description:
          'By restoring proper alignment and nerve function, we help create conditions for the Eustachian tubes to function normally -- allowing fluid to drain as it should.',
      },
      {
        icon: 'target',
        title: 'Address the Root Cause',
        description:
          'Rather than treating each infection as it occurs, we address the underlying structural and neurological factors that make your child susceptible to recurrent infections.',
      },
    ],
  },
  approach: {
    sectionTitle: 'Our Approach to Ear Infections',
    description:
      'Dr. Zach takes a comprehensive approach to helping your child break free from the cycle of recurrent ear infections.',
    steps: [
      {
        title: 'Comprehensive Evaluation',
        description:
          'We take a thorough history of ear infections and treatments, followed by a gentle examination of the upper cervical spine and INSiGHT neurological scanning (if age-appropriate) to identify areas of nerve interference.',
      },
      {
        title: 'Gentle, Targeted Adjustments',
        description:
          'Using our gentle, neurologically-focused approach, we address upper cervical misalignments that may be affecting Eustachian tube function, lymphatic drainage, and overall immune response.',
      },
      {
        title: 'Ongoing Monitoring & Prevention',
        description:
          'We monitor your child\'s progress and provide a prevention-focused care plan. We also offer guidance on additional steps like proper feeding positions, good hand hygiene, and supporting overall immune function.',
      },
    ],
  },
  outcomes: {
    sectionTitle: 'What Parents Often Report',
    items: [
      'Fewer ear infections after starting care',
      'Infections resolve faster when they do occur',
      'Less need for antibiotics',
      'Avoiding ear tube surgery',
      'Better sleep and less fussiness',
      'Improved overall immune function',
      'Breaking the cycle of recurrent infections',
    ],
  },
  faqs: [
    {
      question: 'How does chiropractic help with ear infections?',
      answer:
        'The upper cervical spine (neck) directly affects the nerves and muscles controlling Eustachian tube function. When this area is properly aligned, fluid can drain from the middle ear as it should, reducing the conditions that lead to infection. We address the structural root cause rather than just treating symptoms.',
    },
    {
      question: 'Is this safe for young children?',
      answer:
        'Yes. Dr. Zach uses extremely gentle techniques adapted specifically for children. There is no cracking or forceful manipulation. The adjustments are so gentle that babies and toddlers often sleep through them or barely notice.',
    },
    {
      question: 'Should we stop antibiotics?',
      answer:
        'We are not anti-antibiotic -- sometimes they are necessary. Chiropractic care offers a complementary approach that can reduce the frequency and severity of infections, potentially reducing the need for antibiotics over time. Always consult your pediatrician regarding medication decisions.',
    },
    {
      question: 'Can chiropractic help my child avoid ear tubes?',
      answer:
        'Many parents have found that chiropractic care allowed their children to avoid or delay ear tube surgery. While tubes are sometimes necessary, it is worth trying a conservative approach first. Ear tubes don\'t address why infections keep occurring -- chiropractic care does.',
    },
    {
      question: 'When should I still see a pediatrician?',
      answer:
        'See your pediatrician if your child has a high fever (over 102 degrees F), severe pain, discharge from the ear, symptoms lasting more than 2-3 days, or signs of hearing loss. Chiropractic care is excellent for prevention and supporting overall ear health alongside medical care.',
    },
  ],
  relatedConditions: [
    { slug: 'infant-newborn-chiropractic', title: 'Infant & Newborn Chiropractic' },
    { slug: 'colic-infant-digestive', title: 'Colic & Infant Digestive Issues' },
    { slug: 'torticollis', title: 'Torticollis' },
    { slug: 'adhd-focus-issues', title: 'ADHD & Focus Issues' },
  ],
  cta: {
    title: 'Break the Ear Infection Cycle',
    description:
      'Discover how gentle chiropractic care can help your child find lasting relief from recurrent ear infections. Schedule a consultation with Dr. Zach today.',
    buttonText: 'Book Your Consultation',
  },
  schema: {
    condition: {
      name: 'Otitis Media',
      description:
        'Inflammation or infection of the middle ear, particularly common in children due to the anatomy of their Eustachian tubes.',
      wikipediaUrl: 'https://en.wikipedia.org/wiki/Otitis_media',
    },
    therapy: {
      name: 'Chiropractic Care',
      description:
        'Gentle upper cervical chiropractic adjustments aimed at restoring proper nerve function and Eustachian tube drainage to reduce the frequency of ear infections in children.',
    },
    datePublished: '2026-02-12',
    dateModified: '2026-02-12',
    wordCount: 1400,
  },
};
