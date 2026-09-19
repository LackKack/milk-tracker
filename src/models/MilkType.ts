export const MILK_TYPES = ['breast_milk', 'formula', 'cow_milk', 'other'] as const;

export type MilkType = (typeof MILK_TYPES)[number];

export const MILK_TYPE_LABELS: Record<MilkType, string> = {
  breast_milk: 'Breast milk',
  formula: 'Formula',
  cow_milk: 'Cow milk',
  other: 'Other',
};
