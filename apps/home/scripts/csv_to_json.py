"""
csv_to_json.py — Monthly Odoo CSV → JSON conversion for DAS Ei events.

Reads the Odoo CSV export, produces a structured JSON with per-event meta tracking.
If a JSON already exists at the output path, it merges rather than overwrites:
  - locked events are preserved as-is
  - existing events are updated (data fields from CSV, meta preserved)
  - new events get meta.created set to today
  - removed-from-CSV events are kept (past/manual entries)
  - issues are auto-detected and auto-cleared per run

Usage:
    python3 apps/home/scripts/csv_to_json.py
"""

import csv
import json
import os
from datetime import date

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(
    os.path.abspath(__file__)
))))

INPUT  = os.path.join(PROJECT_ROOT, "_meta", "Tasks", "events_dasei.csv")
OUTPUT = os.path.join(PROJECT_ROOT, "apps", "home", "content", "agenda", "events_dasei.json")

TODAY = date.today().isoformat()  # e.g. "2026-04-05"

VENUE_MAP = {
    "Mue: Kineo":     "Institut Kineo",
    "Nbg: Tanzerei":  "Tanzerei",
    "Mue: Welt-Haus": "Eine Welt Haus",
}

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def fix_address(street, zip_code, city):
    """Reformat to German default: Street, PLZ City"""
    parts = []
    if street:
        parts.append(street)
    if zip_code and city:
        parts.append(f"{zip_code} {city}")
    elif city:
        parts.append(city)
    elif zip_code:
        parts.append(zip_code)
    return ", ".join(parts)


def parse_csv(path):
    """Parse the Odoo CSV into a list of event dicts (with agendaLines collected)."""
    rows = []
    with open(path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)

    events = []
    current = None

    for row in rows:
        rid = row["ID"].strip()

        # --- agenda line from this row ---
        agenda_type     = row["Agenda Lines/Type"].strip()
        agenda_provider = row["Agenda Lines/Provider"].strip()
        agenda_weekday  = row["Agenda Lines/Weekday"].strip()
        agenda_date     = row["Agenda Lines/Date"].strip()
        agenda_start    = row["Agenda Lines/Start Time"].strip()
        agenda_end      = row["Agenda Lines/End Time"].strip()
        agenda_location = row["Agenda Lines/Location Hint"].strip()

        has_agenda = any([agenda_type, agenda_provider, agenda_weekday,
                          agenda_date, agenda_start, agenda_end, agenda_location])

        agenda_entry = {}
        if has_agenda:
            if agenda_type:     agenda_entry["type"]         = agenda_type
            if agenda_provider: agenda_entry["provider"]     = agenda_provider
            if agenda_weekday:  agenda_entry["weekday"]      = agenda_weekday
            if agenda_date:     agenda_entry["date"]         = agenda_date
            if agenda_start:    agenda_entry["startTime"]    = agenda_start
            if agenda_end:      agenda_entry["endTime"]      = agenda_end
            if agenda_location: agenda_entry["locationHint"] = agenda_location

        if rid:  # new event row
            shortcode = row["Template/Display Name"].strip().lower()
            key = f"{shortcode}_{rid}"

            # merge teaching units: pick the non-zero value
            tu = row["Template/Teaching Units"].strip()
            units = row["Units"].strip()
            tu_val = float(tu) if tu else 0.0
            units_val = float(units) if units else 0.0
            if units_val != 0.0:
                teaching_units = units_val
            elif tu_val != 0.0:
                teaching_units = tu_val
            else:
                teaching_units = 0
            if teaching_units == int(teaching_units):
                teaching_units = int(teaching_units)

            raw_venue = row["Venue"].strip()
            venue = VENUE_MAP.get(raw_venue, raw_venue)

            street   = row["Venue/Street"].strip()
            zip_code = row["Venue/Zip"].strip()
            city     = row["Venue/City"].strip()
            venue_formatted = fix_address(street, zip_code, city)

            event = {
                "key": key,
                "shortcode": shortcode,
                "heading": row["Display Name"].strip(),
                "date_start": row["Start Date"].strip(),
                "date_end": row["End Date"].strip(),
                "hasOnlineSessions": row["Has Online Sessions"].strip() == "True",
                "homedomain": row["Homedomain"].strip(),
                "instructor": row["Responsible"].strip(),
                "venue": venue,
                "teasertext": row["Teasertext"].strip(),
                "teachingUnits": teaching_units,
                "venueFormatted": venue_formatted,
                "venueStreet": street,
                "venueZip": zip_code,
                "venueCity": city,
                "schedule": row["Schedule"].strip(),
                "agendaLines": [],
            }

            if has_agenda and agenda_entry:
                event["agendaLines"].append(agenda_entry)

            events.append(event)
            current = event

        else:  # continuation row — only agenda lines
            if current and has_agenda and agenda_entry:
                current["agendaLines"].append(agenda_entry)

    return events


