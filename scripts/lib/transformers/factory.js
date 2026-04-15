import { existsSync } from 'fs';
import { join } from 'path';
import { generateYamlFrontmatter, replacePlaceholders } from '../utils.js';

/**
 * Create a transformer function for a given provider config.
 * Returns a function that transforms a skill for that provider.
 */
export function createTransformer(config) {
  // Check for provider-specific override
  const overridePath = join(import.meta.dirname, 'overrides', `${config.provider}.js`);
  let override = null;
  if (existsSync(overridePath)) {
    // Dynamic import would be used here; for now, flag it
    override = overridePath;
  }

  return function transformSkill(skill) {
    // Generate frontmatter with only the fields this provider supports
    const frontmatter = generateYamlFrontmatter(
      skill.frontmatter,
      config.frontmatterFields
    );

    // Replace placeholders in body
    const body = replacePlaceholders(skill.body, config.placeholders);

    // Combine
    const content = `${frontmatter}\n${body}`;

    return {
      name: skill.name,
      content,
      referenceFiles: skill.referenceFiles,
      provider: config.provider,
      configDir: config.configDir,
      hasOverride: override !== null,
    };
  };
}
