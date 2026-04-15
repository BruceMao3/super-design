import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative } from 'path';

/**
 * Parse YAML frontmatter from a markdown file.
 * Returns { frontmatter: object, body: string }
 */
export function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const yamlStr = match[1];
  const body = match[2];

  // Simple YAML parser for flat key-value pairs
  const frontmatter = {};
  for (const line of yamlStr.split('\n')) {
    const kvMatch = line.match(/^(\S+):\s*(.+)$/);
    if (kvMatch) {
      let value = kvMatch[2].trim();
      // Remove surrounding quotes
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      // Parse booleans
      if (value === 'true') value = true;
      else if (value === 'false') value = false;

      frontmatter[kvMatch[1]] = value;
    }
  }

  return { frontmatter, body };
}

/**
 * Generate YAML frontmatter string from an object.
 * Only includes specified fields.
 */
export function generateYamlFrontmatter(data, fields) {
  const lines = ['---'];
  for (const field of fields) {
    if (data[field] !== undefined) {
      const value = data[field];
      if (typeof value === 'string') {
        lines.push(`${field}: "${value}"`);
      } else if (typeof value === 'boolean') {
        lines.push(`${field}: ${value}`);
      } else {
        lines.push(`${field}: ${value}`);
      }
    }
  }
  lines.push('---');
  return lines.join('\n');
}

/**
 * Replace placeholders in content with provider-specific values.
 */
export function replacePlaceholders(content, replacements) {
  let result = content;
  for (const [placeholder, value] of Object.entries(replacements)) {
    result = result.replaceAll(`{{${placeholder}}}`, value);
  }
  return result;
}

/**
 * Read all skills from the source directory.
 * Returns array of { name, dir, skillFile, frontmatter, body, referenceFiles }
 */
export function readSourceSkills(sourceDir) {
  const skillsDir = join(sourceDir, 'skills');
  const skills = [];

  for (const entry of readdirSync(skillsDir)) {
    const skillDir = join(skillsDir, entry);
    if (!statSync(skillDir).isDirectory()) continue;

    const skillFile = join(skillDir, 'SKILL.md');
    if (!existsSync(skillFile)) continue;

    const content = readFileSync(skillFile, 'utf-8');
    const { frontmatter, body } = parseFrontmatter(content);

    // Collect reference files
    const referenceFiles = [];
    const refDir = join(skillDir, 'reference');
    if (existsSync(refDir) && statSync(refDir).isDirectory()) {
      for (const refEntry of readdirSync(refDir)) {
        const refPath = join(refDir, refEntry);
        if (statSync(refPath).isFile()) {
          referenceFiles.push({
            name: refEntry,
            path: refPath,
            content: readFileSync(refPath, 'utf-8'),
          });
        }
      }
    }

    skills.push({
      name: entry,
      dir: skillDir,
      skillFile,
      frontmatter,
      body,
      referenceFiles,
    });
  }

  return skills;
}

/**
 * Validate skills against rules.
 * Returns array of { skill, rule, message } for failures.
 */
export function validateSkills(skills) {
  const errors = [];

  // Reference-Free Zone skills
  const referenceFreeSkills = [
    'design-essence', 'design-analysis', 'design-prototype',
    'figma-to-code', 'design-brainstorm',
  ];

  for (const skill of skills) {
    // Rule: name must be letters, numbers, hyphens only
    if (!/^[a-z0-9-]+$/.test(skill.name)) {
      errors.push({
        skill: skill.name,
        rule: 'naming',
        message: `Name "${skill.name}" contains invalid characters. Use only lowercase letters, numbers, hyphens.`,
      });
    }

    // Rule: description must start with "Use when"
    const desc = skill.frontmatter.description || '';
    if (!desc.startsWith('Use when')) {
      errors.push({
        skill: skill.name,
        rule: 'description',
        message: `Description must start with "Use when". Got: "${desc.slice(0, 50)}..."`,
      });
    }

    // Rule: Reference-Free Zone skills must not reference reference/*.md
    if (referenceFreeSkills.includes(skill.name)) {
      if (skill.body.includes('reference/') && skill.body.match(/reference\/\w+\.md/)) {
        errors.push({
          skill: skill.name,
          rule: 'reference-free',
          message: `Reference-Free Zone skill references reference/*.md files.`,
        });
      }
    }
  }

  return errors;
}
