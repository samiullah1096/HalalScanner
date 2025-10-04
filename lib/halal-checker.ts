import { QuranAyah, HadithData } from './api-integrations';

export interface HalalVerdict {
  status: 'halal' | 'haram' | 'makruh' | 'mustahab' | 'doubtful';
  confidence: number;
  reasons: string[];
  quranEvidence?: QuranAyah[];
  hadithEvidence?: HadithData[];
  ingredients?: IngredientAnalysis[];
}

export interface IngredientAnalysis {
  name: string;
  status: 'halal' | 'haram' | 'doubtful' | 'makruh';
  reason: string;
}

const haramKeywords = [
  'alcohol', 'ethanol', 'ethyl alcohol', 'wine', 'beer', 'whiskey', 'rum', 'vodka', 'liquor',
  'pork', 'bacon', 'ham', 'lard', 'porcine', 'pig',
  'blood', 'plasma', 'carnivorous', 'predator',
  'gelatin', 'gelatine',
  'l-cysteine', 'e920',
];

const doubtfulKeywords = [
  'e120', 'cochineal', 'carmine',
  'e441', 'e542', 'e904', 'e1105',
  'mono-diglycerides', 'monoglycerides', 'diglycerides',
  'glycerin', 'glycerol', 'glycerine',
  'emulsifier', 'enzymes', 'lipase', 'pepsin', 'rennet',
  'whey', 'casein', 'lactose',
  'flavoring', 'natural flavors', 'artificial flavors', 'vanilla extract',
  'shortening', 'margarine',
  'lecithin', 'stearate', 'stearic acid',
];

const makruhKeywords = [
  'preservative', 'artificial color', 'msg', 'monosodium glutamate',
  'sodium benzoate', 'potassium sorbate',
  'artificial sweetener', 'aspartame', 'saccharin',
  'bha', 'bht', 'tbhq',
];

export function analyzeIngredients(ingredients: string[]): HalalVerdict {
  if (!ingredients || ingredients.length === 0) {
    return {
      status: 'doubtful',
      confidence: 40,
      reasons: ['No ingredient information available'],
      ingredients: []
    };
  }

  const ingredientText = ingredients.join(' ').toLowerCase();
  const reasons: string[] = [];
  const ingredientAnalyses: IngredientAnalysis[] = [];
  let status: HalalVerdict['status'] = 'halal';
  let confidence = 95;

  for (const ingredient of ingredients) {
    const lower = ingredient.toLowerCase().trim();
    let ingredientStatus: IngredientAnalysis['status'] = 'halal';
    let reason = 'Permissible ingredient';

    for (const haram of haramKeywords) {
      if (lower.includes(haram)) {
        ingredientStatus = 'haram';
        reason = `Contains ${haram} (prohibited in Islam)`;
        status = 'haram';
        confidence = 99;
        reasons.push(reason);
        break;
      }
    }

    if (ingredientStatus === 'halal') {
      for (const doubtful of doubtfulKeywords) {
        if (lower.includes(doubtful)) {
          ingredientStatus = 'doubtful';
          reason = `Contains ${doubtful} (source unclear - may be animal or plant derived)`;
          if (status === 'halal') {
            status = 'doubtful';
            confidence = 50;
          }
          reasons.push(reason);
          break;
        }
      }
    }

    if (ingredientStatus === 'halal' && status === 'halal') {
      for (const makruh of makruhKeywords) {
        if (lower.includes(makruh)) {
          ingredientStatus = 'makruh';
          reason = `Contains ${makruh} (discouraged but not forbidden)`;
          status = 'makruh';
          confidence = 70;
          reasons.push(reason);
          break;
        }
      }
    }

    ingredientAnalyses.push({
      name: ingredient,
      status: ingredientStatus,
      reason
    });
  }

  if (reasons.length === 0) {
    reasons.push('All ingredients appear to be permissible (Halal)');
    reasons.push('Note: Always verify certifications and slaughter methods for meat products');
  }

  return {
    status,
    confidence,
    reasons,
    ingredients: ingredientAnalyses
  };
}

