/**
 * Internal Parser Module
 * Parses Tailwind class strings into structured format
 * 
 * @internal
 */

export interface ParsedClass {
  utility: string;
  value?: string;
  variants: string[];
  modifiers: string[];
  arbitrary?: boolean;
}

/**
 * Parse a Tailwind class string into structured components
 * 
 * @param className - The Tailwind class string to parse
 * @returns Parsed class structure
 */

/**
 * Known compound Tailwind values that contain hyphens.
 * When the parser splits on the last hyphen and the resulting "value" looks
 * like part of a compound value, we check this set to decide whether to
 * re-join the last two segments into a compound value.
 * 
 * e.g., "cursor-not-allowed" → last-hyphen split gives utility "cursor-not", value "allowed"
 *       But "not-allowed" is in this set, so we re-combine: utility "cursor", value "not-allowed"
 */
const KNOWN_COMPOUND_VALUES = new Set([
  // Cursor values
  'not-allowed', 'context-menu', 'vertical-text', 'no-drop',
  'all-scroll', 'col-resize', 'row-resize', 'n-resize', 'e-resize',
  's-resize', 'w-resize', 'ne-resize', 'nw-resize', 'se-resize',
  'sw-resize', 'ew-resize', 'ns-resize', 'nesw-resize', 'nwse-resize',
  'zoom-in', 'zoom-out',
  // Touch action values
  'pan-x', 'pan-left', 'pan-right', 'pan-y', 'pan-up', 'pan-down', 'pinch-zoom',
  // Background position values
  'left-bottom', 'left-top', 'right-bottom', 'right-top',
  // Grid flow values
  'row-dense', 'col-dense',
  // Object-fit compound value
  'scale-down',
]);

/**
 * Gradient color utilities that should preserve color family-shade format.
 * e.g., "from-indigo-600" should be parsed as utility="from", value="indigo-600"
 * not as utility="from-indigo", value="600"
 */
const GRADIENT_COLOR_UTILITIES = new Set(['from', 'via', 'to']);

