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

// Pregnancy & Women
import { breastfeedingLatch } from './pregnancy-women/breastfeeding-latch-issues';
import { postpartumRecovery } from './pregnancy-women/postpartum-recovery';
import { websterTechnique } from './pregnancy-women/webster-technique';

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

// General Wellness
import { allergiesRespiratory } from './general-wellness/allergies-respiratory';
import { digestiveGiIssues } from './general-wellness/digestive-gi-issues';
import { immuneSupport } from './general-wellness/immune-support';
import { anxietyStress } from './general-wellness/anxiety-stress';
import { chronicFatigue } from './general-wellness/chronic-fatigue';
import { fibromyalgia } from './general-wellness/fibromyalgia';
import { gentleChiropractic } from './general-wellness/gentle-chiropractic';

// Special Populations
import { seniorCare } from './special-populations/senior-care';
import { potsDysautonomia } from './special-populations/pots-dysautonomia';
import { sportsPerformance } from './special-populations/sports-performance';
import { lymeDisease } from './special-populations/lyme-disease';
import { scoliosis } from './special-populations/scoliosis';

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
  // Pregnancy & Women
  breastfeedingLatch,
  postpartumRecovery,
  websterTechnique,
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
  // General Wellness
  allergiesRespiratory,
  digestiveGiIssues,
  immuneSupport,
  anxietyStress,
  chronicFatigue,
  fibromyalgia,
  gentleChiropractic,
  // Special Populations
  seniorCare,
  potsDysautonomia,
  sportsPerformance,
  lymeDisease,
  scoliosis,
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

export { CATEGORY_ORDER, CATEGORY_LABELS };
export type { ConditionPageData, ConditionCategory };