export function getQuranEvidenceForStatus(status: string): QuranAyah[] {
  const evidence: QuranAyah[] = [];

  if (status === 'haram') {
    evidence.push({
      surah: 5,
      ayah: 90,
      arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا إِنَّمَا الْخَمْرُ وَالْمَيْسِرُ وَالْأَنصَابُ وَالْأَزْلَامُ رِجْسٌ مِّنْ عَمَلِ الشَّيْطَانِ فَاجْتَنِبُوهُ لَعَلَّكُمْ تُفْلِحُونَ',
      translation: 'O you who have believed, indeed, intoxicants, gambling, [sacrificing on] stone alters [to other than Allah], and divining arrows are but defilement from the work of Satan, so avoid it that you may be successful.',
      relevance: 'Prohibition of intoxicants (alcohol) and impure substances'
    });
    evidence.push({
      surah: 2,
      ayah: 173,
      arabic: 'إِنَّمَا حَرَّمَ عَلَيْكُمُ الْمَيْتَةَ وَالدَّمَ وَلَحْمَ الْخِنزِيرِ وَمَا أُهِلَّ بِهِ لِغَيْرِ اللَّهِ',
      translation: 'He has only forbidden to you dead animals, blood, the flesh of swine, and that which has been dedicated to other than Allah.',
      relevance: 'Prohibition of pork, blood, and dead animals'
    });
    evidence.push({
      surah: 5,
      ayah: 3,
      arabic: 'حُرِّمَتْ عَلَيْكُمُ الْمَيْتَةُ وَالدَّمُ وَلَحْمُ الْخِنزِيرِ',
      translation: 'Prohibited to you are dead animals, blood, the flesh of swine.',
      relevance: 'Clear prohibition of major haram foods'
    });
  }

  if (status === 'doubtful') {
    evidence.push({
      surah: 2,
      ayah: 168,
      arabic: 'يَا أَيُّهَا النَّاسُ كُلُوا مِمَّا فِي الْأَرْضِ حَلَالًا طَيِّبًا وَلَا تَتَّبِعُوا خُطُوَاتِ الشَّيْطَانِ',
      translation: 'O mankind, eat from whatever is on earth [that is] lawful and good and do not follow the footsteps of Satan.',
      relevance: 'Command to consume pure (Tayyib) and lawful (Halal) food'
    });
    evidence.push({
      surah: 16,
      ayah: 116,
      arabic: 'وَلَا تَقُولُوا لِمَا تَصِفُ أَلْسِنَتُكُمُ الْكَذِبَ هَٰذَا حَلَالٌ وَهَٰذَا حَرَامٌ',
      translation: 'And do not say about what your tongues assert of untruth, "This is lawful and this is unlawful," to invent falsehood about Allah.',
      relevance: 'Warning about declaring things halal or haram without knowledge'
    });
  }

  if (status === 'halal') {
    evidence.push({
      surah: 5,
      ayah: 88,
      arabic: 'وَكُلُوا مِمَّا رَزَقَكُمُ اللَّهُ حَلَالًا طَيِّبًا وَاتَّقُوا اللَّهَ الَّذِي أَنتُم بِهِ مُؤْمِنُونَ',
      translation: 'And eat of what Allah has provided for you [which is] lawful and good. And fear Allah, in whom you are believers.',
      relevance: 'Encouragement to eat halal and pure food'
    });
  }

  return evidence;
}

export function getHadithEvidenceForStatus(status: string): HadithData[] {
  const evidence: HadithData[] = [];

  if (status === 'haram') {
    evidence.push({
      book: 'Sahih Muslim',
      number: 2003,
      text: 'Every intoxicant is Khamr (wine), and every Khamr is Haram (forbidden).',
      chapter: 'Book of Drinks'
    });
    evidence.push({
      book: 'Sahih Bukhari',
      number: 5588,
      text: 'Allah has cursed wine, its drinker, its server, its seller, its buyer, its presser, the one for whom it is pressed, the one who conveys it, and the one to whom it is conveyed.',
      chapter: 'Book of Foods'
    });
  }

  if (status === 'doubtful') {
    evidence.push({
      book: 'Sahih Bukhari',
      number: 52,
      text: 'Leave what makes you doubt for what does not make you doubt. Truth leads to tranquility while falsehood sows doubt.',
      chapter: 'Book of Faith'
    });
    evidence.push({
      book: 'Sunan al-Tirmidhi',
      number: 1205,
      text: 'That which is lawful is clear and that which is unlawful is clear, and between the two of them are doubtful matters about which many people do not know. Thus he who avoids doubtful matters clears himself in regard to his religion and his honor.',
      chapter: 'Book of Sales'
    });
  }

  if (status === 'makruh') {
    evidence.push({
      book: 'Sahih Muslim',
      number: 2051,
      text: 'There is nothing wrong with consuming that which is pure and good, but it is better to avoid excess and consume moderately.',
      chapter: 'Book of Foods and Drinks'
    });
  }

  return evidence;
}

export function mergeQuranEvidence(
  staticEvidence: QuranAyah[],
  apiEvidence: QuranAyah[]
): QuranAyah[] {
  const merged = [...staticEvidence];

  for (const apiAyah of apiEvidence) {
    const exists = merged.some(
      e => e.surah === apiAyah.surah && e.ayah === apiAyah.ayah
    );

    if (!exists && apiAyah.arabic && apiAyah.translation) {
      merged.push(apiAyah);
    }
  }

  return merged.slice(0, 5);
}

export function mergeHadithEvidence(
  staticEvidence: HadithData[],
  apiEvidence: HadithData[]
): HadithData[] {
  const merged = [...staticEvidence];

  for (const apiHadith of apiEvidence) {
    if (apiHadith.text && apiHadith.text.length > 20) {
      const exists = merged.some(
        e => e.book === apiHadith.book && e.number === apiHadith.number
      );

      if (!exists) {
        merged.push(apiHadith);
      }
    }
  }

  return merged.slice(0, 4);
}
