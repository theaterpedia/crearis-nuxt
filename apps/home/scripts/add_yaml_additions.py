#!/usr/bin/env python3
"""
Step 5: Add YAML additions (meta, events, inherits, timeline, summary) to course MDC files.

Implements the 5 additions from SNAPSHOT 04-06-SNAPSHOT_course_yaml_data_mapping.md.

Usage:
    python3 apps/home/scripts/add_yaml_additions.py [--dry-run]
"""

import os
import re
import sys

AGENDA_DIR = os.path.join(os.path.dirname(__file__), '..', 'content', 'agenda')


def detect_item_indent(lines, item_key):
    """Find item key line and return (line_index, item_indent_str, field_indent_str, indent_unit_str)."""
    pattern = re.compile(r'^(\s*)' + re.escape(item_key) + r':\s*$')
    for i, line in enumerate(lines):
        m = pattern.match(line)
        if m:
            item_indent = m.group(1)
            # Next non-empty line is a field
            for j in range(i + 1, min(i + 5, len(lines))):
                stripped = lines[j].strip()
                if stripped and not stripped.startswith('#'):
                    field_indent = re.match(r'^(\s*)', lines[j]).group(1)
                    unit_len = len(field_indent) - len(item_indent)
                    indent_unit = ' ' * unit_len
                    return i, item_indent, field_indent, indent_unit
    return None, None, None, None


def format_meta_block(field_indent, indent_unit, meta_fields):
    """Format a meta: block with given fields."""
    lines = [f'{field_indent}meta:\n']
    sub_indent = field_indent + indent_unit
    for key, value in meta_fields.items():
        if isinstance(value, bool):
            lines.append(f'{sub_indent}{key}: {"true" if value else "false"}\n')
        else:
            lines.append(f'{sub_indent}{key}: {value}\n')
    return lines


def format_events_list(field_indent, indent_unit, events):
    """Format an events: list block."""
    lines = [f'{field_indent}events:\n']
    sub_indent = field_indent + indent_unit
    prop_indent = sub_indent + indent_unit
    for ev in events:
        lines.append(f'{sub_indent}- key: {ev["key"]}\n')
        lines.append(f'{prop_indent}label: {ev["label"]}\n')
    return lines


def format_summary_block(field_indent, indent_unit, summary):
    """Format a summary: block with phases and rollup fields."""
    fi = field_indent
    si = field_indent + indent_unit
    pi = si + indent_unit
    vi = pi + indent_unit

    lines = [f'{fi}summary:\n']
    lines.append(f'{si}phases:\n')
    for phase in summary['phases']:
        lines.append(f'{pi}- label: {phase["label"]}\n')
        lines.append(f'{vi}period: {phase["period"]}\n')
        modules_str = '[' + ', '.join(phase['modules']) + ']'
        lines.append(f'{vi}modules: {modules_str}\n')
        lines.append(f'{vi}ue: {phase["ue"]}\n')
    lines.append(f'{si}total_ue: {summary["total_ue"]}\n')
    lines.append(f'{si}duration: "{summary["duration"]}"\n')
    lines.append(f'{si}module_count: {summary["module_count"]}\n')
    return lines


def insert_after_item_key(lines, item_key, new_lines):
    """Insert new_lines right after the item key line (before existing fields like ctype:)."""
    idx, _, _, _ = detect_item_indent(lines, item_key)
    if idx is None:
        print(f'  WARNING: item key "{item_key}" not found')
        return lines
    return lines[:idx + 1] + new_lines + lines[idx + 1:]


def process_file(filepath, item_additions, dry_run=False):
    """Process a single MDC file, adding YAML fields to specified items."""
    filename = os.path.basename(filepath)
    print(f'\n=== {filename} ===')

    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Process items in REVERSE order (bottom to top) so line indices stay valid
    sorted_items = sorted(
        item_additions.items(),
        key=lambda x: detect_item_indent(lines, x[0])[0] or 0,
        reverse=True,
    )

    for item_key, additions in sorted_items:
        idx, item_indent, field_indent, indent_unit = detect_item_indent(lines, item_key)
        if idx is None:
            print(f'  SKIP: "{item_key}" not found')
            continue

        new_lines = []

        # 1. meta block
        if 'meta' in additions:
            new_lines.extend(format_meta_block(field_indent, indent_unit, additions['meta']))

        # 2. events list
        if 'events' in additions:
            new_lines.extend(format_events_list(field_indent, indent_unit, additions['events']))

        # 3. inherits
        if 'inherits' in additions:
            new_lines.append(f'{field_indent}inherits: {additions["inherits"]}\n')

        # 4. timeline: false
        if 'timeline' in additions:
            val = 'true' if additions['timeline'] else 'false'
            new_lines.append(f'{field_indent}timeline: {val}\n')

        # 5. summary block
        if 'summary' in additions:
            new_lines.extend(format_summary_block(field_indent, indent_unit, additions['summary']))

        if new_lines:
            lines = lines[:idx + 1] + new_lines + lines[idx + 1:]
            added_fields = ', '.join(additions.keys())
            print(f'  {item_key}: +{len(new_lines)} lines ({added_fields})')

    if dry_run:
        print(f'  DRY RUN — not writing {filename}')
    else:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(lines)
        print(f'  WRITTEN: {filepath}')

    return lines


