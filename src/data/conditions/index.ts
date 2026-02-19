import type { ConditionPageData, ConditionCategory } from './types';
import { CATEGORY_ORDER, CATEGORY_LABELS } from './types';

// Pediatric
import { adhdFocusIssues } from './pediatric/adhd-focus-issues';
import { autismNeurodevelopmental } from './pediatric/autism-neurodevelopmental';
import { infantNewborn } from './pediatric/infant-newborn-chiropractic';
import { colicInfantDigestive } from './pediatric/colic-infant-digestive';
import { earInfections } from './pediatric/ear-infections';
import { bedwettingEnuresis } from './pediatric/bedwetting-enuresis';
import { torticollis } from './pediatric/torticollis';
import { sensoryProcessing } from './pediatric/sensory-processing-disorder';
import { plagiocephaly } from './pediatric/plagiocephaly';
import { tongueTieLipTie } from './pediatric/tongue-tie-lip-tie';
import { developmentalDelays } from './pediatric/developmental-delays';
import { speechLanguageDelays } from './pediatric/speech-language-delays';

// Pregnancy & Women
import { breastfeedingLatch } from './pregnancy-women/breastfeeding-latch-issues';
import { postpartumRecovery } from './pregnancy-women/postpartum-recovery';
import { websterTechnique } from './pregnancy-women/webster-technique';
import { pregnancyBackPain } from './pregnancy-women/pregnancy-back-pain';

// Neurological
import { pandasPans } from './neurological/pandas-pans';
import { seizureDisorders } from './neurological/seizure-disorders';
import { sleepDisorders } from './neurological/sleep-disorders';

// Adult Pain
import { backNeckPain } from './adult-pain/back-neck-pain';
import { headachesMigraines } from './adult-pain/headaches-migraines';
import { sciatica } from './adult-pain/sciatica';
import { carpalTunnel } from './adult-pain/carpal-tunnel';
import { tmjJawPain } from './adult-pain/tmj-jaw-pain';
import { postureTechNeck } from './adult-pain/posture-tech-neck';
import { vertigoDizziness } from './adult-pain/vertigo-dizziness';
import { whiplashAutoInjury } from './adult-pain/whiplash-auto-injury';
import { pinchedNerves } from './adult-pain/pinched-nerves';
import { discHerniationDegenerative } from './adult-pain/disc-herniation-degenerative';
import { spinalStenosis } from './adult-pain/spinal-stenosis';

// General Wellness
import { allergiesRespiratory } from './general-wellness/allergies-respiratory';
import { digestiveGiIssues } from './general-wellness/digestive-gi-issues';
import { immuneSupport } from './general-wellness/immune-support';
import { anxietyStress } from './general-wellness/anxiety-stress';
import { chronicFatigue } from './general-wellness/chronic-fatigue';
import { fibromyalgia } from './general-wellness/fibromyalgia';
import { gentleChiropractic } from './general-wellness/gentle-chiropractic';
import { asthma } from './general-wellness/asthma';
import { acidRefluxGerd } from './general-wellness/acid-reflux-gerd';
import { ibs } from './general-wellness/ibs';
import { arthritis } from './general-wellness/arthritis';

// Special Populations
import { seniorCare } from './special-populations/senior-care';
import { potsDysautonomia } from './special-populations/pots-dysautonomia';
import { sportsPerformance } from './special-populations/sports-performance';
import { lymeDisease } from './special-populations/lyme-disease';
import { scoliosis } from './special-populations/scoliosis';
import { concussionPostConcussion } from './special-populations/concussion-post-concussion';
import { longCovid } from './special-populations/long-covid';

const ALL_CONDITIONS: ConditionPageData[] = [
  // Pediatric
  adhdFocusIssues,
  autismNeurodevelopmental,
  infantNewborn,
  colicInfantDigestive,
  earInfections,
  bedwettingEnuresis,
  torticollis,
  sensoryProcessing,
  plagiocephaly,
  tongueTieLipTie,
  developmentalDelays,
  speechLanguageDelays,
  // Pregnancy & Women
  breastfeedingLatch,
  postpartumRecovery,
  websterTechnique,
  pregnancyBackPain,
  // Neurological
  pandasPans,
  seizureDisorders,
  sleepDisorders,
  // Adult Pain
  backNeckPain,
  headachesMigraines,
  sciatica,
  carpalTunnel,
  tmjJawPain,
  postureTechNeck,
  vertigoDizziness,
  whiplashAutoInjury,
  pinchedNerves,
  discHerniationDegenerative,
  spinalStenosis,
  // General Wellness
  allergiesRespiratory,
  digestiveGiIssues,
  immuneSupport,
  anxietyStress,
  chronicFatigue,
  fibromyalgia,
  gentleChiropractic,
  asthma,
  acidRefluxGerd,
  ibs,
  arthritis,
  // Special Populations
  seniorCare,
  potsDysautonomia,
  sportsPerformance,
  lymeDisease,
  scoliosis,
  concussionPostConcussion,
  longCovid,
];

export function getConditionBySlug(slug: string): ConditionPageData | undefined {
  return ALL_CONDITIONS.find((c) => c.slug === slug);
}

export function getAllConditions(): ConditionPageData[] {
  return ALL_CONDITIONS;
}

export function getConditionsByCategory(category: ConditionCategory): ConditionPageData[] {
  return ALL_CONDITIONS.filter((c) => c.category === category);
}

export function getGroupedConditions(): Array<{
  category: ConditionCategory;
  label: string;
  conditions: ConditionPageData[];
}> {
  return CATEGORY_ORDER
    .map((cat) => ({
      category: cat,
      label: CATEGORY_LABELS[cat],
      conditions: getConditionsByCategory(cat),
    }))
    .filter((g) => g.conditions.length > 0);
}

/**
 * Find a condition whose title matches the given text (case-insensitive).
 * Returns the slug if found, null otherwise.
 * Checks exact match first, then substring containment in both directions.
 */
export function findConditionSlugByTitle(text: string): string | null {
  const normalized = text.toLowerCase().trim();

  // Exact match
  for (const c of ALL_CONDITIONS) {
    if (c.title.toLowerCase() === normalized) return c.slug;
  }

  // Substring: condition title contained in text, or text contained in condition title
  for (const c of ALL_CONDITIONS) {
    const condTitle = c.title.toLowerCase();
    if (normalized.length >= 4 && condTitle.includes(normalized)) return c.slug;
    if (condTitle.length >= 4 && normalized.includes(condTitle)) return c.slug;
  }

  return null;
}

export { CATEGORY_ORDER, CATEGORY_LABELS };
export type { ConditionPageData, ConditionCategory };
