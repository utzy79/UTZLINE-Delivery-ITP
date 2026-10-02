# UTZLINE Delivery ITP — installable app

**Current version: v38 (RC 1.0)** (its own independent version line, separate from
Site Measure/Viewer's, Install ITP's, and Manufacture ITP's — bump this
line every time a new build ships. This line has drifted behind the actual
shipped cache version twice before today — see the v4 and "v2" entries
below for what each catch-up covers; `next-version-notes.md` in the project
is the authoritative record for anything not detailed here.)

**v38 (2026-10-02) — RC 1.0: builder logo on the top bar, logos folder, reversed Machined.**

- **Builder logo at the far right of the top bar** (Andrew: *"builder logo on the far right of the top bar"*): one logo in the header, just left of the day / night button, shown only while a project is open and the builder has a logo (it is hidden on the project list).
- **Company and builder logos live in a `logos` folder** at the Projects root (Andrew: *"move the company and builders logos into a logos folder"*). Every app reads `logos/` first and falls back to the old root files, so nothing breaks before the move; UTZLINE Projects writes only into `logos/` and copies the root files across once (copies -- nothing is moved or deleted). `logos` is never listed as a project.
- **Reversed Machined** (Andrew: *"if something is flagged as machined, but then the machining gets reversed, the flags need to be reversed also"*): the status now honours the Machine Schedule's `statusRetract` event -- undo a cut there and this app drops the item back to its earlier stage too (history shows the entry struck through, then "reversed"). Later re-machining counts normally.
- **Dark mode controls**: drop-downs, their open lists, text boxes and buttons that no style had touched now get a real dark background and readable text (one shared rule), and the day / night contrast was swept for white-on-pale text.

**v37 (2026-10-02) — Add rework / Open rework (n) on every joinery item bar, a red room flag for outstanding reworks, and reworks record the app that logged them.**

Same as Install ITP v58: the red item-bar button opens the Add rework screen (or Open rework (n) when outstanding reworks exist); a room with outstanding reworks shows a red "🛠 n reworks" flag. Every rework now carries `createdApp` ("UTZLINE Delivery ITP") and the shared register shows it in a "Logged in" column. Sign-in cover inlined.

**v36 (2026-10-01) — RC 1.0: ITP header logos, Save and exit, builder logo on project rows, Add rework here.**

- **Save and exit:** the checklist page's button says **Save and exit** in every state (it said just *Exit* once the item was signed off).
- **PDF header:** the builder's logo is **25% smaller** and sits **far left**; the Metro Joinery (company) logo is **centred**; the UTZLINE mark stays top right (Andrew: *"builder logo is way too big. make it 25% smaller and to the far left, with our logo in the centre of the header"*). The **PHOTOS** heading now sits **below** the logo band on photo pages, so the logos no longer cover it.
- **Project rows:** the builder's logo at the far right of each project row, scaled to the row (Andrew: *"builders logo to go on the far right of each project toolbar scaled to fit the toolbar"*).
- **The plan PDF export** (Site Measure / Viewer) has a **second QR code**, dark red, at the bottom right of each page under the first one's column and labelled **Add rework here** (Andrew: *"another qr code that takes you to the add rework option ... bottom of the page under right aligned with the current one and a different colour (red if possible) labeled add rework here"*). It carries the same item link with `a=rework`; scanning it (or opening it from the phone's camera) in the Install or Delivery ITP goes straight to that item's Add rework screen; the Manufacture ITP (no rework screen) opens the item and says rework is added in the Install or Delivery ITP.

**v35 (2026-10-01) — RC 1.0: code-only file names -- joinery codes, not descriptions, in every file and folder name (path-limit round, fourth build).**

- Andrew: *"have a real good think about how we can minimise filepaths, maybe we need to lose the joinery descriptions and just have joinery codes. give me a solid solution"* -- then *"I have no actual current files so dont care if I need to start again"*. Every folder and file kept for ONE joinery item is now named by the item's **file name** -- its joinery code (e.g. `JG.33.1`; a second item with the same code is `JG.33.1 (2)`), chosen once by UTZLINE Projects when the item is made or imported and saved on the item in `joinery-items.json` (`fileKey`), never changed afterwards -- instead of `<Level> - <Room> - <Code>` (64 characters for the pilot's `Ground Floor - G.33 - Change Cubical & Patient Consent - JG.33.1`). The level, room and description stay inside the records and `joinery-items.json`, so every screen still shows them.
- Records carry the author's **initials** and a two-digit-year stamp (`JG.33.1 -- AU - 26-10-01 16-25-35-281 - set.json`, in a level folder cut to 30 characters); imported files are **renamed** on the way in (the name they came in with is kept in the record or the `.json` beside the file and is what the screen shows). On the pilot's own folder (88 characters) the longest path is now 121 of the 163 the project folder leaves -- project folders up to about 130 characters deep work.
- **Clean break:** nothing is read under the old long names. Set the project up again in UTZLINE Projects (it gives every item its file name when the project is opened) -- the other apps pick the names up from `joinery-items.json`.
- Delivery ITP: Checklist, PDF, change-log folder and rework data use the item's file name.

**v34 (2026-10-01) — RC 1.0: path-limit round, third build — the folder-path banner only when records really can't fit.**

- Andrew, with the banner on screen (*"leaves only 163 for UTZLINE's own files (long room names need about 170)"*): *"what can we do, im already in the root folder for onedrive"*. 163 is plenty for the short record names -- his longest record is 150 characters after the project folder (141 with the shortest branch) -- the 170 was set for the old long names. The banner now shows only when the project's folder path leaves less than even the shortest names need (**135**), and then says so (*"even the shortest record names need about 135, so some records may not save"*).
- A record that does have to take a short `_hash` name (a very long room-and-code) is saved and read like any other, so it no longer raises the banner: the page gets a `utz-path-limit` event (why `fallback`) and a console note. The banner stays for a record that **can't** be saved at all.

