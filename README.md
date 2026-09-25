# UTZLINE Delivery ITP — installable app

**Current version: v12** (its own independent version line, separate from
Site Measure/Viewer's, Install ITP's, and Manufacture ITP's — bump this
line every time a new build ships. This line has drifted behind the actual
shipped cache version twice before today — see the v4 and "v2" entries
below for what each catch-up covers; `next-version-notes.md` in the project
is the authoritative record for anything not detailed here.)

**v12 (2026-09-25):** autosave removed. Andrew, right after the v11 crash fix above, in response to the "residual issue" flagged in that same entry (every autosave rewriting the entire checklist file including all attached photos' base64 data every ~900ms while editing): "ok, stop the auto save. we can reimplement it later, just make sure we save on exit with a button." `markDirty()` no longer schedules `flushPendingSave()` on a 900ms debounce timer at all — it now only sets the `dirty` flag. Nothing else changed: the explicit **Save** button (`#saveChecklistBtn`) already called `flushPendingSave()` directly; the "Save changes before leaving?" dialog (Save & leave / Leave without saving / Cancel) already guarded every in-app navigation away from an unsaved checklist; and the `beforeunload` handler already made a best-effort save on tab close/reload — all three already fully satisfied "save on exit with a button," so the fix was removing the timer, not building new save paths. `flushPendingSave()` itself is unchanged. **Tradeoff, accepted deliberately and explicitly by Andrew as reversible ("we can reimplement it later"):** an edit made between saves is now lost if the app is killed or crashes before the user hits Save, leaves the checklist, or closes the tab — there is no longer a background timer catching it within ~900ms the way there was before. Every test across the ITP family that relied on waiting past the old debounce (`run_delivery_itp_auto_export_on_signoff.js` and its Install/Manufacture ITP siblings, `run_manufacture_itp_machined_gate.js`, `run_manufacture_itp_status_signoff.js`, `run_delivery_signoff.js`) now clicks the Save button explicitly instead; full family-wide suite re-run clean, zero regressions. Same change, same day, in Manufacture ITP (v14) and Install ITP (v25). `service-worker.js` cache bumped to `utzline-delivery-itp-cache-v12`.

**v11 (2026-09-25):** crash fix — "Add photo" no longer hands off to the OS's own camera app. Andrew, right after v10 shipped: "still very slow / unusable and crashed when taking a photo, you fixed this in the site measure app." Root cause, confirmed against Site Measure's own v37 fix (2026-09-19) for the identical symptom: `photoFileInput`'s `capture="environment"` attribute launched Android's native Camera app as a separate foreground activity, backgrounding this tab — and on a memory-constrained onsite tablet, Android can and does simply kill that backgrounded tab outright. When the camera hands control back, Android does a full fresh page load rather than resuming this tab's JS state, and the File System Access folder permission this app needs to keep saving is NOT persisted across a reload like that on Android — so the app lands back on "choose your Projects folder" mid-checklist, which is exactly what reads as a crash. No amount of autosave engineering can fix that from this side. Ported Site Measure's real fix verbatim: "Add photo" now opens a small chooser first — "Take photo" runs a genuine in-page camera capture (getUserMedia + a live `<video>` + a canvas snapshot) that never leaves this tab at all, so there's nothing for Android to background or kill; "Choose file" still opens the plain OS picker, now without the forced `capture=` attribute, for an existing photo from the gallery. Every photo, from either source, still goes through the same downscale-to-JPEG pipeline as before. Same fix, same day, in Manufacture ITP (v13) and Install ITP (v24) — Install ITP's rework tracker has its own separate "Add photo" button and shares the identical fix.

On the "still very slow" half of the same report: the v10 fix (only exporting the PDF on the transition into "Signed off") is real and still correct, but two things are worth flagging in case slowness persists after this update reaches a device: (1) a PWA update like this one only takes effect once the app is fully closed and reopened (or its cache cleared) — a tab left open from before today keeps running the old, slower code; (2) every autosave, even a plain text edit, still rewrites the ENTIRE checklist file including every attached photo's base64 data (already downscaled to 1600px/JPEG q0.82, so bounded, but an item with several photos still means a real multi-hundred-KB-to-low-MB rewrite every ~900ms while actively editing). That second one was flagged and deliberately deferred in v10 as "not the cause of the reported slowness" — worth revisiting if the crash fix alone doesn't resolve it, since it's a bigger, more invasive change (splitting photos out of the checklist's own JSON) than either fix shipped today.