def fix_times(event):
    """Try to fix placeholder start/end times from agendaLines.

    Returns a list of issue codes detected (empty if all good).
    """
    issue_codes = []
    lines = event["agendaLines"]

    if not lines:
        issue_codes.append("missing_agendalines")
        return issue_codes

    raw_start = event["date_start"]
    raw_end   = event["date_end"]
    start_date_str = raw_start[:10] if raw_start else ""
    end_date_str   = raw_end[:10]   if raw_end   else ""
    has_online = event["hasOnlineSessions"]

    # --- fix start time ---
    start_fixed = False
    if start_date_str:
        candidates = [l for l in lines
                       if l.get("date") == start_date_str and "startTime" in l]
        if has_online and len(candidates) > 1:
            in_presence = [l for l in candidates
                           if l.get("locationHint", "").lower() != "online"
                           and l.get("provider", "").lower() != "microsoft teams"]
            if in_presence:
                candidates = in_presence
        if candidates:
            event["date_start"] = f"{start_date_str} {candidates[0]['startTime']}:00"
            start_fixed = True

    if not start_fixed:
        issue_codes.append("missing_start_time")

    # --- fix end time ---
    end_fixed = False
    if end_date_str:
        candidates = [l for l in lines
                       if l.get("date") == end_date_str and "endTime" in l]
        if has_online and len(candidates) > 1:
            in_presence = [l for l in candidates
                           if l.get("locationHint", "").lower() != "online"
                           and l.get("provider", "").lower() != "microsoft teams"]
            if in_presence:
                candidates = in_presence
        if candidates:
            event["date_end"] = f"{end_date_str} {candidates[0]['endTime']}:00"
            end_fixed = True

    if not end_fixed:
        issue_codes.append("missing_end_time")

    return issue_codes


def build_meta_for_new(issue_codes):
    """Create a fresh meta block for a newly imported event."""
    meta = {"created": TODAY}

    if issue_codes:
        log = [f"{TODAY} {code} auto-detected during import" for code in issue_codes]
        meta["issues"] = {
            "resolved": False,
            "log": log,
            "next_action": "review",
        }

    return meta


def update_meta_issues(existing_meta, new_issue_codes):
    """Update an existing meta block with current issue state.

    - Auto-clear issues that no longer apply.
    - Add new issues that appeared.
    """
    issues = existing_meta.get("issues")
    old_log = issues["log"] if issues else []

    # Extract previously-active (not cleared) issue codes from log
    active_codes = set()
    for entry in old_log:
        parts = entry.split(" ", 2)  # "date code description"
        if len(parts) >= 2:
            code = parts[1]
            if code.startswith("cleared_"):
                active_codes.discard(code[len("cleared_"):])
            else:
                active_codes.add(code)

    new_log_entries = []

    # Auto-clear codes that are no longer detected
    for code in sorted(active_codes):
        if code not in new_issue_codes:
            new_log_entries.append(f"{TODAY} cleared_{code} auto-resolved on re-import")

    # Add newly detected codes
    for code in new_issue_codes:
        if code not in active_codes:
            new_log_entries.append(f"{TODAY} {code} auto-detected during import")

    if not issues and not new_log_entries:
        # No issues existed, none now — nothing to do
        return

    if not issues and new_log_entries:
        # First time issues appeared
        existing_meta["issues"] = {
            "resolved": False,
            "log": new_log_entries,
            "next_action": "review",
        }
        return

    # issues block already exists — append new log entries
    issues["log"] = old_log + new_log_entries

    # Recompute active codes after log update
    still_active = set()
    for entry in issues["log"]:
        parts = entry.split(" ", 2)
        if len(parts) >= 2:
            code = parts[1]
            if code.startswith("cleared_"):
                still_active.discard(code[len("cleared_"):])
            else:
                still_active.add(code)

    issues["resolved"] = len(still_active) == 0

    # If all resolved, clear next_action
    if issues["resolved"]:
        issues.pop("next_action", None)
    elif "next_action" not in issues:
        issues["next_action"] = "review"


