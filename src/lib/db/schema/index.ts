/**
 * Aggregated schema barrel. `src/lib/db/index.ts` imports everything here so
 * Drizzle has the full model, and drizzle-kit reads this file for migrations.
 */
export * from './system'
export * from './enums'
export * from './identity'
export * from './content'
export * from './attempts'
export * from './billing'
export * from './interview'
export * from './gk'