**v10 (2026-09-25):** performance fix — auto-export the PDF only on the transition into "Signed off," not on every later edit. Andrew: "app is really slow on mobile onsite even working from local folder on device." Investigated this app first (as asked) and found the direct cause: yesterday's v9 auto-export feature (below) re-ran `exportChecklistPdf()` — the full, synchronous, main-thread jsPDF pipeline, re-embedding every photo already attached to the item — on every single 900ms autosave for as long as the checklist stayed signed off, so any post-signoff tweak (fixing a typo in a comment, adding one more photo) froze the UI while it rebuilt. Same pattern was live in Install ITP and Manufacture ITP too (both added the identical feature the same day), so all three got the same fix.

`flushPendingSave()` now tracks a new `state.wasSignedOffLastSave` flag (initialized in `openItem()` from the checklist's own on-disk signed-off state) and only calls `exportChecklistPdf()` when the checklist's signed-off status flips from false to true on this save — a first-time sign-off, or a re-sign-off after being knocked out of it by a "No" answer and fixed again. An edit made while it was *already* signed off no longer triggers a re-export at all; "Export PDF" still refreshes it on demand, exactly as always. `run_delivery_itp_auto_export_on_signoff.js` extended with a new step confirming an incidental Notes edit while still signed off produces no additional PDF, alongside the existing signed-off/re-signed-off transition coverage. Full suite re-run clean. `service-worker.js` cache bumped to `utzline-delivery-itp-cache-v10`.

**v9 (2026-09-24):** auto-export the ITP PDF on sign-off — same feature as Install ITP's own v21 and Manufacture ITP's own v11 (part of Andrew's Joinery Item page overhaul: "once an itp is saved / completed, it automatically exports the pdf... you can then click on each relative itp here to open it," confirmed to fire "only when it reaches Signed off," not on every save). `flushPendingSave()` now checks the just-saved checklist with a new `isChecklistSignedOff(data)` helper (both `driver`/`supervisor` signatures present, no row flagged "No") right after its existing `syncJoineryStatusFromChecklist` call, and when true, calls the same `exportChecklistPdf()` the manual "Export PDF" button already uses, into the same flat `PDF Files/UTZLINE ITP/Delivery ITP/` folder/filename convention. A later edit made while still signed off re-exports a fresh, separately-named PDF rather than overwriting the first. Chained off `flushPendingSave()`'s own promise, not fire-and-forget, for the same state-safety reason as its siblings (`state.currentData`/`state.currentFileHandle` only ever reassign from inside `openItem()`, which itself starts with `flushPendingSave().then(...)`). Unlike Manufacture ITP, this app has no precondition gate on sign-off, so no fixture seeding was needed. New regression test `run_delivery_itp_auto_export_on_signoff.js` (`pdftest-projects/`) covers the same five steps as its siblings' equivalent tests. `service-worker.js` cache bumped to `utzline-delivery-itp-cache-v9`. Full suite re-run clean.

**v8 (2026-09-24):** joinery-status.json v2 — Andrew, verbatim, on the coming scale: "we will have 30 people using this app in different stages, all coming back to the same database... needs to be foolproof and nevel lose data. some of this will be done via dropbox upload after the fact." The shared `joinery-status.json` used to be one JSON array file, rewritten whole on every save — risky with up to 15 people across five apps, some syncing in late via Dropbox. Replaced with one small immutable event file per status change, filed under `Project Saves/Joinery Status/<Level> - <Room> - <Code>/` — two writers can never collide, and a late Dropbox sync can never overwrite a newer save regardless of arrival order. The old file is migrated automatically and losslessly (once, idempotently) the first time any app in the family opens a project after this update, and left in place afterward, untouched. This app is still a read-only consumer of `machined`/`manufactured` and still only ever writes `delivered` — the exact same shape as before, just folded from events instead of read off a shared array. `service-worker.js` cache bumped to `utzline-delivery-itp-cache-v8`.

**v7 (2026-09-23):** Andrew, verbatim: "Manufacture status needs to be split up into 2 parts. We need a machined and a manufactured tab. All traceable by user name. Machined to have its own app. Called machine schedule. This is where the machinist can mark off a joinery item as complete. It will add their name and date time to the system." This app now recognises a new **"machined"** stage (rank 3, between `in_manufacture` and `manufactured`) on the shared `joinery-status.json` record, set by the brand-new sibling app **UTZLINE Machine Schedule** when the machinist marks a joinery item complete (their own name + date/time, via the same shared identity system this app already uses). Delivery ITP itself is a read-only consumer of `machined`/`manufactured` and still only ever writes `delivered` here (unchanged) — `joineryStatusRank`/`joineryStatusIcon`/`joineryDisplayIcon` were renumbered so manufactured/delivered/installed each shift up one rank (4/5/6, was 3/4/5) to make room. No data migration, no other app-visible change. `service-worker.js` cache bumped to `utzline-delivery-itp-cache-v7`.

**v6 (2026-09-23):** Andrew, verbatim, on the exported PDF's photos/pin drops/snapshots: "change it from a3 to a4 portrait. All collated nicely per page. All to be date and time stamped with users name also." The trailing photo pages (previously one or more A3 landscape pages, 3 columns × 2 rows) are now **A4 portrait**, 2 columns × 3 rows — same 6-per-page count, reflowed for the narrower shape, matching this document's own page size for the first time. Each photo now shows a **date/time + uploader-name caption** underneath it, from a new `addedBy` field stamped onto the photo record the moment it's added, alongside its existing `addedAt`. The **DELIVERY LOCATION** pin-drop snapshot added in v5 (below) gets the same treatment: `locationSnapshot` now also carries `capturedBy`, and its PDF caption gains a date/time + name line above the existing "Pin dropped on the level plan at delivery..." description. A photo or snapshot saved before this release has no addedBy/capturedBy and simply shows its date/time alone, never a blank or "undefined" name. `service-worker.js` cache bumped to `utzline-delivery-itp-cache-v6`. Full 5-file suite re-run clean (the pre-existing `run_delivery_location_pdf_export.js` — which spies on `addImage`, not page format — is unaffected and still passes).

**v5 (2026-09-23):** Andrew, verbatim: "delivery itps exports to show the
snapshot location of the pindrops." The in-app checklist screen has shown
the delivery-location-pin snapshot since the pin-drop feature shipped (see
"v2" below), but the exported PDF never included it — `exportChecklistPdf()`
now draws a new "DELIVERY LOCATION" section (the same square snapshot image,
with a short caption) right after the notes section and before sign-off,
**skipped entirely** (no empty placeholder box) for an item with no pin ever
dropped. New regression test `run_delivery_location_pdf_export.js` spies on
`jsPDF.API.addImage` (this app has no existing PDF-content-parsing
convention to build on) to confirm the snapshot image is genuinely drawn for
an item with a pin, and that nothing location-shaped is drawn for one
without. Full suite re-run: 5/5 passing. Cache bumped to
`utzline-delivery-itp-cache-v5`.

**v4 (2026-09-23, drift catch-up):** the family-wide shared name+PIN
numberpad identity rework — see `next-version-notes.md`'s "shared name+PIN
identity rolled out family-wide" entry — was built and tested IN this app
first, as the reference implementation the rest of the family's own rollout
copies verbatim, bumping `service-worker.js`'s cache to
`utzline-delivery-itp-cache-v4`. That work was never given its own entry or
version bump in this README at the time (the focus then was documenting the
rollout to the other six apps) — caught up here now, no code changed by this
catch-up itself.

**"v2" (2026-09-23; actually shipped as cache v3 — the README's own version
line was already one release behind by this point, never bumped past v2):**
"Add location snapshot" replaced with an interactive **"Add location pin"**
pin-drop workflow — tap the plan to place/move a draft pin, then Confirm to
capture the snapshot centred on it and save both
`data.deliveryLocationPin = {x,y}` and `data.locationSnapshot` together
(Cancel discards the draft, nothing saved). The thumbnail/"View on map"
now centers on that pin; the existing "View on plan" (the item's own
original marker) is unchanged. This pin is now also read (read-only) by
Install ITP as a new, toggleable "Delivery locations" reference layer —
see Install ITP's own changelog. `service-worker.js` cache bumped to
`utzline-delivery-itp-cache-v3`.

**v1 (2026-09-23):** first release. Forked directly from the Install ITP
codebase.

This folder is the self-contained, installable **UTZLINE Delivery ITP**
app — a sixth app in the same family as **UTZLINE Site Measure** (the
editor), **UTZLINE Viewer** (the read-only browser), **UTZLINE ITP**
(now specifically the **Install ITP** app), **UTZLINE Manufacture ITP**
(the factory/pre-dispatch stage), and **UTZLINE Projects**. This one is
the **delivery/receiving** stage: the checklist an item goes through when
it arrives on site, before it's unpacked and stored ready for install.

Per UTZLINE Data Standard v1, each stage of a joinery item's life —
manufacture, delivery, install — is its own separate installable app, not
one app with several modes: they're filled in by different people, at
different points, often on different devices, so separate installs
(separate icons, separate home-screen tiles) match how they're actually
used.

**Forked directly from the Install ITP codebase**, not built from
scratch: same `index.html`-as-the-whole-app structure, same
`manifest.json`/`service-worker.js` installability pattern, same
Projects-folder browsing, same shared device-identity mechanism, and the
same signature-pad/PDF-export machinery. What's different is the
checklist content itself (see "The checklist items" below), the two
sign-off roles ("Delivery Driver / Transport Rep." and "Metro Site
Supervisor (Receiving)" in place of "Subcontractor Rep. (Joinery
Installer)" and "Metro Site Supervisor"), the accent colour (amber/gold,
to tell it apart from Install ITP's green, Manufacture ITP's purple, Site
Measure/Viewer's orange-red, UTZLINE Projects' crimson, and Scheduler's
blue), its own project-wide data folder kept fully separate from its
siblings', and — new with this app — a shared name+PIN identity registry
(see its own section below).

It reads the **same Projects folder** every other app in the family
uses — the same project → level → room folder structure — so nothing
about how a project is organised has to change to start using it. It
never touches a room's own `saves`/`pdfs`/`backup` content; it only reads
a project's `project-meta.json` (written by Site Measure's own "Project
Info" screen, if filled in) to auto-fill the title block, and it keeps
its own checklist data in a project-wide **`itp-delivery`** folder it
creates alongside the level folders — a sibling of, and never colliding
with, Install ITP's `itp-install` or Manufacture ITP's `itp-manufacture`
folders (see "Where things are saved" below).

## What it does

1. Choose the Projects folder (same one as the other apps) — the folder
   handle is remembered, same reconnect-after-permission-reset flow as
   the others.
2. Browse Project → Level → Room, same navigation as the rest of the
   family.
3. Inside a room, see a simple list of joinery items that already have a
   delivery checklist started, or start a new one by typing its joinery
   number ("+ New Joinery Item" — hidden for a project created in
   UTZLINE Projects v9+, where only that app creates joinery items).
4. Fill in the checklist: the title block (Project No./Name/Head
   Contractor/Level/Area-Room/Joinery No.) auto-fills itself; the
   delivery/receiving quality checks are Yes/No/N/A with a comment field
   each; there's a free-text Notes/Comments/Missing Parts box; and two
   sign-off blocks ("Delivery Driver / Transport Rep." and "Metro Site
   Supervisor (Receiving)") each with a Name field, a Date field that
   fills itself in with today's date the moment a name is typed (but
   never overwrites a date you've already changed), and a signature pad
   you sign with a finger or stylus.
5. It autosaves a few seconds after any change, and there's an explicit
   Save button too.
6. A row marked "No" blocks sign-off from ever counting as complete or
   signed, even if both signature fields are filled in — the same
   "No"-gating rule as Install ITP and Manufacture ITP.
7. "Export PDF" renders the whole checklist — including both
   signatures and any attached photos — to a PDF and saves it straight
   into the project's `itp-delivery` folder. Exporting again later adds
   a new timestamped PDF rather than overwriting the last one, so a
   history of exports for the same item is kept.
8. On a completed sign-off (both signatures present, no row flagged
   "No"), the shared `joinery-status.json` record for that item is
   advanced forward to `"delivered"` (🚚) — the same forward-only status
   pipeline Install ITP (→ `"installed"` 🏆) and Manufacture ITP (→
   `"manufactured"` 📦, and `"in_manufacture"` 🏭 on open) already write
   into. Unlike Manufacture ITP, this app has **no interim/on-open
   status write** — only a completed sign-off ever changes the status,
   matching Install ITP's simpler single-stage pattern.
9. A "Location" section on the checklist lets you jump to, or snapshot,
   where the item was marked on its level's plan — see "Location: view on
   plan / snapshot" below.

## The checklist items — FIRST DRAFT, please review

Andrew hasn't specified Delivery ITP's own exact checklist wording yet.
`CHECK_ITEMS` in `index.html` currently ships with five placeholder rows:

1. Item(s) received match the work order # and description on the
   joinery register
2. Correct quantity received
3. No visible transport damage to packaging or item(s) on arrival
4. Delivery docket / consignment note received and matches the order
5. Item(s) unloaded and stored in the correct location on site

This is a **plain JS array**, editable by hand at any time — exactly the
same way Install ITP's and Manufacture ITP's own item lists are — no
template file or build step to run afterward. Treat this list as a
starting point to review and adjust, not a finished spec.

## Location: view on plan / delivery-location pin — new, DELIVERY ITP ONLY

Andrew asked (round 1): *"give an option to show on map where the joinery
was placed. this can also se snapshot and added to the itp page and also
readable on the map (click on a button and it takes you to the
location)."* Then (round 2, same day): *"the delivery itp add location on
plan, needs you to be able to set the location after pressing the button.
not just take a snapshot of the current plan. idea is press add location
pin button, then you can drop the pin anywhere on that levels floor plan
on confirm. thats when it takes the snapshot. this is then to be viewable
by the install itp software as a seperate selectable layer."*

A "Location" section sits on the checklist screen, between Photos and the
final Save/Export row, with **two independent reference points**:

- **"View on plan"** — jumps straight to that item's own Level Plan
  screen, panned/zoomed so that item's own ORIGINAL marker (the one Site
  Measure/UTZLINE Projects placed when the item was located) sits centred
  in the viewport (roughly a 500-plan-unit-wide close-up, clamped to the
  same min/max zoom the plan viewer always uses). Unchanged since round 1
  — this answers "where was it supposed to go".
- **"Add location pin"** (relabels itself **"Retake location pin"** once
  one exists) — answers a different question, "where was it actually
  dropped off/found on site". Pressing it opens the Level Plan screen in
  an interactive **pin-placement mode**: pan/pinch/zoom keep working
  exactly as normal, and a plain tap/click on the plan drops a bold amber
  draft pin at that point (tapping elsewhere just moves it — never a
  second pin). A retake pre-shows the existing pin so you can see where it
  currently is before moving it. A small bottom bar offers **Confirm
  location** / **Cancel**:
  - **Confirm** — captures the same kind of centred-on-point snapshot
    round 1 always has, now pointed at the just-placed pin instead of the
    item's own marker, and saves BOTH the pin's own world coordinates
    (`data.deliveryLocationPin = { x, y }`, new in round 2) and the
    snapshot (`data.locationSnapshot = { dataUrl, w, h, capturedAt }`,
    same shape as round 1) to the checklist's own JSON in one write, then
    returns to the checklist. Confirm is disabled until a pin has actually
    been placed.
  - **Cancel** — discards the draft pin and returns to the checklist with
    nothing changed; if a pin already existed, it's untouched.
  - Both `deliveryLocationPin` and `locationSnapshot` are **single current
    values, not a gallery** — unlike `photos`, there's no array and no
    per-item delete; retaking just replaces both together.
- The saved snapshot shows as a small **thumbnail** next to those two
  buttons, with its own **"View on map"** button beside it. Both the
  thumbnail and that button now jump to the confirmed **pin**
  (`deliveryLocationPin`), since that's what the snapshot actually
  represents — a separate destination from "View on plan" above.
- **"Add location pin"** only needs the LEVEL to have a plan at all (you
  can drop a pin anywhere on it, including somewhere with no existing
  joinery marker); "View on plan" specifically needs THIS item's own
  marker to exist. Either one shows a toast and does nothing else when its
  own requirement isn't met — no crash, no blank screen.

**Cross-app layer (round 2):** Install ITP reads `deliveryLocationPin` for
every joinery item on the current level (read-only — it never writes to
Delivery ITP's own checklist folder) and can render them as an inert,
non-interactive **"Delivery locations"** reference layer on its own Level
Plan screen, toggled from a small new "Layers" control there. See Install
ITP's own README for that side of it.

**Design note for Andrew/the team to weigh in on:** the snapshot is drawn
directly onto a plain `<canvas>` from the plan's own image + pin data,
rather than cloning and rasterizing the live on-screen plan view the way
UTZLINE Projects' own project-snapshot feature does (see
`renderViewSnapshotBlob` in that app's `source.html`). That app's plan
view can contain arbitrary vector content (dimensions, callouts, freehand
lines, text), which is why it needs to clone the actual live SVG. This
app's plan view only ever shows a base image plus plain circular markers,
so drawing those two things straight onto a canvas is simpler and doesn't
touch or depend on the live Level Plan screen's own DOM/state. If a
future version of this app's plan viewer grows richer vector content,
this would need to move to the clone-and-rasterize approach instead.

## The name+PIN identity registry — new, DELIVERY ITP ONLY for now

Built here first, per Andrew's own instruction to test it on Delivery ITP
before it's considered for any sibling app. It replaces the old bare-text
"Set your name" prompt with a dropdown of names already known on this
Projects folder, plus a PIN check — or a form to add a brand new
name+PIN with a "show me in" app-tickbox row.

**File:** `<Projects folder>/utzline-users.csv` — a single shared file at
the **Projects-root** level (a sibling of `company-logo.png` and every
individual Project folder), so one registry covers the whole company
regardless of which job someone's currently in.

**Format:** plain CSV, header row `Name,PIN,ShowInApps`, one row per
person:

```
Name,PIN,ShowInApps
Andrew Utz,4821,SiteMeasure;Viewer;InstallITP;ManufactureITP;DeliveryITP;Projects;Scheduler
Sam Carter,7710,DeliveryITP
```

- `Name` — stored exactly as typed; matched case-insensitively and
  trimmed for lookups (so "sam carter" and "Sam Carter " find the same
  row).
- `PIN` — stored in **plain text**. This is deliberate: Andrew explicitly
  wants this file to be a plain, spreadsheet-openable,
  file-manager-editable registry he can inspect and hand-edit directly.
  **This is a reference-only attribution registry, not a real
  access-control or security system** — anyone with access to the
  Projects folder can open the CSV in a text editor or spreadsheet app
  and read every PIN in plain text. Don't rely on it to keep anyone out
  of anything; it only exists so a completed checklist can be attributed
  to a real person with a small amount of friction (typing a known PIN)
  rather than anyone being able to type any name.
- `ShowInApps` — a semicolon-separated list of app codes from the fixed
  set `SiteMeasure;Viewer;InstallITP;ManufactureITP;DeliveryITP;
  Projects;Scheduler`. Purely a reference/directory field for Andrew's
  own admin use (which apps he intends that person to use) — **it does
  not gate or restrict anything in code**, it's just recorded.

**In the app:** tapping "Set your name" on the Projects screen opens a
dropdown of every name currently in the CSV (sorted alphabetically,
case-insensitively), plus a final "+ Add a new name…" option.

- Picking an **existing name** asks for that person's PIN. The CSV is
  re-read fresh every time (never a stale in-memory copy, since another
  device or app could have changed it since this page loaded); a correct
  PIN sets this device's identity exactly the way the old "Set your
  name" prompt used to (same shared `utzline-identity` IndexedDB key
  every app already reads), an incorrect PIN shows a toast and leaves
  the modal open to retry.
- Picking **"+ Add a new name…"** asks for a name, a PIN, and which apps
  to list them under ("Delivery ITP" is pre-checked, since that's the
  app they're setting this up from). One PIN per name is enforced here —
  trying to add a name that already exists (case-insensitively) is
  rejected with a toast telling you to pick it from the dropdown
  instead, never silently creating a duplicate row.

### Lost a PIN?

**There is no in-app "forgot PIN" flow — this is deliberate.** Per
Andrew's own framing, this is meant to be "a deletable file from the
folder system if the pin gets lost but doesn't erase any data." Recovery
is entirely file-manager-based:

1. Open `utzline-users.csv` (in the Projects folder root) in any text
   editor or spreadsheet app (Excel, Google Sheets, Notepad, etc.).
2. To reset someone's PIN, find their row and edit or clear the `PIN`
   cell, then save the file as plain CSV.
3. To free up a name entirely (so it can be re-added fresh with a new
   PIN), delete that person's whole row.

Nothing else in the Projects folder is touched by either action — no
project data, no checklist, no joinery status is affected either way.

## Where things are saved

**LEGACY (folder-based) project:**

```
<Projects folder>/
  utzline-users.csv          <- shared name+PIN identity registry (see above), Projects-root level
  <Project>/
    project-meta.json        <- written by Site Measure, read-only here
    <Level>/...               <- Site Measure's own level folders
    itp-install/              <- Install ITP's own folder (untouched by this app)
    itp-manufacture/          <- Manufacture ITP's own folder (untouched by this app)
    itp-delivery/             <- this app's own folder, project-wide
      <Level>/
        <Room>/
          <joinery-no>.json            <- this item's saved checklist state
          <joinery-no>_<timestamp>.pdf <- one file per export, never overwritten
```

The `itp-delivery` folder sits directly under the **project's** own
folder, as a sibling of the level folders and of its sibling apps' own
folders — not nested inside any one level — so every joinery item across
the whole project ends up under one place, itself organised by level and
room to mirror the plan. This app is brand new, so unlike Install ITP's
own `itp`→`itp-install` rename, there is no old name and no migration
step here — `itp-delivery` is the only name this app has ever used. Site
Measure/Viewer's own level list, UTZLINE Projects' own level list,
Install ITP's own level list, and Manufacture ITP's own level list all
know to skip folders literally named `itp`, `itp-install`,
`itp-manufacture`, or `itp-delivery` so none of them ever shows up
mislabeled as if it were a level.

**FLAT project** (created by UTZLINE Projects v9+ — no real Level/Room
folders at all):

```
<Projects folder>/
  utzline-users.csv
  <Project>/
    project-meta.json
    joinery-items.json                          <- written by UTZLINE Projects, read-only here
    Project Saves/
      Floor Plans/<Project> - <Level>.json       <- one file per Level (rooms/markers inside)
      UTZLINE ITP/Delivery ITP/
        <Level> - <Room> - <Joinery Item>.json   <- this item's saved checklist state
    PDF Files/
      UTZLINE ITP/Delivery ITP/
        <Level> - <Room> - <Joinery Item>_<timestamp>.pdf
```

One shared folder for the whole project (not per-Level/Room) since the
filename itself already carries the full Level/Room/Item key. "+ New
Joinery Item" is hidden for a flat project — only UTZLINE Projects
creates joinery items — but every item it has created shows up here the
moment it exists, even before its checklist has been touched.

## Getting this installed as its own app

**This app lives in its own separate GitHub repository** — not a
subfolder of Site Measure's, the Viewer's, or any sibling app's repo.
Every app in the UTZLINE family (Site Measure, Viewer, Install ITP,
Manufacture ITP, UTZLINE Projects, UTZLINE Scheduler, UTZLINE Delivery
ITP) is its own repo with its own GitHub Pages URL.

1. In this app's own repo, add every file from this bundle at the repo
   root (not inside a subfolder) — keep the `icons/` folder structure
   intact. It'll go live at that repo's own GitHub Pages URL.
2. Open that URL once in a normal browser tab while online, so the
   service worker can cache it for offline use.
3. Install it: Chrome/Edge's install icon in the address bar ("Install
   this site as an app"). Because it has its own `manifest.json` (its
   own name and icons — amber/gold, to tell it apart from every sibling
   app's own colour), Chrome and Windows/Android treat it as a wholly
   separate, independently installable app.
4. On a phone or tablet — the main way this one's meant to be used —
   "Install this site as an app" is under the browser's own menu
   (Chrome: menu -> "Add to Home screen" / "Install app").

## Updating this app

Same process every time a new build ships: unzip whatever's shared in
chat, upload the files into this app's own repo root (overwriting
existing ones, keeping `icons/` intact), commit, wait for GitHub Pages
to redeploy, then close and reopen the installed app to pick up the
change. **Bump the "Current version" line at the top of this README
(with a dated changelog entry) and `service-worker.js`'s `CACHE_NAME`
every single time a change ships** — both need to move together, or
installed copies keep serving a stale cached build and this README
stops being a reliable record of what's actually live.

## Things worth knowing

- **The checklist items are a first draft** — see "The checklist items"
  above. Review and edit `CHECK_ITEMS` in `index.html` before relying on
  this for real deliveries.
- **The name+PIN registry's PIN is plain text by design, not a real
  security system** — see its own section above. Don't treat it as
  access control.
- **A joinery item is just a number you type in**, not a marker placed on
  the plan — there's no on-plan picking in this app. If two people type
  slightly different numbers for what's meant to be the same item
  ("J101" vs "J-101"), they'll end up as two separate checklists;
  agreeing on a numbering convention avoids that (ideally the same
  convention already used elsewhere in the family for the same item).
- **This app's checklist is entirely separate from its siblings'.** The
  same joinery number can have a manufacture checklist (`itp-manufacture`),
  a delivery checklist (`itp-delivery`), and an install checklist
  (`itp-install`) all at once, each living in its own folder — that is by
  design, not a bug, since each stage is checking something different.
- **Signing is finger/stylus on the device's own touchscreen** — the
  signature pad is a plain draw area with a "Clear signature" button per
  role; there's no typed-name-as-signature fallback.
- **Project No./Name/Head Contractor only show up if Site Measure's own
  "Project Info" has been filled in for that project.** If it hasn't,
  those title-block fields just show as blank on the checklist and in the
  exported PDF.
- **Exported PDFs accumulate.** Re-exporting the same joinery item after
  fixing something adds a new timestamped file rather than replacing the
  old one, so the `itp-delivery` folder can build up multiple PDFs per
  item over time — that's deliberate (a paper trail of every export), not
  a bug.

## What's in this folder

- `index.html` — the whole app: markup, styles, and logic in one file
- `manifest.json`, `service-worker.js` — what makes this installable and
  offline-capable as its own app
- `icons/` — this app's own amber/gold-accented icon set
- `gen_icons.py` — the script that generated `icons/` (a simple
  delivery-truck glyph via Pillow); re-run it if the icon ever needs
  regenerating
- `jspdf.umd.min.js`, `sans.woff2`, `mono.woff2` — bundled library and
  fonts (all local, no CDN) — no SVG/PDF-import libraries are needed here
  since this app never opens an existing PDF or SVG, unlike the editor
  and Viewer