**v33 (2026-10-01) — RC 1.0: path-limit round, second build — `~` is a name Chrome refuses; record names with initials and a two-digit year.**

- Andrew's first run of the morning build showed the banner with *"leaves only 0"*: Chrome's File System Access API refuses any file name containing a `~` (it treats the tilde as a reserved Windows character), so every probe file -- and the `~hash` fallback names -- would have been refused. The markers are `_` now (`_hash`, 9 characters) and the probe name has no tilde; measured on the pilot folder the real figure is 163.
- Andrew: *"change usernames to initials, year from 2026 to 26, remove milliseconds?"* -- a record's on-disk name part is now `<initials> - <yy-mm-dd hh-mm-ss-mmm> - <kind>.json` (`AU - 26-10-01 13-09-18-862 - set.json`; the record's body still carries the full name and time, every reader folds from the body). The milliseconds stay: two saves in the same second must never land on one name. Together with the level no longer in the name, the pilot's longest record is 141 characters after the project folder (was 166; it has 163).

**v32 (2026-10-01) — RC 1.0: Windows' 260-character path limit — records for long room names were saved empty.**

- **Why:** Andrew: *"some get corrupted from the import (dont bring in the pc date for delivery), then i cant change them in the schedule"* and Set schedule's *"Couldn't save this schedule -- try again"*. Windows limits a file's full path to 260 characters. The pilot project sits in `C:\Users\andrewu\OneDrive - Metro Joinery\UTZLINE Pilot\3756 - Jones Radiology Mt Barker\` (88 characters) and a schedule record for a long room name ("G.10 - Female Amenities Staff") reached 253 in full -- Chrome writes through a `<name>.crswap` swap file (7 more), so the file was created EMPTY and the save failed. 27 of the 72 schedule files in that project's Ground Floor folder were empty; the same limit was behind the items that never took the PC date on import.
- **Now:** a new record's name no longer repeats the level its folder already names -- `UTZLINE Events/<Branch>/<Level>/<Room> - <Code> -- <name> - <stamp> - <kind>.json` (the room-and-code part capped at 70 characters) -- which is 15-plus characters shorter; every record already on disk under the long name still reads, old and new side by side. When even that doesn't fit, the empty file is removed and the record is kept under a 9-character `~hash` name, and a banner says why. On a PC the first write to a project measures what its folder path leaves (a few empty probe files under `UTZLINE Events`, made and removed again) and the banner shows early when that is under the ~170 characters long room names need: *move the Projects folder nearer the drive root (for example `C:\UTZLINE Projects`), or shorten the project folder's name*. Nothing of Andrew's is touched or renamed.
- **Update every device:** an app still on the previous version doesn't see records written under the new short names (the same as when the level folders came in).

**v31 (2026-10-01) — RC 1.0: Scan QR code — the QR on the Viewer's exported floor plan opens the room / joinery item here.**

- Andrew: *"can that viewer export also generate and apply a qr code on the page, that the delivery itp can scan to open the relevant room / joinery item"* → *"All three ITPs"*. A **📷 Scan QR code** button on the Projects and Levels screens opens the camera; the QR printed on the Viewer's A3 floor plan export opens that item's checklist straight away (the project, level, room and joinery code are in the code). Reads with the browser's own QR detector where it has one (Chrome on Android), otherwise with a small reader kept in the app's folder (`jsqr.min.js`, offline through the service worker). The first scan asks for camera permission.
- The same code opened by a phone's own camera is a link to the Delivery ITP (`?utz=item&p=…&l=…&r=…&j=…`); any of the three ITPs opened with that link goes to the item once its Projects folder is connected.

**v30 (2026-09-30) — RC 1.0: day / night mode, the room in the marker menu, the builder's logo on the level heading and the checklist PDF.**

- **Day / night mode** (Andrew: *"give me day / night mode for all apps"*): a ☀ / ☾ button at the top right of every screen switches between the dark look and a new light one; with nothing chosen the app follows the device's own setting. The choice is kept per device and shared by the UTZLINE apps on it.
- The marker's right-click / long-press menu now shows the **room** as well as the joinery ID (Andrew: *"these menus to show the room number also ... across all apps that have these popups on right click"*).
- **Builder's logo** (set up per builder in UTZLINE Projects) beside the project's level heading and, on every page of the checklist PDF, beside the company logo. The rework PDF carries it and the new "Drafter" line too.

**v29 (2026-09-30) — RC 1.0: sign in on open (tablets and phones), Change folder bottom right.**

- Andrew: *"on next update, when opening the apps, it should as[k] for you to login, currently it just loads to the last user that was logged in, some of these tablets will have multiple users (employees)"*. **On a tablet or phone the app now asks who is using it** -- a full-screen *Who's using this?* list (every name in `utzline-users.csv`, plus *+ Add a new name…*) each time the app is opened, and again when it has been in the background for **10 minutes or more**. Tap your name and enter your 4-digit PIN on the usual numberpad. The name saved on the device is only treated as "the last person" now; if another app on the device signs in as someone else, this one asks again when it comes back to the front. **A PC is unchanged** (it keeps the last user), and the PIN numberpad, the registry and the name stamped on saves are as before.
- Andrew: *"move the change folder to the bottom right of the page, and smaller"*. The **Change folder** control on the project list is now a small button fixed to the bottom-right corner of the screen (its tooltip keeps the full wording, *Use a different Projects folder*) instead of a full-size button / link in the list.

**v28 (2026-09-30) — RC 1.0: records are kept one folder per level — much faster on a tablet; less loaded at start.**

