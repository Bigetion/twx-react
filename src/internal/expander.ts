/**
 * expander.ts — ClassName shorthand expansion module
 *
 * Expands grouped class syntax into individual Tailwind-compatible tokens:
 *
 * 1. Variant Grouping:    hover:(bg-blue-500 text-white) → hover:bg-blue-500 hover:text-white
 * 2. Nested Grouping:     dark:(hover:(bg-gray-800)) → dark:hover:bg-gray-800
 * 3. Important Grouping:  !(bg-red-500 text-white) → !bg-red-500 !text-white
 * 4. Negative Grouping:   -(mt-4 ml-2) → -mt-4 -ml-2
 *
 * This module processes the className string BEFORE it's passed to the
 * tw() parsing pipeline, so expansion is transparent to the rest of the system.
 *
 * @internal
 */

// ═══════════════════════════════════════════════════════════════════════════════
// Cache for expanded strings
// ═══════════════════════════════════════════════════════════════════════════════

const expansionCache = new Map<string, string>();
const MAX_CACHE_SIZE = 1000;

// ═══════════════════════════════════════════════════════════════════════════════
// Core Expansion Logic
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Finds the matching closing parenthesis for an opening one,
 * handling nested parentheses correctly.
 */
function findClosingParen(str: string, startIndex: number): number {
  let depth = 0;
  for (let i = startIndex; i < str.length; i++) {
    if (str[i] === '(') {
      depth++;
    } else if (str[i] === ')') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1; // No matching closing paren found
}

/**
 * Tokenizes a grouped content string into individual tokens,
 * respecting nested groups and arbitrary values.
 *
 * "bg-blue-500 hover:(text-white scale-105) p-4"
 * → ["bg-blue-500", "hover:(text-white scale-105)", "p-4"]
 */
function tokenizeGroupContent(content: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let i = 0;

  while (i < content.length) {
    const ch = content[i];

    if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
      // Whitespace: flush current token
      if (current.length > 0) {
        tokens.push(current);
        current = '';
      }
      i++;
    } else if (ch === '(') {
      // Opening paren: find matching close and include everything
      const closeIndex = findClosingParen(content, i);
      if (closeIndex === -1) {
        // No matching close, treat rest as literal
        current += content.slice(i);
        i = content.length;
      } else {
        current += content.slice(i, closeIndex + 1);
        i = closeIndex + 1;
      }
    } else if (ch === '[') {
      // Arbitrary value bracket: find matching close
      const closeIndex = content.indexOf(']', i);
      if (closeIndex === -1) {
        current += content.slice(i);
        i = content.length;
      } else {
        current += content.slice(i, closeIndex + 1);
        i = closeIndex + 1;
      }
    } else {
      current += ch;
      i++;
    }
  }

  if (current.length > 0) {
    tokens.push(current);
  }

  return tokens;
}

/**
 * Expands a single group expression like "hover:(bg-blue-500 text-white)"
 * into "hover:bg-blue-500 hover:text-white"
 *
 * Handles:
 * - Simple: hover:(bg-blue-500 text-white)
 * - Nested: dark:(hover:(bg-gray-800 text-white) bg-gray-900)
 * - Important: !(bg-red-500 text-white)
 * - Negative: -(mt-4 ml-2)
 */
function expandSinglePass(input: string): string {
  let result = '';
  let i = 0;

  while (i < input.length) {
    // Skip whitespace and collect it
    if (input[i] === ' ' || input[i] === '\t' || input[i] === '\n' || input[i] === '\r') {
      result += input[i];
      i++;
      continue;
    }

    // Try to find a group pattern starting from current position
    // Pattern: prefix:(content) where prefix can be:
    //   - variant name: hover, focus, dark, sm, md, etc.
    //   - chained variants: dark:hover
    //   - ! (important)
    //   - - (negative)

    // Find the start of next token
    let tokenStart = i;
    let tokenEnd = i;

    // Read until whitespace or end
    while (tokenEnd < input.length && input[tokenEnd] !== ' ' && input[tokenEnd] !== '\t' && input[tokenEnd] !== '\n' && input[tokenEnd] !== '\r') {
      if (input[tokenEnd] === '(') {
        // Found opening paren within token - this might be a group
        const closeIndex = findClosingParen(input, tokenEnd);
        if (closeIndex === -1) {
          tokenEnd = input.length;
        } else {
          tokenEnd = closeIndex + 1;
        }
      } else if (input[tokenEnd] === '[') {
        // Arbitrary value - skip to closing bracket
        const closeIndex = input.indexOf(']', tokenEnd);
        if (closeIndex === -1) {
          tokenEnd = input.length;
        } else {
          tokenEnd = closeIndex + 1;
        }
      } else {
        tokenEnd++;
      }
    }

    const token = input.slice(tokenStart, tokenEnd);
    i = tokenEnd;

    // Check if this token contains a group pattern
    const expanded = expandToken(token);
    result += expanded;
  }

  return result;
}

/**
 * Expands a single token that might contain grouping syntax.
 *
 * Examples:
 *   "hover:(bg-blue-500 text-white)" → "hover:bg-blue-500 hover:text-white"
 *   "!(bg-red-500 text-white)" → "!bg-red-500 !text-white"
 *   "-(mt-4 ml-2)" → "-mt-4 -ml-2"
 *   "bg-blue-500" → "bg-blue-500" (no change)
 */
