# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary user is a person buying a used laptop in person. They meet the seller, often
standing at a table, and run the inspection on the machine itself or on a phone next to
it. Their job is to decide whether to pay for the unit. They may be experienced enough to
recognize hardware names (SSD, TPM, BIOS) but not enough to remember every check under
time pressure. No account, no login, single user per device.

## Product Purpose

BenchCheck is a structured inspection checklist for second-hand laptops. It turns an
ad-hoc "looks fine, I'll take it" into an ordered set of verifiable checks so defects
surface before money changes hands. Success means the buyer leaves with enough evidence
to accept or reject the laptop with confidence, and misses nothing costly in the rush.

## Positioning

A buyer-side instrument, not a seller listing or a generic spec sheet. It is built around
the inspection moment: quick-pass ordering for when time is short, a full 65-item pass for
when it is not, and in-app display and keyboard tests that use the laptop being inspected
as the test rig. Works offline with no backend, so it runs in a shop with no reliable
network.

## Operating Context

The inspection happens at a physical meeting, seller present, time pressure real. The
user has the laptop powered on and can install or open vendor tools: HWiNFO, CrystalDiskInfo,
`powercfg /batteryreport`, Cinebench, Device Manager, BIOS. The Display test and Keyboard
test tabs are run on the machine under inspection. State is scoped to the device and mode
so a full pass and a quick pass do not overwrite each other.

## Capabilities and Constraints

Checklist content is 10 sections, 65 items, all authored in `src/data/checklist.ts`; one
item per section carries a `priority` (1-10) that defines the 30-45 minute quick-pass order.
Item status cycles pending -> pass -> fail -> pending. Failures are collected in a panel
with optional reasons. A grade seal grades the finished unit by fail count (A=0, B=1-2,
C=3-4, D=5-6, F=7+). State persists in localStorage per mode.

Technical constraints: client-only web app, no backend, no network dependency for core use.
React 19 + TypeScript strict + Vite + Tailwind v4, Bun as runtime. No router, no state
library, no motion library. Single page with tab switching. Content changes go in the data
file, not components.

## Brand Commitments

Name: BenchCheck. Repo and canonical link: https://github.com/Richie-Z/BenchCheck. Voice is
plain, technical, buyer-facing, never marketing. Visual identity is locked by AGENTS.md:
dark theme only, one amber accent (`signal`), emerald/red reserved for real pass/fail state,
Geist + Geist Mono typography, no emoji, no decorative flourishes. Favicon is the bare
LogoMark frame-break mark.

## Evidence on Hand

The 65 checklist items and their hints in `src/data/checklist.ts` are the real content and
name the tools used. Design rules, stack, structure, and verification recipe are in
`AGENTS.md`. No testimonials, benchmarks, pricing, or customer claims exist and none may be
fabricated.

## Product Principles

1. Buyer-side truth. Every check exists to protect the person paying, not the person selling.
2. Ordered under pressure. When time is short, the quick pass still covers the checks most
   likely to reveal a costly defect.
3. Evidence over vibes. A check passes on a named tool reading or a physical observation,
   not on a general impression.
4. Use the machine as the rig. The laptop under inspection runs the display and keyboard
   tests, so the app tests the actual unit.
5. Offline and disposable. No account, no server, no setup: it works in a shop and forgets
   the session when the user is done.

## Accessibility & Inclusion

Keyboard test uses real hardware key input. Global focus-visible ring, reduced-motion
handling, and a skip link are already in place. No product-specific accessibility standard
has been confirmed beyond this.