DATA_KEYS = [
    "shortcode", "heading", "date_start", "date_end", "hasOnlineSessions",
    "homedomain", "instructor", "venue", "teasertext", "teachingUnits",
    "venueFormatted", "venueStreet", "venueZip", "venueCity", "schedule",
    "agendaLines",
]


def merge(existing_events, csv_events):
    """Merge CSV-parsed events into the existing JSON data.

    Returns (merged_list, stats_dict).
    """
    existing_map = {e["key"]: e for e in existing_events}
    csv_map = {e["key"]: e for e in csv_events}

    merged = {}
    stats = {"created": 0, "updated": 0, "locked_skipped": 0, "kept": 0}

    # --- Process CSV events ---
    for key, csv_ev in csv_map.items():
        issue_codes = fix_times(csv_ev)

        if key in existing_map:
            existing = existing_map[key]
            meta = existing.get("meta", {"created": TODAY})

            if meta.get("locked"):
                # Locked — preserve entirely
                merged[key] = existing
                stats["locked_skipped"] += 1
                continue

            # Update data fields from CSV
            for dk in DATA_KEYS:
                existing[dk] = csv_ev[dk]

            # Update meta
            meta["updated"] = TODAY
            update_meta_issues(meta, issue_codes)
            existing["meta"] = meta

            merged[key] = existing
            stats["updated"] += 1

        else:
            # New event
            csv_ev["meta"] = build_meta_for_new(issue_codes)
            merged[key] = csv_ev
            stats["created"] += 1

    # --- Keep events only in existing (not in CSV) ---
    for key, existing in existing_map.items():
        if key not in csv_map:
            merged[key] = existing
            stats["kept"] += 1

    # Sort by key
    sorted_events = sorted(merged.values(), key=lambda e: e["key"])
    return sorted_events, stats


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    # Parse CSV
    csv_events = parse_csv(INPUT)
    print(f"Parsed {len(csv_events)} events from CSV")

    # Load existing JSON if present
    existing_events = []
    if os.path.exists(OUTPUT):
        with open(OUTPUT, encoding='utf-8') as f:
            data = json.load(f)
            # Support both old format (plain array or {events:[], ...})
            if isinstance(data, list):
                existing_events = data
            elif isinstance(data, dict) and "events" in data:
                existing_events = data["events"]
        print(f"Loaded {len(existing_events)} existing events from JSON")
    else:
        print("No existing JSON found — creating fresh")

    # Merge
    merged, stats = merge(existing_events, csv_events)

    # Collect unresolved issue keys
    issue_keys = []
    for ev in merged:
        issues = ev.get("meta", {}).get("issues")
        if issues and not issues.get("resolved", False):
            issue_keys.append(ev["key"])

    # Write output
    output = {
        "events": merged,
        "unresolved_issues": issue_keys,
    }

    os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
    with open(OUTPUT, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"\nDone: {len(merged)} events written to {OUTPUT}")
    print(f"  created: {stats['created']}, updated: {stats['updated']}, "
          f"locked_skipped: {stats['locked_skipped']}, kept: {stats['kept']}")

    if issue_keys:
        print(f"\n=== {len(issue_keys)} UNRESOLVED ISSUES ===")
        for key in issue_keys:
            ev = next(e for e in merged if e["key"] == key)
            log = ev["meta"]["issues"]["log"]
            print(f"  {key}: {log[-1]}")


if __name__ == "__main__":
    main()