- Andrew: *"how can we speed up schedule loading on the app android"* / *"all are slow"*. Every status, schedule date, cut, solid-surface tick, cutting file and note is still one small file per change (nothing is ever rewritten), but they now go in **one folder per level** — `Project Saves/UTZLINE Events/<record type>/<Level>/`, each file named `<Level> - <Room> - <Code> -- <name> - <time> - <kind>.json` — instead of one folder per joinery item. A schedule now lists a handful of level folders instead of hundreds of item folders; on the tablet each folder costs about a quarter of a second.
- Records a project already has in the old item folders are still read, and both places are shown together (a record found in both counts once). UTZLINE Projects shows **Speed up this project** on a project that still has old folders and moves them — each record copied, checked, then its old copy removed.
- **Update every tablet and PC.** An app older than this one doesn't look in the level folders, so it won't see records written by this one — and only press *Speed up this project* once every device is updated.
- **The PDF tools load when they're first needed** (Andrew: *"Is there anything we can strip out to speed it up. Any bloat"*). jsPDF used to load every time the app opened, about 420 KB of code parsed before anything showed; now it loads the first time a PDF is made (a checklist or rework PDF). Offline it still comes from the app's own copy.
- The plan's status badges now read only that level's folder.


**v27 (2026-09-30) — RC 1.0: "Get ready for offline" is quick on Android.**

- Andrew: *"it has taken 10 minutes to "get ready for site""*. The check opened every file in the ticked jobs one at a time, and on his tablet each open takes about a quarter of a second. On an Android tablet OneSync / Dropsync keep a real copy of every file, so there's nothing to download: it now just checks the ticked jobs and the names & PINs list are on the tablet (a few seconds) and says so. **Open every file (slow)** in that dialog still does the full check. Windows laptops (OneDrive "online-only" files) still get the full check, which downloads what's missing.

**v26 (2026-09-29) — RC 1.0: every checklist save also writes its own change file.**

- **Two tablets can't lose each other's checklist changes any more.** Andrew: *"shouldnt everything run like this. isnt that the ultimate failsafe"*. Every save still writes the item's whole checklist file (so the schedules and Projects read it as before), and **also** a small change file of its own that's never rewritten: `Project Saves/UTZLINE ITP/Delivery ITP Log/<Level> - <Room> - <Code>/<name> - <date time> - change.json` (a legacy project: a `<Code> log` folder beside the checklist). It holds only what that save changed — the rows, sign-offs, notes and photos that differ from when the item was opened. When two tablets save the same item offline, OneDrive keeps one whole file, but both change files arrive; opening the item puts the other tablet's changes back. For each row, sign-off and field the newest change wins; photos are added and removed one by one.
- An ordinary open reads the whole file plus a list of the item's change files — only ones the whole file hasn't already taken in are read (normally none), so it stays quick on the 4 GB tablets.
- A save that doesn't land now says so ("Couldn't save … — try Save & exit again") and Save & exit stays on the checklist. It used to carry on as if it had saved.
- Two saves of the same file at once are done one after the other.
- **Every tablet needs this version.** A tablet still on an older ITP only writes the whole file, so its changes aren't protected until it's updated.
- The delivery pin is a change file too, and the pin shown on the plan / "Go to pin" reads the change files.

**v25 (2026-09-29) — RC 1.0: the factory for In manufacture, every time; every save retried.**

- **🏭 for a job note too.** Andrew: *"viewer is giving me different icond for in manufacture, some of it if th ehammer and spanner, others is the factory, i want the factory throguhout"*. A job note means In manufacture, but an item whose In manufacture step hadn't landed (the Scheduler's job-note bug, fixed in Scheduler v35) or that predates the rule showed 🛠️ on its marker. It now shows 🏭 like the rest.
- **Every save is retried and checked.** Status events, checklists, reworks, the names list, the status indexes and ITP PDFs: each is read back to check its size, and the whole write is tried again 0.5 s and 1.5 s later if it fails. On Windows, a sync client or antivirus holding a brand-new file for a moment used to fail the save and leave a 0-byte file with nothing said.
- **No message says "still syncing?" any more.** It was a guess and usually wrong. Messages now say "couldn't read … just now".

**v24 (2026-09-29) — RC 1.0: Projects on this device.** Andrew: *"the onsite apps need an option fo rthe user to pick the projectas they are working on to minimise the syunc on their device"*.

- **Plan markers 20% smaller.** Andrew: *"on he next projects update, make the indicator dots about 20% smaller (and the icons)"*. Every marker dot on a plan, and the status icon over it, is drawn at 0.8 × its saved size. This matches UTZLINE Projects v42. Nothing saved changes, and tapping a marker still uses the full size.
- **Projects on this device.** The project list has a new bar at the top: **Choose my projects**. Tick the one or two jobs this device is working on. Then:
  - Only those are listed. The rest sit behind **Show the other N projects**, and the app reads nothing from them. On a Windows tablet with OneDrive, an online-only job is never downloaded by this app.
  - **How to sync only these** says exactly what to keep on the device: the files in the main folder itself (names & PINs, logo) and each ticked job. It covers OneDrive on Windows (Always keep on this device / Free up space) and OneSync / Dropsync on Android (sync only those folders).
  - **Get ready for offline** opens every file in the ticked jobs, plus the names & PINs list. Anything online-only is downloaded while there's internet. Anything that won't open is listed. The bar then shows "✓ Ready for offline — checked today 09:15".
  - A ticked job that isn't on the device shows as **not on this device yet**, not just missing.
  - The choice is kept on this device, per main folder, under the same key in every UTZLINE app. Nothing is written to the Projects folder. **Show all projects** in the chooser goes back to the full list.

**v23 (2026-09-29) — RC 1.0.** Andrew: *"ok, now change them all to version RC 1.0. and have that on the logos (small)"*.

- The app is now **RC 1.0** (release candidate 1.0) across the UTZLINE family. A small **RC 1.0** tag sits beside the logo in the header.
- The build number (v23) still counts up underneath, so installed copies pick up each update. It's also what the Windows installer "Setup RC 1.0" contains.

