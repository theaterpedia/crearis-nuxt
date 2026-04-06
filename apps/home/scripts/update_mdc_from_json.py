#!/usr/bin/env python3
"""
Step 4: Update MDC frontmatter from events_dasei.json

Strategies:
A) SINGLE EVENTS (604-705 .md files)
   - Update: date_start, date_end (format YYYY-MM-DDTHH:MM)
   - Update: teaser (from JSON teasertext, cleaned of \r)
   - Update: heading (from JSON heading)
   - Add/update: schedule, instructor, venue, venueFormatted,
                  venueStreet, venueZip, venueCity,
                  teachingUnits, hasOnlineSessions, shortcode
   - Preserve: all other existing fields untouched

B) COURSE ITEMS (einstiege-*.md, z15r)
   - Rename item keys (SharePoint IDs → Odoo IDs)
   - Update: date_start, date_end
   - Update: schedule, instructors (from JSON instructor)
   - Update: location (from JSON venueFormatted or venue)
   - Add: shortcode (lowercase from JSON)
   - Preserve: ctype, tag, title, image, body

C) FORTSETZUNG items (a2/a5 in m18x, n18x)
   - No JSON match exists — leave completely untouched
"""

import json
import os
import re
import sys
from collections import OrderedDict
from datetime import datetime

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
AGENDA_DIR = os.path.join(PROJECT_ROOT, "content", "agenda")
JSON_PATH = os.path.join(AGENDA_DIR, "events_dasei.json")

# -------------------------------------------------------------------
# Mapping tables
# -------------------------------------------------------------------

# Single event files: filename → json key (all 16 matched)
SINGLE_EVENT_FILES = {
    "604.info-teaser-aa_56.md": "aa_56",
    "604.info-teaser-aa_57.md": "aa_57",
    "605.anfaenge-verstehen-la_49.md": "la_49",
    "605.das-zwei-kreise-modell-ld_43.md": "ld_43",
    "605.info-teaser-aa_58.md": "aa_58",
    "606.cojc-paedagogik-lh_7.md": "lh_7",
    "606.info-teaser-aa_59.md": "aa_59",
    "606.info-teaser-r0_51.md": "r0_51",
    "607.info-teaser-aa_60.md": "aa_60",
    "607.info-teaser-r0_54.md": "r0_54",
    "607.urspruenge-der-performance-ra_20.md": "ra_20",
    "608.info-teaser-aa_61.md": "aa_61",
    "609.info-teaser-aa_62.md": "aa_62",
    "610.info-teaser-aa_63.md": "aa_63",
    "701.info-teaser-aa_65.md": "aa_65",
    "704.3-impros-lb_44.md": "lb_44",
}

# Course files: filename → { old_key: new_json_key }
# Keys NOT listed here are left untouched (Fortsetzung items, non-matched)
COURSE_RENAMES = {
    "einstiege-ins-theaterspiel-m18w.md": {
        "aa_188": "aa_56",
        "a0_154": "a0_33",
        "a4_165": "a4_29",
        "a5_166": "a5_30",
        "a1_176": "a1_40",
        "a2_172": "a2_36",
        "a3_168": "a3_31",
    },
    "einstiege-ins-theaterspiel-m18x.md": {
        "aa_188": "aa_56",
        "a0_154": "a0_33",
        "a1_158": "a1_21",
        "a4_164": "a4_28",
        "a3_168": "a3_31",
        # a2_158 and a5_164 are Fortsetzung — no rename
    },
    "einstiege-ins-theaterspiel-n18w.md": {
        "aa_188": "aa_56",
        "a0_160": "a0_66",
        "a4_161": "a4_29",
        "a5_182": "a5_30",
        "a1_167": "a1_88",
        "a2_163": "a2_36",
        "a3_159": "a3_22",
    },
    "einstiege-ins-theaterspiel-n18x.md": {
        "aa_189": "aa_56",
        "a0_155": "a0_66",
        "a1_159": "a1_21",
        "a4_165": "a4_28",
        "a3_169": "a3_22",
        # a2_159 and a5_165 are Fortsetzung — no rename
    },
    "aufbaustufe-profil-performance-und-interkult-theater-z15r.md": {
        "e1_blind": "e1_1",
        "e2_bewegung": "e2_69",
    },
}

# -------------------------------------------------------------------
# Helpers
# -------------------------------------------------------------------

def load_json():
    with open(JSON_PATH) as f:
        data = json.load(f)
    return {ev["key"]: ev for ev in data["events"]}


def fmt_date(dt_str):
    """Convert '2026-05-15 19:00:00' → '2026-05-15T19:00'"""
    if not dt_str:
        return ""
    dt = datetime.strptime(dt_str, "%Y-%m-%d %H:%M:%S")
    return dt.strftime("%Y-%m-%dT%H:%M")