export function parseClassName(className: string): ParsedClass {
  if (!className || typeof className !== 'string') {
    return {
      utility: '',
      variants: [],
      modifiers: [],
    };
  }

  // Trim whitespace
  const trimmed = className.trim();
  if (!trimmed) {
    return {
      utility: '',
      variants: [],
      modifiers: [],
    };
  }

  const modifiers: string[] = [];
  const variants: string[] = [];
  let workingClass = trimmed;

  // Extract variant prefixes (e.g., "sm:", "md:", "hover:", "@lg:")
  // These are prefixes that end with ":" before the utility
  // Examples: "sm:px-4", "md:hover:bg-blue-500", "@lg:flex"
  while (workingClass.includes(':')) {
    const colonIndex = workingClass.indexOf(':');
    const prefix = workingClass.substring(0, colonIndex);
    
    // Check if this is a valid variant prefix (not part of an arbitrary value)
    // Valid prefixes: alphanumeric with optional @ at start
    if (/^@?[\w-]+$/.test(prefix)) {
      variants.push(prefix);
      workingClass = workingClass.substring(colonIndex + 1);
    } else {
      // Not a variant prefix, stop extraction
      break;
    }
  }

  // Check for negative values (e.g., "-m-4", "-translate-x-2")
  if (workingClass.startsWith('-') && workingClass.length > 1) {
    modifiers.push('negative');
    workingClass = workingClass.substring(1);
  }

  // Check for arbitrary values in square brackets (e.g., "w-[200px]", "bg-[#ff0000]")
  // Also check for arbitrary CSS properties (e.g., "[text-decoration:underline]")
  const arbitraryMatch = workingClass.match(/\[([^\]]+)\]/);
  const hasArbitrary = arbitraryMatch !== null;

  // Extract utility name and value
  // For classes like "px-4", "bg-blue-500", "w-[200px]", "[text-decoration:underline]"
  let utility = '';
  let value: string | undefined;

  if (hasArbitrary) {
    const arbitraryContent = arbitraryMatch[1];
    const beforeBracket = workingClass.substring(0, workingClass.indexOf('['));
    
    // Check if this is an arbitrary CSS property: [property:value]
    // Arbitrary CSS properties have no prefix before brackets and contain a colon
    if (!beforeBracket && arbitraryContent.includes(':')) {
      // Arbitrary CSS property: "[text-decoration:underline]"
      // Split on first colon to get property and value
      const colonIndex = arbitraryContent.indexOf(':');
      utility = arbitraryContent.substring(0, colonIndex);
      value = arbitraryContent.substring(colonIndex + 1);
      // Keep arbitrary flag but don't wrap in brackets since it's a CSS property
    } else {
      // For arbitrary values: "w-[200px]" → utility: "w", value: "[200px]"
      if (beforeBracket.endsWith('-')) {
        utility = beforeBracket.substring(0, beforeBracket.length - 1);
      } else {
        utility = beforeBracket;
      }
      value = '[' + arbitraryContent + ']';
    }
  } else {
    // For regular classes: split by last hyphen to separate utility and value
    // "px-4" → utility: "px", value: "4"
    // "bg-blue-500" → utility: "bg-blue", value: "500"
    
    // Special handling for gradient color utilities (from-, via-, to-)
    // "from-indigo-600" should be: utility: "from", value: "indigo-600"
    const firstHyphenIndex = workingClass.indexOf('-');
    if (firstHyphenIndex > 0) {
      const potentialGradientUtility = workingClass.substring(0, firstHyphenIndex);
      if (GRADIENT_COLOR_UTILITIES.has(potentialGradientUtility)) {
        utility = potentialGradientUtility;
        value = workingClass.substring(firstHyphenIndex + 1);
        return { utility, value, variants, modifiers, arbitrary: hasArbitrary ? true : undefined };
      }
    }
    
    const lastHyphenIndex = workingClass.lastIndexOf('-');
    
    if (lastHyphenIndex > 0) {
      const potentialValue = workingClass.substring(lastHyphenIndex + 1);
      const potentialUtility = workingClass.substring(0, lastHyphenIndex);
      
      // Check if the last segment is a value (number, color name, alphanumeric, or includes slash for opacity)
      // This handles cases like "bg-blue-500" vs standalone utilities like "flex"
      // Also handles opacity modifier: "bg-red-500/50" where potentialValue is "500/50"
      if (/^[\w/.]+$/.test(potentialValue)) {
        // Check if the potential value + previous segment forms a known compound value
        // e.g., "cursor-not-allowed" → potentialValue = "allowed", penultimate = "not"
        //       "not-allowed" is in KNOWN_COMPOUND_VALUES, so use "cursor" + "not-allowed"
        const prevHyphenIndex = potentialUtility.lastIndexOf('-');
        if (prevHyphenIndex > 0) {
          const penultimateSegment = potentialUtility.substring(prevHyphenIndex + 1);
          const candidateCompound = `${penultimateSegment}-${potentialValue}`;
          if (KNOWN_COMPOUND_VALUES.has(candidateCompound)) {
            // Re-split at the earlier hyphen: utility is everything before penultimate segment
            utility = potentialUtility.substring(0, prevHyphenIndex);
            value = candidateCompound;
          } else {
            utility = potentialUtility;
            value = potentialValue;
          }
        } else {
          utility = potentialUtility;
          value = potentialValue;
        }
      } else {
        // If no clear value pattern, treat the whole thing as utility
        utility = workingClass;
      }
    } else {
      // No hyphen found (e.g., "flex", "block", "container")
      utility = workingClass;
    }
  }

  return {
    utility,
    value,
    variants,
    modifiers,
    arbitrary: hasArbitrary ? true : undefined,
  };
}

/**
 * Parse multiple class strings
 * 
 * @param classNames - Array of class strings
 * @returns Array of parsed classes
 */
export function parseClassNames(classNames: string[]): ParsedClass[] {
  return classNames.map(parseClassName);
}
