// Narrative export utilities

import type { Narrative } from '../types/narrative';

/**
 * Export narratives as JSON file
 */
export function exportToJSON(narratives: Narrative[], filename: string = 'narratives.json') {
  const dataStr = JSON.stringify(narratives, null, 2);
  downloadFile(dataStr, filename, 'application/json');
}

/**
 * Export narratives as CSV file
 */
export function exportToCSV(narratives: Narrative[], filename: string = 'narratives.csv') {
  const headers = [
    'ID',
    'Title',
    'Category',
    'Evidence Grade',
    'Confidence',
    'Summary',
    'Domains',
    'Tags',
    'Complexity Load',
    'Complexity Time',
    'Complexity Expertise',
    'Signals Count',
    'Relations Count',
    'Citations Count',
  ];

  const rows = narratives.map((n) => [
    n.narrative_id,
    `"${n.title.replace(/"/g, '""')}"`,
    n.category,
    n.evidence_quality,
    n.confidence || 0,
    `"${n.summary.replace(/"/g, '""')}"`,
    `"${n.domain?.join(', ') || ''}"`,
    `"${n.tags?.join(', ') || ''}"`,
    n.complexity?.cognitive_load || '',
    n.complexity?.time_to_elicit || '',
    n.complexity?.expertise_required || '',
    n.linked_signals?.length || 0,
    n.relationships?.length || 0,
    n.citations?.length || 0,
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  downloadFile(csvContent, filename, 'text/csv');
}

/**
 * Export narratives as Markdown file
 */
export function exportToMarkdown(narratives: Narrative[], filename: string = 'narratives.md') {
  const sections = narratives.map((n) => {
    const lines = [
      `# ${n.title}`,
      '',
      `**ID:** \`${n.narrative_id}\`  `,
      `**Category:** ${n.category}  `,
      `**Evidence Grade:** ${n.evidence_quality}  `,
      `**Confidence:** ${n.confidence ? (n.confidence * 100).toFixed(0) : '0'}%`,
      '',
      '## Summary',
      '',
      n.summary,
      '',
    ];

    if (n.complexity) {
      lines.push(
        '## Complexity',
        '',
        `- **Cognitive Load:** ${n.complexity.cognitive_load}`,
        `- **Time to Elicit:** ${n.complexity.time_to_elicit}`,
        `- **Expertise Required:** ${n.complexity.expertise_required}`,
        ''
      );
    }

    if (n.domain && n.domain.length > 0) {
      lines.push('## Domains', '', n.domain.map((d) => `- ${d}`).join('\n'), '');
    }

    if (n.tags && n.tags.length > 0) {
      lines.push('## Tags', '', n.tags.map((t) => `\`${t}\``).join(', '), '');
    }

    if (n.citations && n.citations.length > 0) {
      lines.push(
        '## Citations',
        '',
        ...n.citations.map((c, idx) => `${idx + 1}. ${c.author} (${c.year}). *${c.title}*. ${c.source}`),
        ''
      );
    }

    if (n.examples && n.examples.length > 0) {
      lines.push('## Examples', '');
      n.examples.forEach((ex, idx) => {
        lines.push(
          `### Example ${idx + 1}`,
          '',
          `**Scenario:** ${ex.scenario}`,
          '',
          `**Application:** ${ex.application}`,
          '',
          `**Outcome:** ${ex.outcome}`,
          ''
        );
      });
    }

    if (n.elicitation_methods && n.elicitation_methods.length > 0) {
      lines.push(
        '## Elicitation Methods',
        '',
        ...n.elicitation_methods.map(
          (m) => `- **${m.method}**: ${m.duration} (${m.difficulty} difficulty)`
        ),
        ''
      );
    }

    if (n.relationships && n.relationships.length > 0) {
      lines.push(
        '## Relationships',
        '',
        ...n.relationships.map((r) => `- **${r.type}** → ${r.target}: ${r.description}`),
        ''
      );
    }

    lines.push('---', '');
    return lines.join('\n');
  });

  const markdown = [
    `# HUMMBL Narratives Export`,
    '',
    `**Generated:** ${new Date().toISOString()}  `,
    `**Total Narratives:** ${narratives.length}`,
    '',
    '---',
    '',
    ...sections,
  ].join('\n');

  downloadFile(markdown, filename, 'text/markdown');
}

/**
 * Trigger file download in browser
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Get export filename with timestamp
 */
export function getExportFilename(format: 'json' | 'csv' | 'md', prefix: string = 'hummbl-narratives'): string {
  const timestamp = new Date().toISOString().split('T')[0];
  return `${prefix}-${timestamp}.${format}`;
}