def clean_text(text):
    """Remove \\r from text (Odoo CSV artifact)."""
    if not text:
        return ""
    return text.replace("\r\n", "\n").replace("\r", "")


def read_file(path):
    with open(path) as f:
        return f.read()


def write_file(path, content):
    with open(path, "w") as f:
        f.write(content)


def split_frontmatter(content):
    """Split MDC file into (frontmatter_str, body_str).
    frontmatter_str includes the --- delimiters."""
    m = re.match(r"^(---\n.*?\n---)(.*)", content, re.DOTALL)
    if not m:
        raise ValueError("No frontmatter found")
    return m.group(1), m.group(2)


# -------------------------------------------------------------------
# YAML manipulation (line-based, no re-serialization)
# We do NOT use yaml.dump to preserve formatting, comments, etc.
# Instead we do targeted line replacements in the raw frontmatter.
# -------------------------------------------------------------------

def update_yaml_field(fm_lines, key, value, after_key=None):
    """Update or insert a top-level scalar YAML field.
    Returns modified lines list.
    `value` should be a plain string (will be auto-quoted if needed).
    `after_key` — if inserting, place after this key.
    """
    # Find existing line
    pattern = re.compile(rf"^{re.escape(key)}:\s")
    for i, line in enumerate(fm_lines):
        if pattern.match(line):
            # Check if it's a multi-line value (|)
            if ": |" in line:
                # Replace until next key or ---
                end = i + 1
                while end < len(fm_lines) and (fm_lines[end].startswith("  ") or fm_lines[end].strip() == ""):
                    end += 1
                fm_lines[i:end] = [format_yaml_line(key, value)]
            else:
                fm_lines[i] = format_yaml_line(key, value)
            return fm_lines

    # Not found — insert after after_key or at end (before ---)
    new_line = format_yaml_line(key, value)
    if after_key:
        pattern2 = re.compile(rf"^{re.escape(after_key)}:\s")
        for i, line in enumerate(fm_lines):
            if pattern2.match(line):
                # Skip multi-line values
                j = i + 1
                while j < len(fm_lines) and (fm_lines[j].startswith("  ") or fm_lines[j].strip() == ""):
                    j += 1
                fm_lines.insert(j, new_line)
                return fm_lines

    # Fallback: insert before last ---
    fm_lines.insert(-1, new_line)
    return fm_lines


def format_yaml_line(key, value):
    """Format a single YAML key: value line."""
    if value is None or value == "":
        return f"{key}:"
    if isinstance(value, bool):
        return f"{key}: {'true' if value else 'false'}"
    if isinstance(value, (int, float)):
        return f"{key}: {value}"
    # String — check if needs quoting
    s = str(value)
    if "\n" in s:
        # Multi-line — use | block scalar
        lines = s.rstrip("\n").split("\n")
        return f"{key}: |\n" + "\n".join(f"  {l}" for l in lines)
    # Quote if contains special chars
    if any(c in s for c in ":#{}[]&*!|>'\",@`"): 
        escaped = s.replace('"', '\\"')
        return f'{key}: "{escaped}"'
    return f"{key}: {s}"


# -------------------------------------------------------------------
# Strategy A: Update single event files
# -------------------------------------------------------------------