function expandToken(token: string): string {
  // Find the LAST occurrence of ':(' or just '(' at start for !/- modifiers
  // We need to find the group start correctly

  // Pattern 1: variant:(content) - e.g., hover:(bg-blue-500 text-white)
  // Pattern 2: !(content) - important grouping
  // Pattern 3: -(content) - negative grouping

  // Check for important grouping: !(...)
  if (token.startsWith('!(')) {
    const closeIndex = findClosingParen(token, 1);
    if (closeIndex === token.length - 1) {
      const content = token.slice(2, closeIndex);
      const innerTokens = tokenizeGroupContent(content);
      return innerTokens.map(t => `!${t}`).join(' ');
    }
  }

  // Check for negative grouping: -(...)
  if (token.startsWith('-(')) {
    const closeIndex = findClosingParen(token, 1);
    if (closeIndex === token.length - 1) {
      const content = token.slice(2, closeIndex);
      const innerTokens = tokenizeGroupContent(content);
      return innerTokens.map(t => `-${t}`).join(' ');
    }
  }

  // Check for variant grouping: prefix:(content)
  // Find the last ':(' pattern that opens a group
  const groupStart = findGroupStart(token);
  if (groupStart !== -1) {
    const prefix = token.slice(0, groupStart + 1); // includes the ':'
    const parenStart = groupStart + 1; // index of '('
    const closeIndex = findClosingParen(token, parenStart);

    if (closeIndex === token.length - 1) {
      const content = token.slice(parenStart + 1, closeIndex);
      const innerTokens = tokenizeGroupContent(content);
      return innerTokens.map(t => `${prefix}${t}`).join(' ');
    }
  }

  // No grouping found, return as-is
  return token;
}

/**
 * Finds the index of the ':' in a "prefix:(" group pattern.
 * Returns the index of ':', or -1 if no group pattern found.
 *
 * Must handle cases like:
 *   "hover:(bg-blue-500)" → finds ':' at index 5
 *   "dark:hover:(bg-blue-500)" → finds ':' at index 10
 *   "bg-[rgb(255,0,0)]" → returns -1 (arbitrary value, not a group)
 */
function findGroupStart(token: string): number {
  // Walk through the token looking for ':(' pattern
  // But skip over arbitrary values [...]
  let i = 0;
  let lastColonBeforeParen = -1;

  while (i < token.length) {
    if (token[i] === '[') {
      // Skip arbitrary value
      const closeIndex = token.indexOf(']', i);
      if (closeIndex === -1) break;
      i = closeIndex + 1;
    } else if (token[i] === ':' && i + 1 < token.length && token[i + 1] === '(') {
      lastColonBeforeParen = i;
      break; // Use first match (leftmost group)
    } else if (token[i] === ':') {
      // Could be part of a chained prefix like dark:hover:(...)
      // Continue scanning
      i++;
    } else {
      i++;
    }
  }

  // If we found a ':(' but need to verify it's the outermost group
  // for tokens like "dark:hover:(bg-blue-500)"
  // We want to find the ':' just before the '('
  if (lastColonBeforeParen === -1) {
    // Scan again looking for any ':(' deeper in the token
    for (let j = 0; j < token.length - 1; j++) {
      if (token[j] === '[') {
        const closeIndex = token.indexOf(']', j);
        if (closeIndex === -1) break;
        j = closeIndex;
        continue;
      }
      if (token[j] === ':' && token[j + 1] === '(') {
        lastColonBeforeParen = j;
      }
    }
  }

  return lastColonBeforeParen;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Public API
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Expands all grouping syntax in a className string.
 *
 * Supports:
 * - Variant grouping: hover:(bg-blue-500 text-white)
 * - Nested grouping: dark:(hover:(bg-gray-800 text-white) bg-gray-900)
 * - Important grouping: !(bg-red-500 text-white)
 * - Negative grouping: -(mt-4 ml-2)
 *
 * The expansion is recursive to handle nested groups:
 * "dark:(hover:(bg-gray-800 text-white))"
 * → First pass: "dark:hover:(bg-gray-800 text-white)"
 * → Second pass: "dark:hover:bg-gray-800 dark:hover:text-white"
 *
 * @param classString - Raw className that may contain grouping syntax
 * @returns Fully expanded className with all groups resolved
 */
export function expandClassName(classString: string): string {
  if (!classString) return '';

  // Check cache first
  const cached = expansionCache.get(classString);
  if (cached !== undefined) return cached;

  // Quick check: if no parentheses, nothing to expand
  if (!classString.includes('(')) {
    expansionCache.set(classString, classString);
    return classString;
  }

  // Iteratively expand until stable (handles nested groups)
  let result = classString;
  let prev = '';
  let iterations = 0;
  const MAX_ITERATIONS = 10; // Safety limit for deeply nested groups

  while (result !== prev && iterations < MAX_ITERATIONS) {
    prev = result;
    result = expandSinglePass(result);
    iterations++;
  }

  // Normalize whitespace
  result = result.replace(/\s+/g, ' ').trim();

  // Cache the result (with eviction)
  if (expansionCache.size >= MAX_CACHE_SIZE) {
    // Simple eviction: clear half the cache
    const entries = Array.from(expansionCache.keys());
    for (let i = 0; i < entries.length / 2; i++) {
      expansionCache.delete(entries[i]);
    }
  }
  expansionCache.set(classString, result);

  return result;
}
