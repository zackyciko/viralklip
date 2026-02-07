# TypeScript Build Errors - KNOWN ISSUE

## Problem

The build currently fails with TypeScript errors like:
```
Property 'name' does not exist on type 'never'.
Argument of type 'any' is not assignable to parameter of type 'never'.
```

## Cause

These errors are caused by **placeholder database types** in `src/types/database.types.ts`.

## Solution

Generate real types from your Supabase schema:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.types.ts
```

Replace `YOUR_PROJECT_ID` with your actual Supabase project ID.

## Why This Happens

The application was built with placeholder types to allow development without a live Supabase instance. Once you run the migration and generate real types, all errors will be resolved.

## Temporary Workaround

If you need to build immediately, you can disable TypeScript checking:

```bash
# In next.config.ts, add:
typescript: {
  ignoreBuildErrors: true,
}
```

**Note:** This is NOT recommended for production. Always fix the types properly.

## Files Affected

- `src/app/api/payments/initiate/route.ts`
- `src/app/api/webhooks/midtrans/route.ts`
- `src/app/api/email/send/route.ts`
- `src/app/api/projects/route.ts`
- `src/app/api/clips/route.ts`
- `src/app/api/upload/route.ts`
- `src/app/api/analytics/route.ts`
- `src/app/api/user/route.ts`

All of these will work correctly at runtime - the errors are purely TypeScript compile-time issues.