def update_single_event(filepath, json_event, report):
    """Update a single-event MDC file with JSON data."""
    content = read_file(filepath)
    fm_str, body = split_frontmatter(content)
    fm_lines = fm_str.split("\n")
    fname = os.path.basename(filepath)
    ev = json_event
    changes = []

    # date_start
    new_ds = fmt_date(ev["date_start"])
    old_line = find_line(fm_lines, "date_start:")
    if old_line and new_ds not in old_line:
        fm_lines = update_yaml_field(fm_lines, "date_start", new_ds)
        changes.append(f"date_start → {new_ds}")

    # date_end
    new_de = fmt_date(ev["date_end"])
    old_line = find_line(fm_lines, "date_end:")
    if old_line and new_de not in old_line:
        fm_lines = update_yaml_field(fm_lines, "date_end", new_de)
        changes.append(f"date_end → {new_de}")

    # teaser (from teasertext)
    teasertext = clean_text(ev.get("teasertext", ""))
    if teasertext:
        fm_lines = update_yaml_field(fm_lines, "teaser", teasertext, after_key="description")
        changes.append("teaser ← teasertext")

    # heading
    heading = ev.get("heading", "")
    if heading:
        fm_lines = update_yaml_field(fm_lines, "heading", heading, after_key="id")
        changes.append("heading updated")

    # schedule
    schedule = clean_text(ev.get("schedule", ""))
    if schedule:
        fm_lines = update_yaml_field(fm_lines, "schedule", schedule, after_key="date_end")
        changes.append("schedule added/updated")

    # instructor
    instructor = ev.get("instructor", "")
    if instructor:
        fm_lines = update_yaml_field(fm_lines, "instructor", instructor, after_key="id")
        changes.append(f"instructor: {instructor}")

    # venue fields
    venue = ev.get("venue", "")
    if venue:
        fm_lines = update_yaml_field(fm_lines, "venue", venue, after_key="tag")
        changes.append(f"venue: {venue}")
    vf = ev.get("venueFormatted", "")
    if vf:
        fm_lines = update_yaml_field(fm_lines, "venueFormatted", vf, after_key="venue")
        changes.append("venueFormatted added")

    # teachingUnits
    tu = ev.get("teachingUnits", 0)
    if tu and tu > 0:
        fm_lines = update_yaml_field(fm_lines, "teachingUnits", tu, after_key="date_end")
        changes.append(f"teachingUnits: {tu}")

    # hasOnlineSessions
    hos = ev.get("hasOnlineSessions", False)
    fm_lines = update_yaml_field(fm_lines, "hasOnlineSessions", hos, after_key="date_end")
    changes.append(f"hasOnlineSessions: {hos}")

    # shortcode
    sc = ev.get("shortcode", "")
    if sc:
        fm_lines = update_yaml_field(fm_lines, "shortcode", sc, after_key="id")
        changes.append(f"shortcode: {sc}")

    new_content = "\n".join(fm_lines) + body
    write_file(filepath, new_content)
    report.append(f"  {fname}: {', '.join(changes)}")


def find_line(lines, prefix):
    for line in lines:
        if line.startswith(prefix):
            return line
    return None


# -------------------------------------------------------------------
# Strategy B: Update course items
# -------------------------------------------------------------------

def detect_item_indent(content):
    """Detect the indent pattern for items: dict in a course file.
    Returns (key_indent, field_indent) strings.
    Typically (' ', '  ') for 1-space keys, 2-space fields."""
    m = re.search(r"^items:\s*$\n^(\s+)\S+:", content, re.MULTILINE)
    if m:
        key_indent = m.group(1)
        # Field indent = key_indent + one more level (matching existing)
        # Look at next line after key
        pos = m.end()
        next_lines = content[pos:pos+200].split("\n")
        for nl in next_lines[1:]:
            if nl.strip():
                field_indent = re.match(r"^(\s*)", nl).group(1)
                return key_indent, field_indent
    return " ", "  "  # fallback


def update_course_file(filepath, rename_map, events, report):
    """Update a course MDC file: rename item keys and update fields."""
    content = read_file(filepath)
    fname = os.path.basename(filepath)
    changes = []
    key_indent, field_indent = detect_item_indent(content)

    for old_key, new_key in rename_map.items():
        ev = events.get(new_key)
        if not ev:
            changes.append(f"  WARN: {new_key} not found in JSON")
            continue

        # Step 1: Rename the item key line
        old_pattern = re.compile(
            rf"^{re.escape(key_indent)}{re.escape(old_key)}:\s*$",
            re.MULTILINE,
        )
        m = old_pattern.search(content)
        if not m:
            changes.append(f"  WARN: key '{old_key}' not found in file")
            continue

        content = content[:m.start()] + f"{key_indent}{new_key}:" + content[m.end():]
        changes.append(f"  {old_key} → {new_key}")

        # Step 2: Find the item's field block and update fields in-place
        # The block starts after "key_indent+new_key:" and includes all lines
        # at field_indent (or deeper) until the next key at key_indent level
        content = update_item_block_fields(content, new_key, key_indent, field_indent, ev)

    write_file(filepath, content)
    report.append(f"  {fname}:")
    for c in changes:
        report.append(f"    {c}")


def update_item_block_fields(content, item_key, key_indent, field_indent, ev):
    """Find an item block by key and update specific fields in-place."""
    # Find the key line
    key_pattern = re.compile(
        rf"^{re.escape(key_indent)}{re.escape(item_key)}:\s*$",
        re.MULTILINE,
    )
    km = key_pattern.search(content)
    if not km:
        return content

    # Extract the block: from line after key to next sibling key or ---
    block_start = km.end()
    if content[block_start:block_start+1] == "\n":
        block_start += 1

    # Find end: next line at key_indent level (a sibling key) or "---"
    remaining = content[block_start:]
    block_lines = []
    pos = 0
    for line in remaining.split("\n"):
        # Check if this line is a sibling key (at key_indent, not deeper)
        if line.strip() and not line.startswith(field_indent) and (line.startswith(key_indent) or line == "---"):
            break
        block_lines.append(line)
        pos += len(line) + 1  # +1 for \n

    block_end = block_start + pos

    # Now update fields within block_lines
    updated = update_fields_in_lines(block_lines, field_indent, ev)

    return content[:block_start] + "\n".join(updated) + "\n" + content[block_end:]


