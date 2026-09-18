# Frontend Security Follow-ups — PR #20 Review

Open items from the review of `security/frontend-hardening` (PR #20).
Deliberately left out of the PR to keep it shippable — address when next
touching the listed files. (Resolved: Cloudinary folder-public-ID slash
encoding, fixed in `src/components/CloudinaryImage.tsx`.)

## 1. `describeMemberError` regex bypasses friendly-error policy (low)

File: `src/pages/Dashboard.tsx` (`describeMemberError`)

```ts
if (err instanceof Error && /avatar|image|large|size/i.test(err.message)) {
  return err.message.slice(0, 300);
}
```

Any backend 5xx whose text happens to contain "image"/"size" is rendered
verbatim, leaking internals the `toFriendlyErrorMessage` mapping was built
to hide. Narrow this branch to client-side validation messages only, or
drop it and keep the 400-only carve-out.

## 2. `compilePattern` heuristic rejects valid patterns (low)

File: `src/features/forms/components/DynamicForm.tsx` (`compilePattern`)

The nested-quantifier check rejects legitimate patterns with quantifier
chars inside character classes (e.g. `^[0-9+*-]+$`), showing users
"Invalid field configuration". Fail-closed is the right default, but if
CMS authors hit this, exempt `[...]` spans from the check. The real
enforcement stays backend-side (see `BACKEND-SECURITY-HANDOFF.md` §7).

## 3. Dead code: `toSafeSlugPath` (nit)

File: `src/lib/safeUrl.ts`

Exported but never used — `CardEvent`/`EventDetails` hand-roll
`isSafeSlug` + `encodeURIComponent`. Use it at those call sites or delete
it.

## 4. Non-English word in handoff doc (nit)

File: `BACKEND-SECURITY-HANDOFF.md` (§1): "прямой `curl` today bypasses…"
should read "direct `curl` …".

## 5. Silent file reject in member modal (nit)

File: `src/features/board/components/MemberFormModal.tsx`
(`handleFileChange`)

Invalid files call `onFileChange(null)` with no user feedback; the error
message only appears because `Dashboard.tsx` re-validates in its own
`handleFileChange`. Works today, fragile if the modal is reused elsewhere
— surface the error inside the modal instead.
