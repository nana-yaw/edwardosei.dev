# Story Mode Graduation — End-of-Story UX

**Date:** 2026-02-27
**Status:** Approved

## Problem

When the user reaches the last Story scene (Contact, 6/6) and swipes left or taps "Next," nothing happens. The `goTo` clamps to the max index and bails. There's no feedback, no closure, and no exit path beyond the small "X" button.

## Design

**Concept:** Story mode is the trailer. Swiping past the last scene "graduates" the user into the full site with a cinematic fade-to-black transition.

### Trigger

One extra swipe-left or "Next" tap while on Contact (index 5, the last section). This intentional gesture prevents accidental exits.

### Transition Sequence (~700ms)

1. **Fade to black** (0–300ms): Full-screen overlay fades from `opacity: 0` to `1` (solid `#000`).
2. **Theme swap** (at 300ms, while screen is black): Restore previous theme, remove `data-story`, reset nav index to 0, scroll to page top.
3. **Fade from black** (300–650ms): Overlay fades from `opacity: 1` to `0`, revealing the full site.
4. **Cleanup** (at 700ms): Remove overlay from DOM.

### Previous Theme Memory

- When Story mode is entered, store the current theme in `previousThemeRef` inside `ThemeProvider`.
- On graduation, restore `previousThemeRef.current`. Default to `cinematic` if none stored.

### Backward Swipe on First Section

No action — only forward-graduation past the last scene. Backward exit would be unexpected and conflict with the "SWIPE >" hint.

### Accessibility

- `prefers-reduced-motion`: Skip the fade animation, do an instant theme swap.
- Overlay gets `aria-hidden="true"` and `role="presentation"`.

## Files Changed

| File | Change |
|------|--------|
| `src/hooks/useStoryHorizontalNav.ts` | Accept `onGraduate` callback; fire it when `goNext` at last index |
| `src/context/StoryNavContext.tsx` | Wire `onGraduate` from provider to hook; expose `isGraduating` |
| `src/components/StoryOverlay.tsx` | Render fade-to-black overlay when graduating |
| `src/components/ThemeProvider.tsx` | Store `previousThemeRef` on Story entry; expose restore function |
| `src/hooks/useTheme.ts` | Add `previousTheme` to context interface |
