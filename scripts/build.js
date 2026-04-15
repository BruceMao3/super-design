#!/usr/bin/env node

/**
 * Super Design Build System
 *
 * Reads skills from source/skills/, transforms for each provider,
 * writes to dist/<provider>/. Validates rules.
 *
 * Usage: node scripts/build.js [--provider <name>]
 */

import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { readSourceSkills, validateSkills, replacePlaceholders } from './lib/utils.js';
import { providers } from './lib/transformers/providers.js';
import { createTransformer } from './lib/transformers/factory.js';

const ROOT = join(import.meta.dirname, '..');
const SOURCE_DIR = join(ROOT, 'source');
const DIST_DIR = join(ROOT, 'dist');

// Parse args
const args = process.argv.slice(2);
const providerFilter = args.includes('--provider')
  ? args[args.indexOf('--provider') + 1]
  : null;

console.log('Super Design Build System');
console.log('========================\n');

// Step 1: Read all skills
console.log('Reading source skills...');
const skills = readSourceSkills(SOURCE_DIR);
console.log(`  Found ${skills.length} skills\n`);

// Step 2: Validate
console.log('Validating...');
const errors = validateSkills(skills);
if (errors.length > 0) {
  console.error('\nValidation FAILED:');
  for (const err of errors) {
    console.error(`  [${err.rule}] ${err.skill}: ${err.message}`);
  }
  process.exit(1);
}
console.log('  All validations passed\n');

// Step 3: Build for each provider
const targetProviders = providerFilter
  ? { [providerFilter]: providers[providerFilter] }
  : providers;

if (providerFilter && !providers[providerFilter]) {
  console.error(`Unknown provider: ${providerFilter}`);
  console.error(`Available: ${Object.keys(providers).join(', ')}`);
  process.exit(1);
}

for (const [providerName, config] of Object.entries(targetProviders)) {
  console.log(`Building for ${config.displayName}...`);

  const transformer = createTransformer(config);
  const providerDist = join(DIST_DIR, providerName, config.configDir, 'skills');

  // Clean and create dist directory
  mkdirSync(providerDist, { recursive: true });

  let builtCount = 0;

  for (const skill of skills) {
    const transformed = transformer(skill);

    // Create skill directory
    const skillDist = join(providerDist, skill.name);
    mkdirSync(skillDist, { recursive: true });

    // Write SKILL.md
    writeFileSync(join(skillDist, 'SKILL.md'), transformed.content);

    // Copy reference files
    if (skill.referenceFiles.length > 0) {
      const refDist = join(skillDist, 'reference');
      mkdirSync(refDist, { recursive: true });
      for (const ref of skill.referenceFiles) {
        const refContent = replacePlaceholders(ref.content, config.placeholders);
        writeFileSync(join(refDist, ref.name), refContent);
      }
    }

    builtCount++;
  }

  // Generate plugin manifest
  const manifestTemplate = readFileSync(join(SOURCE_DIR, 'plugin-manifest.json'), 'utf-8');
  const manifest = replacePlaceholders(manifestTemplate, config.placeholders);
  const pluginDir = join(DIST_DIR, providerName, config.pluginDir);
  mkdirSync(pluginDir, { recursive: true });
  writeFileSync(join(pluginDir, 'plugin.json'), manifest);

  // Validate reference paths in built output
  let refErrors = 0;
  for (const skill of skills) {
    const builtSkill = join(providerDist, skill.name, 'SKILL.md');
    if (!existsSync(builtSkill)) continue;

    const content = readFileSync(builtSkill, 'utf-8');
    const refMatches = content.matchAll(/reference\/([a-z0-9-]+\.md)/g);
    for (const match of refMatches) {
      // Check if this reference file exists somewhere in the built output
      const refFile = match[1];
      const expectedPath = join(providerDist, 'design-critique', 'reference', refFile);
      const localPath = join(providerDist, skill.name, 'reference', refFile);
      if (!existsSync(expectedPath) && !existsSync(localPath)) {
        console.error(`  ERROR: ${skill.name}/SKILL.md references reference/${refFile} but file not found`);
        refErrors++;
      }
    }
  }

  if (refErrors > 0) {
    console.error(`  ${refErrors} broken reference path(s) found`);
    process.exit(1);
  }

  console.log(`  Built ${builtCount} skills -> ${providerDist}`);
}

// Step 4: Copy hooks
console.log('\nCopying hooks...');
for (const [providerName, config] of Object.entries(targetProviders)) {
  const hooksSrc = join(ROOT, 'hooks');
  const hooksDist = join(DIST_DIR, providerName, 'hooks');
  if (existsSync(hooksSrc)) {
    cpSync(hooksSrc, hooksDist, { recursive: true });
  }
}

console.log('\nBuild complete!');