**v22 (2026-09-28) — Reworks: delivered is its own file, one PDF per rework, delivered in green at the bottom.** The rework round (same requests as Install ITP v43: *"also need to fix this rework conflict…"*, *"reworks that are delivered to be green border / text and sent to bottom of page"*, *"only overflow to page 2,3,etc if they dont fit on page 1"*). Standard: project doc `claude/utzline-rework-event-standard-v1.md`.
- **Drop pin + mark delivered** no longer rewrites the item's shared rework file. It saves one "delivered" file in the item's log folder, named with the driver's name and the date and time, holding the date, the pin and the location photo. **Retake pin** saves another one, and the newest pin and photo are the ones shown. State changes and close-out are their own files too. Only adding or deleting a rework still writes the shared file.
- **Every app's changes show here.** Cut (Machine Schedule), Complete — ready to deliver (Scheduler), Delivered, Closed out, and comments from any app. Each rework card has its status log and a comment box.
- **One PDF per rework**, named with your name and the date and time. It's made when a rework is added, when it's delivered, when it's closed out, and on Rework PDF / Share. Details and the whole status log come first. The photos start on page 1 and only run on when they don't fit, with the delivery-location photo included.
- **Delivered reworks go green, at the bottom**, in a **Delivered (N)** section. Close-out still needs the pin dropped first.
- Tests: `pdftest-delivery-itp/run_delivery_itp_rework_tracker.js` updated for event files. `pdftest-projects/run_rework_cross_app.js` is new. `pdftest-projects/run_delivery_itp_auto_export_on_signoff.js` is refreshed for the single PIN-gated driver sign-off.

**v21 (2026-09-27):** Hides the **Schedule Backups** folder from the project list. Scheduler v29 now keeps its daily spreadsheet backups in that folder, directly in the main Projects folder (Andrew: *"a schedule backups folder directly in the main folder ... I meant in the main folder. Not the individual projects folder."*). Every app lists every folder in the main folder as a project, so each one now leaves that folder out: `isReservedRootFolderName`, the same one-line rule in every app. Tested across all 11 apps by `pdftest-projects/run_schedule_backups_folder_hidden.js`, which fails on every app's previous build and passes on the new ones.

**v20 (2026-09-27):** New "Sub Orders" summary on the checklist screen, with mark-as-received write-back. Andrew, verbatim, alongside the identical request across the rest of the family: "ok now we need all joinery summary pages to show the associated orders. with the option to mark them as recieved. the main schedule also needs a mark as received button for orders. on the schedule." This app's own "joinery summary page" is the checklist screen itself (`#screenChecklist`) rather than a separate cards-based item dialog, so the new section is a plain inline block in that same linear form — a "Sub Orders" heading plus `#subOrdersListEl` — sitting between the existing Location section and the final Save & exit row, matching every other section here (Photos, Location) rather than a popup.

**Review fix in the same build (2026-09-27):** the first cut of `setSubOrderReceived` read through the display reader, which treats an unreadable (mid-sync) Orders file as empty, and the checkbox then said "Marked as received." even when nothing had been saved. It's now strict, per the family's "unreadable is not empty" rule: a file/order that's gone writes nothing ("isn't attached to this item any more"); an unreadable file is retried once, then "couldn't read (still syncing?) — nothing was changed"; it never creates anything and writes back through the handle it just read. New checks in the sub-orders test cover all three failure cases.

Reads UTZLINE Sub Orders' own `Project Saves/UTZLINE Sub Orders/Orders/<Level> - <Room> - <JoineryId>.json` (defaults to `[]` — no file yet just means nothing attached, never an error) plus `Project Saves/UTZLINE Sub Orders/Files/<storedName>` to resolve each order's own "Open" link (a missing file just hides that row's Open button). Strictly read-only in both those folders. Filenames are built with a brand-new `subOrdersSanitizeFileBase` — deliberately its own function, NOT this app's existing `sanitizeFileBase` (80-char slice, `"item"` fallback), since Sub Orders' own version differs (120-char slice, `"file"` fallback) and this filename has to be byte-identical to the one Sub Orders itself wrote.

"Categorised" — grouped under one heading per type, the fixed steel/upholstery/timber/aluminium order first, then any custom type alphabetically, each heading using `o.typeLabel` (the display name Sub Orders itself snapshotted onto the order when it was attached) so a custom type's real name shows without this app needing its own copy of Sub Orders' custom-types registry. A custom type's chip is one neutral `.subord-type-custom` style — never a guessed-at new hue (dataviz skill's own colour-safety ceiling: four base hues plus one neutral "other"). "Openable" reuses this screen's own `window.open(URL.createObjectURL(...))` pattern from "View job note".

"Mark as received" is a plain checkbox + date input per order, mirroring Sub Orders' own View Orders list interaction exactly — ticking auto-fills today's date and reveals the date field, unticking clears both `received` and `receivedDate`, changing the date while ticked re-writes with the new date. The write-back (`setSubOrderReceived`) always re-reads `Orders/*.json` fresh (never trusting in-memory state — another device may have changed it), then writes the whole array back in one `JSON.stringify(_, null, 2)` call — same shape Sub Orders' own `writeAttachedOrders` uses. The updated record is rebuilt via a **shallow copy** of the existing order object (`Object.assign({}, o, {...})`), never an explicit field list — mirroring the exact fix Sub Orders' own `setOrderReceived` just got there (v5, today): an allowlist that predates a later-added field (`typeLabel`, v4) silently drops that field forever the first time anything marks an order received. This is the only write this app ever makes into Sub Orders' data — `Inbox/` and `Files/` stay strictly read-only. The section obeys the checklist's existing sign-off lock (every input under `#screenChecklist` is disabled once signed off, same as "Add location pin") rather than getting a special exception.

New `run_sub_orders_summary.js`: renders grouped by type; a custom order type shows its real `typeLabel` with the neutral chip, not the raw storage key; the empty state when an item has no orders attached; the received checkbox/date toggle writes through to the real `Orders/*.json` file and preserves every other field (especially `typeLabel`) via the shallow-copy write; confirms this app never touches `Inbox/`/`Files/` for anything but resolving an Open link.