def update_fields_in_lines(lines, indent, ev):
    """Update specific fields in a list of YAML lines at given indent."""
    # Fields to update from JSON
    updates = {}

    new_ds = fmt_date(ev["date_start"])
    updates["date_start"] = new_ds

    new_de = fmt_date(ev["date_end"])
    updates["date_end"] = new_de

    schedule = clean_text(ev.get("schedule", ""))
    if schedule:
        updates["schedule"] = schedule

    instructor = ev.get("instructor", "")
    if instructor:
        updates["instructors"] = instructor

    venue = ev.get("venue", "")
    vf = ev.get("venueFormatted", "")
    if vf:
        updates["location"] = vf
    elif venue:
        updates["location"] = venue

    sc = ev.get("shortcode", "")
    if sc:
        updates["shortcode"] = sc

    # Apply updates: replace existing fields, track which were applied
    applied = set()
    result = []
    i = 0
    while i < len(lines):
        line = lines[i]
        # Check if this line is a field we want to update
        matched_key = None
        for key in updates:
            if line.startswith(f"{indent}{key}:"):
                matched_key = key
                break

        if matched_key:
            applied.add(matched_key)
            value = updates[matched_key]
            # Skip old multi-line content (lines more indented)
            i += 1
            deeper = indent + " "
            while i < len(lines) and (lines[i].startswith(deeper) or lines[i].strip() == ""):
                # Don't skip blank lines that separate items
                if lines[i].strip() == "" and i + 1 < len(lines) and not lines[i+1].startswith(deeper):
                    break
                i += 1
            # Write new value
            result.extend(format_item_field(indent, matched_key, value))
        else:
            result.append(line)
            i += 1

    # Insert any fields that weren't already present
    # (add before trailing blank lines)
    for key in updates:
        if key not in applied:
            insert_pos = len(result)
            while insert_pos > 0 and result[insert_pos - 1].strip() == "":
                insert_pos -= 1
            new_lines = format_item_field(indent, key, updates[key])
            for j, nl in enumerate(new_lines):
                result.insert(insert_pos + j, nl)

    return result


def format_item_field(indent, key, value):
    """Format a YAML field at given indent level."""
    if value is None or value == "":
        return [f"{indent}{key}:"]
    s = str(value)
    if "\n" in s:
        result = [f"{indent}{key}: |"]
        for line in s.rstrip("\n").split("\n"):
            result.append(f"{indent} {line}")
        return result
    # Quote if needed
    if any(c in s for c in ":#{}[]&*!|>'\",@`"):
        escaped = s.replace('"', '\\"')
        return [f'{indent}{key}: "{escaped}"']
    return [f"{indent}{key}: {s}"]


# -------------------------------------------------------------------
# Main
# -------------------------------------------------------------------

def main():
    events = load_json()
    report = ["=" * 60, "MDC Update Report — Step 4", "=" * 60, ""]

    # Strategy A: Single events
    report.append("STRATEGY A: Single Event Files (16 files)")
    report.append("-" * 40)
    for fname, json_key in sorted(SINGLE_EVENT_FILES.items()):
        fpath = os.path.join(AGENDA_DIR, fname)
        if not os.path.exists(fpath):
            report.append(f"  MISSING: {fname}")
            continue
        ev = events.get(json_key)
        if not ev:
            report.append(f"  NO JSON: {fname} → {json_key}")
            continue
        update_single_event(fpath, ev, report)

    report.append("")

    # Strategy B: Course items
    report.append("STRATEGY B: Course Item Files (5 files)")
    report.append("-" * 40)
    for fname, rename_map in sorted(COURSE_RENAMES.items()):
        fpath = os.path.join(AGENDA_DIR, fname)
        if not os.path.exists(fpath):
            report.append(f"  MISSING: {fname}")
            continue
        update_course_file(fpath, rename_map, events, report)

    report.append("")
    report.append("STRATEGY C: Untouched items")
    report.append("-" * 40)
    report.append("  m18x: a2_158, a5_164 (Fortsetzung — no JSON match)")
    report.append("  n18x: a2_159, a5_165 (Fortsetzung — no JSON match)")
    report.append("  m17c: all items (structural mismatch)")
    report.append("  z15e, z15t: leave as-is")
    report.append("  705.info-teaser-aa_1582.md: leave as-is (no JSON match)")
    report.append("  705.site-specific-performance-rc_1195.md: leave as-is")

    print("\n".join(report))
    return report


if __name__ == "__main__":
    main()