# ── File definitions ─────────────────────────────────────────────────────

META_UPDATED = {'updated': '2026-04-06'}
META_LOCKED = {'locked': True}

FILES = {
    # m18w: 7 items, all updated by Step 4
    'einstiege-ins-theaterspiel-m18w.md': {
        'aa_56': {'meta': META_UPDATED},
        'a0_33': {'meta': META_UPDATED},
        'a4_29': {'meta': META_UPDATED},
        'a5_30': {'meta': META_UPDATED},
        'a1_40': {'meta': META_UPDATED},
        'a2_36': {'meta': META_UPDATED},
        'a3_31': {'meta': META_UPDATED},
    },

    # m18x: 5 updated + 2 inheriting
    'einstiege-ins-theaterspiel-m18x.md': {
        'aa_56': {'meta': META_UPDATED},
        'a0_33': {'meta': META_UPDATED},
        'a1_21': {'meta': META_UPDATED},
        'a2_158': {'inherits': 'a1_21', 'timeline': False},
        'a4_28': {'meta': META_UPDATED},
        'a5_164': {'inherits': 'a4_28', 'timeline': False},
        'a3_31': {'meta': META_UPDATED},
    },

    # m17c: 6 items, no JSON match
    'paedagogische-regie-m17c.md': {
        'c0_m17c': {'meta': META_LOCKED},
        'c2_m17c': {'meta': META_LOCKED},
        'c3_m17c': {'meta': META_LOCKED},
        'c5_m17c': {'meta': META_LOCKED},
        'c7_m17c': {'meta': META_LOCKED},
        'c8_m17c': {'meta': META_LOCKED},
    },

    # z15e: 2 with source, 1 inheriting, 4 locked
    'aufbaustufe-vertiefung-z15e.md': {
        'e1_blind': {'meta': {'source': 'e1_1'}},
        'k1_didaktik_und_theorie_teil1': {'meta': META_LOCKED},
        'offenes_programm': {'meta': META_LOCKED},
        'e2_bewegung': {'meta': {'source': 'e2_69'}},
        'k1_didaktik_und_theorie_teil2': {'meta': META_LOCKED},
        'e2_soziometrie': {'inherits': 'e2_bewegung', 'timeline': False},
        'erweiterung': {'meta': META_LOCKED},
    },

    # z15t: 1 summary + 1 events list + 9 locked
    'aufbaustufe-profil-theatrales-lernen-z15t.md': {
        'course_summary': {
            'meta': META_LOCKED,
            'summary': {
                'phases': [
                    {
                        'label': 'Vertiefung',
                        'period': 'SEP 2026 – FEB 2027',
                        'modules': ['E1', 'E2', 'K1'],
                        'ue': 136,
                    },
                    {
                        'label': 'Profiljahr',
                        'period': 'MÄR 2027 – AUG 2028',
                        'modules': ['T1', 'T2', 'T3', 'T4', 'T5', 'K2', 'K4', 'K6'],
                        'ue': 280,
                    },
                    {
                        'label': 'Abschluss',
                        'period': 'JAN 2028 – AUG 2028',
                        'modules': ['P2', 'P3', 'P6'],
                        'ue': 80,
                    },
                ],
                'total_ue': 496,
                'duration': '24 Monate',
                'module_count': 14,
            },
        },
        'z15e_vertiefung': {
            'events': [
                {'key': 'e1_1', 'label': 'E1'},
                {'key': 'e2_69', 'label': 'E2'},
            ],
        },
        'k1_didaktik_und_theorie': {'meta': META_LOCKED},
        't1_intro': {'meta': META_LOCKED},
        't2_coaching': {'meta': META_LOCKED},
        't3_praxisprojekte': {'meta': META_LOCKED},
        't4_didaktik': {'meta': META_LOCKED},
        'p2_praxisprojekt': {'meta': META_LOCKED},
        'p3_abschlussarbeit': {'meta': META_LOCKED},
        'p6_praxispruefung': {'meta': META_LOCKED},
        'berufsabschluss': {'meta': META_LOCKED},
    },
}


def main():
    dry_run = '--dry-run' in sys.argv
    if dry_run:
        print('=== DRY RUN MODE ===\n')

    agenda_dir = os.path.normpath(AGENDA_DIR)
    total_items = 0
    total_files = 0

    for filename, item_additions in FILES.items():
        filepath = os.path.join(agenda_dir, filename)
        if not os.path.exists(filepath):
            print(f'\nERROR: {filepath} not found')
            continue
        process_file(filepath, item_additions, dry_run=dry_run)
        total_items += len(item_additions)
        total_files += 1

    print(f'\n=== DONE: {total_items} items across {total_files} files ===')


if __name__ == '__main__':
    main()
