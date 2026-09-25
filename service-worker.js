// UTZLINE Delivery ITP offline service worker.
//
// This is a SEPARATE, independently-installable app in the same family as
// UTZLINE Site Measure (the editor), UTZLINE Viewer (the read-only
// browser), UTZLINE ITP (now specifically the INSTALL-stage app),
// UTZLINE Manufacture ITP (the factory/pre-dispatch stage), and UTZLINE
// Projects. This app is the DELIVERY stage -- the checklist an item goes
// through when it arrives on site, before it's unpacked and stored ready
// for install. Forked directly from the Install ITP codebase (same
// checklist/signature/PDF-export machinery, same folder conventions) with
// its own manifest, own icon (amber/gold, to tell it apart from Site
// Measure/Viewer's orange-red, Install ITP's green, Manufacture ITP's
// purple, UTZLINE Projects' crimson, and Scheduler's blue), own taskbar/
// Start-menu entry, own cache namespace ("utzline-delivery-itp-cache-*",
// never sharing a name with any of the other apps even though all of them
// can be installed side by side on the same machine). It reads the SAME
// Projects folder structure (project/level/room, the same reserved
// saves/pdfs/backup convention) and writes its own project-wide
// "itp-delivery" folder alongside a project's level folders -- a sibling
// of, and never colliding with, Install ITP's "itp-install" or
// Manufacture ITP's "itp-manufacture" folders. See index.html's own
// top-of-file comment for the full data-format rationale, including the
// new shared name+PIN identity registry (utzline-users.csv) built here
// first, per Andrew's own instruction to test it on this app before any
// sibling app gets it.
//
// Same cache-first app shell strategy as the other apps: a small, fixed
// set of local files, no CDN calls once installed. Bump CACHE_NAME
// whenever index.html or any vendored asset changes, so installed copies
// pick up the update instead of serving stale files forever.
//
// (v1, 2026-09-23: first release. Forked from UTZLINE ITP (Install ITP)
// with: a first-draft 5-row delivery/receiving checklist (Andrew hasn't
// specified Delivery ITP's own item list yet -- see index.html's own
// CHECK_ITEMS comment) replacing the 16-row install checklist; sign-off
// roles relabelled "Delivery Driver / Transport Rep." and "Metro Site
// Supervisor (Receiving)" (was "Subcontractor Rep. (Joinery Installer)" /
// "Metro Site Supervisor"); its own project-wide "itp-delivery" data
// folder, kept fully separate from Install ITP's "itp-install" and
// Manufacture ITP's "itp-manufacture" -- brand new, so unlike Install
// ITP's own "itp"->"itp-install" rename there is no old name and no
// migration step; an amber/gold icon/accent identity; sign-off now writes
// the shared joinery-status.json record forward to "delivered" (rank 4,
// between Manufacture ITP's "manufactured" and Install ITP's "installed")
// instead of an interim in-progress status -- Delivery ITP has no
// "checklist merely opened" stage, matching Install ITP's own simpler
// single-stage pattern rather than Manufacture ITP's two-stage one; and a
// new, precedent-setting shared name+PIN identity registry
// (<ProjectsRoot>/utzline-users.csv, DELIVERY ITP ONLY for this round)
// replacing the old bare-text "Set your name" prompt with a dropdown of
// known names plus a PIN check, or a form to add a new name+PIN with a
// "show me in" app-tickbox row -- deliberately a plain, spreadsheet-
// openable, file-manager-editable CSV with the PIN in plain text
// (reference-only attribution, not real access control), so Andrew can
// hand-edit or delete a row to reset/reclaim a name without touching any
// project data. The underlying per-device "utzline-identity" IndexedDB
// mechanism every sibling app already reads/writes is unchanged -- only
// what triggers the write on this screen. Site Measure/Viewer's own level
// list, Install ITP's own level list, Manufacture ITP's own level list,
// and UTZLINE Projects' own level list were all updated to also exclude
// "itp-delivery" by name, the same way they already excluded
// "itp"/"itp-install"/"itp-manufacture".)
//
// (v2, 2026-09-23: "View on plan" / location snapshot, DELIVERY ITP ONLY.
// Andrew asked for a way to show on the map where a joinery item was
// placed, from its own delivery checklist. Added a "Location" section on
// the checklist screen: a "View on plan" button that jumps straight to
// that item's own Level Plan screen, panned and zoomed so its own roomlink
// marker sits centred in view (not the usual whole-image fit-to-view);
// and an "Add location snapshot" button that renders that same
// centred-on-marker view to an offscreen canvas and saves it as a
// compressed JPEG data URL into the checklist's own JSON
// (data.locationSnapshot = {dataUrl, w, h, capturedAt} -- a single
// CURRENT snapshot, replaced by "Retake", not a gallery like `photos`).
// The saved snapshot shows as a small thumbnail with its own "View on
// map" button, which does exactly what "View on plan" does. Items with no
// marker yet (legacy data, or a joinery item never placed on any plan)
// degrade gracefully to a toast ("No plan location found for this item
// yet.") instead of erroring. Nothing here touches Install ITP,
// Manufacture ITP, Site Measure, Viewer, UTZLINE Projects or Scheduler.)
//
// (v6, 2026-09-23: Andrew, verbatim, on the exported PDF's photos/pin
// drops/snapshots: "change it from a3 to a4 portrait. All collated nicely
// per page. All to be date and time stamped with users name also." The
// trailing photo-grid page(s) (previously A3 landscape, 3x2) are now A4
// portrait, 2x3, matching the rest of the document's own page size for the
// first time -- each photo shows a date/time + uploader-name caption
// underneath it (formatPdfImageStamp), from a new `addedBy` field stamped
// onto a photo the moment it's added (deviceUserName at add-time)
// alongside its existing `addedAt`. The DELIVERY LOCATION pin-drop
// snapshot (v2/v5, above) gets the same treatment: `locationSnapshot` now
// also carries `capturedBy`, and its own PDF caption gains a date/time +
// name line above the existing "Pin dropped..." description. A photo or
// snapshot saved before this release has no addedBy/capturedBy on file and
// simply shows its date/time alone, never a blank or "undefined" name.)
//
// (v7, 2026-09-23: Andrew, verbatim: "Manufacture status needs to be split
// up into 2 parts. We need a machined and a manufactured tab. All
// traceable by user name. Machined to have its own app. Called machine
// schedule. This is where the machinist can mark off a joinery item as
// complete. It will add their name and date time to the system." This app
// now recognises the new "machined" stage (rank 3, between
// "in_manufacture" and "manufactured") on the shared joinery-status.json
// record, set by the new sibling app UTZLINE Machine Schedule when the
// machinist marks a joinery item complete (their own name + date/time,
// via the same shared identity system this app already uses). Delivery
// ITP itself only ever reads "machined"/"manufactured" and still only
// ever writes "delivered" here (unchanged) -- joineryStatusRank/
// joineryStatusIcon/joineryDisplayIcon in index.html were renumbered so
// manufactured/delivered/installed each shift up one rank (4/5/6, was
// 3/4/5) to make room for "machined" at rank 3. No data migration: this
// is additive to the existing forward-only status chain.)
var ICON_VERSION = "v1";
var CACHE_NAME = "utzline-delivery-itp-cache-v12";