One perf regression caught and fixed along the way: an uncached direct folder walk to `Project Saves/UTZLINE Sub Orders` on every single checklist open would have reintroduced exactly the repeated-lookup cost the round 3/4/5 "still lagging on my tablet" work fixed for every other fixed path (most projects have no Sub Orders folder yet, and the existing directory-handle cache only remembers a *successful* lookup, never a miss) -- `getSubOrdersOrdersDir` now goes through the same cache (`projectDir`) plus a small negative-cache flag (`state.subOrdersRootMissing`, probed once at project-open alongside `isFlatProject`, reset on every fresh `openProject`) so a project with no Sub Orders data costs nothing extra on repeat opens. Full suite green (17 files) -- one pre-existing, unrelated flake in `run_round4_android_like_fs.js`'s own item-status-index timing (reproduces occasionally on the unmodified badge-cache path, nothing to do with Sub Orders) noted but not touched.

`service-worker.js` cache → `utzline-delivery-itp-cache-v20`.

**v19 (2026-09-27):** Company logo goes read-only, sourced from UTZLINE Projects (NEXT_RUN_NOTES.md item 8; this app was queued after Install ITP's own v40 and Manufacture ITP's own v19 shipped the identical fix). Andrew, verbatim: "change company logo should only be visable in the projects app, in every other app it should load the one chosen in projects." This app used to have its own completely independent "Insert logo"/"Change logo"/"Remove" UI on the Projects screen, storing a downscaled copy in this app's own device-local IndexedDB (`COMPANY_LOGO_KEY`) — unrelated to whatever UTZLINE Projects itself had set, so a different device could show a different logo. That UI (and the IndexedDB storage behind it) is gone entirely; the Projects screen now shows a **read-only** thumbnail (or a "No logo" placeholder) sourced straight from the shared `company-logo.png` file UTZLINE Projects owns at the Projects root (`state.rootHandle`, the same root `utzline-users.csv` already comes from) — best-effort, no error either way if the file isn't there yet. `loadCompanyLogo()` was rewritten to read that file (`downscaleImageFile` renamed `downscaleImageBlob`, now decoding a `Blob` straight off the shared file instead of a `<input type=file>` selection) and moved out of raw boot into `afterRootReady()` (alongside `populateIdentitySelector()`), since it needs `state.rootHandle` to exist first. The two existing PDF-export logo-placement code paths (`exportChecklistPdf`'s main checklist export and `exportReworkPdf`'s rework-log export, both `maxLogoW=180, maxLogoH=92`, top-right/top-left of the page) are completely untouched — they just now get fed from `state.companyLogoDataUrl`/`W`/`H` populated by the shared-file read instead of local storage, so an already-signed-off checklist's exported PDF is unaffected. New `run_company_logo_readonly.js` (no old Insert/Change/Remove UI in the DOM either way; the read-only thumbnail shows/hides correctly with/without `company-logo.png` at the root, no error either way; the exported PDF embeds the exact same data URL shown in the thumbnail, aspect-correct — verified via `window.jspdf.jsPDF.API.addImage` interception, same technique as Install ITP/Manufacture ITP's own equivalent tests) exercises this app's own driver-only, photo-and-pin-drop-gated sign-off flow (retired the Metro Site Supervisor block back in v17) to get a real export to fire. Full suite green (16 files).

`service-worker.js` cache → `utzline-delivery-itp-cache-v19`.

**v18 (2026-09-26):** "Go to location" zoom feel now matches UTZLINE Projects (a general note across the family, not scoped to this app). Andrew's dictation trail, same day, in order: "goto location needsd to be zoomed in even closer than it is now" → "the itp zoom works well, but needs to be closer again" → "match the other zooms to that" (briefly read as: match everything to the ITP mechanism) → superseded by his final word: "view on plan in projects is actually the perfect zoom level." So the reference is UTZLINE Projects' own feel, not this app's old one. `centrePlanOn` (the single-marker jump behind "Go to location"/"Go to pin" row buttons and the marker menu) now sets `planView.scale = Math.max(planView.scale, 1)` — at least native 1:1 pixel scale, ported verbatim from Projects' `openPlanCanvasForLevel` marker-jump branch — replacing the old `fitScale * PLAN_FOCUS_ZOOM` (5x fit-to-screen) multiplier. `PLAN_FOCUS_ZOOM` itself is unchanged and still used as the multi-marker bounding-box zoom cap ("Go to room", a different, unaffected feature). This app's own, separate "View on plan"/"View on map"/pin-placement mechanism (`centerPlanOnPoint`/`PLAN_CENTER_VIEW_WORLD_SIZE`, a deliberately fixed-world-size crop so a live view matches its own saved location-snapshot thumbnail exactly) is untouched — out of this note's scope. `run_room_list_alpha_and_marker_menu.js` updated (its stale `fitScale*5` assertion replaced with a `>=1` native-scale check); full suite green (15 files).

`service-worker.js` cache → `utzline-delivery-itp-cache-v18`.

**v17 (2026-09-26):** PIN-gated sign-offs (NEXT_RUN_NOTES.md item 12). Andrew, verbatim: "pin entry required for sign offs. stopping anyone from randomly signing off under another users name. (delivery drivers, site managers, factory managers)." This app's driver sign-off free-text name field is replaced by the shared name+PIN registry's own picker (a `<select>`, same registry the device identity selector already uses): picking a name immediately opens the numberpad to verify that name's own PIN before it's accepted — a wrong PIN shakes and clears for another attempt, Cancel reverts to whatever was last actually committed. Only a correctly-PIN-verified name is ever recorded on the checklist now. Separately, per Andrew: "also with the delivery itp, remove the site supervisor sign off, this is no longer required" — the Metro Site Supervisor sign-off block is deleted from the checklist entirely, not just left un-gated; `isChecklistSignedOff` and its sibling Save & exit helpers now require only the driver's own signature. An old checklist that already has real supervisor data saved from before this change keeps it untouched on disk and still shows it (side by side with the driver, as before) in the exported PDF — nothing already captured is lost, it just can't be added to any more. The driver name select is disabled along with everything else once a checklist locks (signed off). Registry names are read once per session and cached (refreshed at boot/root-pick, invalidated whenever a name is actually added) so this doesn't add a fresh `utzline-users.csv` read to every single checklist open — the PIN itself is still verified against a fresh read every time, so a PIN changed moments ago on another device is always checked correctly. New checks in `run_delivery_signoff.js` (supervisor block gone, registry listing, wrong PIN/Cancel revert, correct PIN commits + auto-fills today's date, survives the pin-drop round trip); `run_delivery_location_pdf_export.js` and `run_photo_pin_requirement.js` updated for the new sign-off flow. Full suite green.

