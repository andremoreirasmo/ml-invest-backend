import { CompareHistory, CompareHistoryRelation, Stock } from '@prisma/client';

export type ComparisonDTO = CompareHistory & {
  CompareHistoryRelation: (CompareHistoryRelation & {
    stock: Stock;
  })[];
};