var PRECACHE_URLS = [
  "./",
  "./index.html",
  "./manifest.json?v=" + ICON_VERSION,
  "./jspdf.umd.min.js",
  "./sans.woff2",
  "./mono.woff2",
  "./icons/icon-192.png?v=" + ICON_VERSION,
  "./icons/icon-512.png?v=" + ICON_VERSION,
  "./icons/icon-192-maskable.png?v=" + ICON_VERSION,
  "./icons/icon-512-maskable.png?v=" + ICON_VERSION
];

self.addEventListener("install", function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(PRECACHE_URLS);
    }).then(function(){
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function(event){
  event.waitUntil(
    caches.keys().then(function(names){
      return Promise.all(
        names.filter(function(n){ return n !== CACHE_NAME; })
             .map(function(n){ return caches.delete(n); })
      );
    }).then(function(){
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function(event){
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(function(cached){
      var networkFetch = fetch(event.request).then(function(response){
        if (response && response.status === 200){
          var copy = response.clone();
          caches.open(CACHE_NAME).then(function(cache){ cache.put(event.request, copy); });
        }
        return response;
      }).catch(function(){
        return cached;
      });
      // Cache-first for instant offline loads; refresh the cache in the
      // background whenever the network is available.
      return cached || networkFetch;
    })
  );
});