`service-worker.js` cache → `utzline-delivery-itp-cache-v17`.

**v16 (2026-09-26):** Two items land together — NEXT_RUN_NOTES.md's own held-for-consolidation plan for this app.

- **Rework Register remainder — this app now owns the "Delivered to site" milestone.** Ported the rework tracker's own port pattern once more: the old plain "Received back on site" tickbox is retired, renamed **"Delivered to site"**, and moved here entirely — Andrew: "install itp for rework does not need a pin drop, install itp app requires no pin drops for anything only delivery itp app." Setting it now requires a **photo + pin drop**, using this app's own existing delivery-location-pin mechanics (`enterPinPlacementMode`/`planPinBar`, the same auto-captured location snapshot as the item-level delivery pin): a **"Drop pin + mark delivered"** button opens the Level Plan in pin-placement mode; confirming sets `received`, `receivedDate`, `deliveryLocationPin`, and `locationSnapshot` together and advances the entry's state to `delivered` in one action, then returns to the Rework screen. A delivered-but-not-yet-closed-out entry gets a **"Retake pin"** button instead. Install ITP shows this milestone read-only once set (see its own v37 changelog) — it can no longer set it itself. The manual state dropdown (Logged → Cut → Manufactured) excludes "Delivered to site" here too, so it can only be set via the pin flow. "Save & close out", the CLOSED OUT tag, the outstanding-reworks wording, and the rework PDF's status tag all say "delivered"/"Delivered". The vestigial separate `received` `REWORK_STATES` pipeline value is retired the same way as Install ITP, collapsed onto the already-present `delivered` value (confirmed safe — see Install ITP's v37 entry).
  **Shared rework file, with migration:** this app now reads/writes the exact same rework file per item as Install ITP (`itp-install-rework`/"Install ITP Rework"), instead of its own separate "Delivery ITP Rework" copy — the only way Install ITP can see a milestone this app sets, and the only way UTZLINE Projects' Rework Register (which only ever reads Install ITP's path) can see any of this app's rework entries at all. Any rework entries this app had already saved under its OLD, now-retired path are picked up automatically and losslessly the next time that item's Rework screen is opened here (`migrateOldDeliveryReworkEntries` — merges by `id`, newest-first by `createdAt`, best-effort, and leaves the old file untouched rather than deleting it). The merge is persisted back to the shared file immediately when it actually finds something to migrate (not just held in this session's memory), so Install ITP and the Rework Register see it too as soon as anyone next opens that item here.
  New test `run_delivery_itp_rework_migration.js` covers the migration directly: old-file-only entries get picked up and persisted; entries already on both sides merge without duplicating; the old file is left in place; re-opening the same item a second time is a safe no-op. `run_delivery_itp_rework_tracker.js` rewritten for the new pin-drop flow (button → plan → confirm → back on the Rework screen with the pin+photo+delivered state all set) and the shared-path `opts`. Full suite green.
- **Status icon revert** (held from the 2026-09-26 icon-sweep round, per NEXT_RUN_NOTES item 217): `joineryStatusIcon`'s `machined` (🪚 → ⚙️) and `in_manufacture` (🔨 → 🏭) cases reverted to what they were before that round, same as Install ITP. No other status icon changed; this app still has no on-screen banner or other live UI text spelling either icon out.

`service-worker.js` cache → `utzline-delivery-itp-cache-v16`.

**v15 (2026-09-26):** Status icon change — Andrew, verbatim: "change in
manufacture to this 🔨 and machined to this 🪚." `joineryStatusIcon` and
the plan-marker `joineryDisplayIcon` both updated (`in_manufacture`: 🏭 →
🔨; `machined`: ⚙️ → 🪚); no other status icon changed. Unlike Manufacture
ITP, this app has no on-screen banner or other live UI text that spells
either old icon out literally (checked) — icon-map-only change here.
`service-worker.js` cache → `utzline-delivery-itp-cache-v15`.

**v14 (2026-09-25):** the two things v13's own "Deliberately not ported" note flagged as coming later, both delivered now — Andrew: "port Install ITP's rework tracker into Delivery ITP" and, on Install ITP's own reverted pin-drop requirement, "we will add that the delivery itp later."

- **Rework tracker, ported from Install ITP (v33), renamed to this app's own folders.** Andrew, originally: "the install itp is to aldo have a rework tracker. You can now long press on a joinery item and have 2 buttons. 1 is open itp. The other is open rework. This is where we can take photos and provide text information for rework joinery parts including cabinet number. This will also have a received tick box with date selector. Multiple reworks can be added per joinery item and fully trackable via this system and via utzline projects summary pages per project." Identical shape and behaviour to Install ITP's tracker — the marker menu gains an **Open rework** button (between Open ITP and this app's own Go to pin-drop location); a new **Rework** screen (cabinet number, free-text detail, photos, newest-first history) and **Outstanding reworks** page (from Levels, grouped by level/room, red-accented, with Go to room / Show on plan / Open rework actions) — reusing this app's own existing photo pipeline, lightbox and generic dialogs rather than duplicating them. Five-state pipeline (`REWORK_STATES`: Logged → Cut (machined) → Manufactured → Delivered to site → Received back on site), "Received back on site" auto-fills today's date + a "Received by" field from the signed-in device name, and **Save & close out** (received + date + received-by all set) locks the entry read-only with a "CLOSED OUT" tag and removes its delete button. Each item's own cumulative, always-current rework PDF (red-accented, no timestamp — overwritten in place on every change, one file per item) is created on the first entry and deleted the moment the last one is removed. Storage, renamed per this app's own convention so the two apps' rework files never collide: `itp-delivery-rework/<Level>/<Room>/<Code>.json` (legacy) / `Project Saves/UTZLINE ITP/Delivery ITP Rework/<Level> - <Room> - <Code>.json` (flat), PDFs in the sibling `PDF Files/UTZLINE ITP/Delivery ITP Rework/` branch (legacy reuses the same room folder for both). RESERVED folder list gained `itp-delivery-rework` alongside the existing legacy-fake-level guards.
- **Photo AND a delivery-location pin now both required for sign-off.** The photo rule is Install ITP v34's own (`checklistHasPhoto`/`checklistOnlyMissingPhoto`, ported verbatim); the pin rule is new to this app — this app's own existing, previously-*optional* `deliveryLocationPin` feature (see "v2"/v5 below) is now a hard sign-off requirement, exactly the ask Andrew made on Install ITP before reversing it there ("if the itp gets saved without it but everything else is complete, make the app request a pin drop then take you to the map (default to joinery location first) also tell the user to upload a photo" → "that was a mistake, drop pin not required on the install itp. we will add that the delivery itp later" — this is that later). `isChecklistSignedOff` — the one predicate behind the PDF export, the lock, the joinery-status advance and the green marker tick — is now both signatures + no "No" + at least one photo + a dropped pin; three sibling predicates (`checklistOnlyMissingPhoto`/`checklistOnlyMissingPin`/`checklistMissingPinAndPhoto`) drive a **guided Save & exit flow**: saving an otherwise-complete sheet missing both alerts once and drops straight into pin-placement mode (photo added later); missing only the pin does the same; missing only the photo alerts and simply scrolls to the Add photo button, staying put. A checklist signed off before this update re-opens as "needs photo"/"needs pin" until both are added, re-exporting a fresh timestamped PDF once they are (the shared `delivered` status stays forward-only, unaffected). Every other place that used to check `data.signoff` directly (`computeItemItpStatus`/`computeRoomItpStatus`/`checklistProgress`/the item-status index/both row-rendering functions) now goes through the same shared predicate rather than a duplicated inline formula.
- **Tests.** New `run_delivery_itp_rework_tracker.js` (`pdftest-delivery-itp/`, both legacy and flat project shapes) covers the full tracker: menu wiring, add/edit/state-pipeline/lightbox/multi-entry/received+received-by/close-out/delete, the Outstanding reworks page, and the cumulative rework PDF's create/overwrite/survive/remove-on-last-delete lifecycle. New `run_photo_pin_requirement.js` (`pdftest-delivery-itp/`) covers the guided Save & exit flow end to end: missing-both → alert → pin placement → still not signed (no photo) → add photo → signs off, PDF auto-created, Items-list chip and Level Plan marker both flip to green; plus the missing-photo-only alert independently (missing-pin-only was already covered by the extended `run_delivery_location_pdf_export.js` below). Every sign-off-reaching test across both `pdftest-delivery-itp/` and `pdftest-projects/run_delivery_itp_*.js` that used to sign off with just two signatures now adds a photo and drops a pin first: `run_delivery_signoff.js`, `run_delivery_location_pdf_export.js` (its "no pin" scenario re-purposed — that state is no longer reachable via a real sign-off — to cover the new missing-pin alert + gate instead), `run_item_status_index_cache.js`, `run_round3_back_and_dir_cache.js`, `run_round4_android_like_fs.js`, and `run_delivery_itp_auto_export_on_signoff.js` (photo + pin added up front, before either signature, since confirming a pin drop writes straight to disk and would otherwise silently absorb the sign-off transition on reopen rather than triggering the auto-export). Full `pdftest-delivery-itp/` suite (14 files) and both in-scope `pdftest-projects/run_delivery_itp_*.js` files re-run clean. `service-worker.js` cache bumped to `utzline-delivery-itp-cache-v14`.

**v13 (2026-09-25):** the Install ITP v26–v35 updates, ported "relevant to their own itps." Andrew: "ok now rebuild the manufacturer and delivery itps to suit all these updates (relevant to their own itps.)" — everything Install ITP gained today that isn't Install-specific, adapted to this app's own driver/supervisor sign-off, "delivered" status advance, `itp-delivery` / `Project Saves/UTZLINE ITP/Delivery ITP/` folders and its own delivery-location pin feature. In order:

- **Performance (Install ITP rounds 1–5; Andrew: "itps are still taking minutes to load pages on android", "still takes about 40 seconds to load the actual itp from a floor plan", "still lagging on my tablet... pressing back from an itp is slow").** A per-project **directory-handle cache** (`getCachedDir`/`projectDir`) memoises every fixed folder walk (the flat checklist/PDF dirs, the new index dir, `Joinery Status`, `Floor Plans`, the legacy `itp-delivery/<Level>/<Room>` path and the level's room folders); cleared on project switch, dropped on a failed operation. An **item-status index, one file per level** — `Delivery ITP Index/<Level>.json` (legacy) or `Project Saves/UTZLINE ITP/Delivery ITP Index/<Level>.json` (flat), entries keyed `<Room>/<file>`, `{joineryNo, answered, total, signed, bothSigned, hasNo, updatedAt}` or `{missing:true}` — written on every save and every open (self-healing), serialised through one write chain; the Items list is now cache-first and parallel with one batched backfill write, and never opens a full checklist file (photos + location snapshot included) on a warm visit. The **Level Plan** no longer reads every marker's checklist: `loadLevelPlanItpStatuses` does one index read per level, lists a room's folder only for markers the index has never seen, reads only files that exist, and remembers misses; `loadLevelPlanJobStatusBadges` uses a per-level `<Level> - Badges.json` cache (4 h max age, patched immediately by this app's own status advances via `setJoineryStatusForward`) and otherwise ONE listing of the Joinery Status folder filtered to the level's keys — never a lookup by name into that project-wide folder. All background work runs through a small cancellable queue (`PLAN_STATUS_CONCURRENCY` 6) that stops the moment you leave the plan, so a marker tap never waits behind the level's backlog. **Three-state markers** (Andrew: "red x if not complete, green tick if finished and a blue x for started but not finished"). **Last-known marker snapshot** on the device (IndexedDB, keyed by this app's own name so it never mixes with Install/Manufacture ITP's) painted the instant the plan appears, corrected in the background, written through on every save here. **Back from a checklist shows the Items list immediately**, dimmed, refreshing behind the save; opening from a marker shows "Loading…" rather than another room's rows. Reserved-folder list on the legacy Levels screen now also excludes `Delivery ITP Index`, `Project Saves`, `PDF Files` and the sibling apps' rework folders (the same fake-level bug Install ITP hit). The in-memory `perfStart` timing log (console.warn over 1.5 s) is here too; Install ITP's ⏱ Timings button was removed at Andrew's request and was never added here.
- **Save & exit, lock, buttons (Install ITP v31–v32).** Checklist buttons are now **Save & exit · Cancel / return to floor plan · View job note** (Andrew: "save on the itp should be save and exit, no need for export pdf or delete this item buttons, if an itp is complete and saved, it then creates the pdf. this then has a pop up that is return to room or return to floor plan or return to start."). The manual Export PDF and Delete this item buttons are gone (`exportChecklistPdf` remains, used only by the sign-off auto-export). After Save & exit: **Return to room / Return to floor plan / Return to start**. **Locked once signed off** ("once an itp is saved and exported (complete), that itp page becomes locked (read only)"): a signed-off sheet — this app's own rule, both signatures and no "No"; **no photo or pin-drop requirement here** — opens with a 🔒 banner, every input/answer/signature/photo control AND the "Add location pin" button disabled, and its action button reads **Exit**. A flagged sheet stays editable.
- **Plan / list interaction (v31–v34).** A **marker tap (or long press / right-click) opens a menu**: **Open ITP · Go to pin-drop location · View job note · Cancel** (no "Open rework" — this app has no rework tracker). *Go to pin-drop location* and the item rows' *Go to pin* mean **this app's own** `deliveryLocationPin`, read from that item's checklist file without opening it: centre + pulse, or "No pin drop for <code> yet." **Row action buttons** — rooms: *Go to location · Open room*; items: *Go to location · Go to pin · View job note · Open ITP* (Andrew: "instead of long press to goto location, have buttons on the item... goto location, goto pin, open itp"; "also a view job note button"); *Go to location* on an item with a saved pin frames both marker and pin and pulses both; focus zoom is at least 5× fit ("it needs to zoom in closer"). **Opening a level lands on the room list** ("when you open a level, instead of going to the map, it should go to the room list") with a **🗺 Floor plan** button; "View on plan", "View on map" and "Add location pin" still go straight to the plan (`openLevelOnPlan`). **Rooms list alphabetical** (natural order). **No text selection / context menu** anywhere but text fields ("we just want to pan, zoom and load the menu buttons"; "It still try's to select the background stuff also"). **Photo lightbox** on the checklist gallery thumbnails. The existing **delivery-pin placement flow is untouched**: `planPointerEnd`'s pin-mode branch stays ahead of the new menu logic, the long-press timer and right-click menu are never armed while a pin is being placed, so a tap while placing a pin still places the pin exactly as before.
- **Phone back button + IndexedDB connection leak (Install ITP v35).** "can we make it so the phone back button goes back through the app, not close the app": every screen change pushes a history entry and back walks Checklist → Items (with the unsaved guard) → Rooms → Levels → Projects, Floor plan → Rooms, and — this app's own case — back mid pin placement acts as the bar's Cancel; an open dialog or photo closes first; the after-save dialog treats back as Return to room; Projects stays the base entry. "still having slow down after a little use": `idbOpen()`/`identityDbOpen()` opened a new IndexedDB connection per read/write and never closed it (much worse now that the plan snapshot reads/writes it constantly) — one memoised connection each, reopened only on `versionchange`/`close`.

**Deliberately not ported (Install-ITP-only):** the rework tracker and Outstanding reworks page; the photo requirement for sign-off (Andrew scoped it to Install ITP: "the add photo will be the requirement for the install itp"); the reverted install pin-drop; the delivery-pin *requirement* ("we will add that the delivery itp later" — not now); the Timings button. One thing this app has that Install ITP doesn't — its own pin placement — is what the marker menu had to be fitted around, and what makes "Go to pin" a same-app read here rather than a cross-app one.

Tests: every existing test in `pdftest-delivery-itp/` and `pdftest-projects/run_delivery_itp_auto_export_on_signoff.js` reworked for the new flows (level → room list → Floor plan; marker tap → menu → Open ITP; Save & exit → after-save choice; PDF via a real sign-off since there is no Export button; a flagged "No" placed before the second signature since a signed-off sheet is locked; lock + disabled pin button checked). Ported from Install ITP: `run_item_status_index_cache.js`, `run_plan_marker_tap_latency.js` (80 markers, serialised mock FS), `run_round4_android_like_fs.js` (the Android-like cost model: warm plan = 3 reads, zero named lookups into the 400-entry status folder, warm tap ≤ 3 named lookups — one fewer than Install ITP, no old-`itp` check here), `run_round3_back_and_dir_cache.js`, `run_room_list_alpha_and_marker_menu.js` (plus a row "Go to pin" check), `run_back_button_and_idb_connections.js` (plus back-during-pin-placement). All green. `service-worker.js` cache bumped to `utzline-delivery-itp-cache-v13`.

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
