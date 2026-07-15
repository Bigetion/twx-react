/**
 * Example: Class Grouping Syntax
 *
 * Demonstrates the shorthand grouping syntax that makes Tailwind classes
 * more readable and DRY:
 *
 * - Variant Grouping:  hover:(bg-blue-600 text-white)
 * - Nested Grouping:   dark:(hover:(bg-gray-700 text-white))
 * - Important Grouping: !(bg-red-500 text-white)
 * - Negative Grouping:  -(mt-4 ml-2)
 */

import React, { useState } from 'react';
import { tw } from '../src';

export function ClassGroupingExamples() {
  return (
    <tw.div className="space-y-12">
      <Section1_VariantGrouping />
      <Section2_ResponsiveGrouping />
      <Section3_NestedGrouping />
      <Section4_SpecialGrouping />
      <Section5_RealWorldComparison />
    </tw.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Section 1: Variant Grouping
// ═══════════════════════════════════════════════════════════════════════════════

function Section1_VariantGrouping() {
  return (
    <tw.section className="space-y-6">
      <tw.h2 className="text-3xl font-bold text-gray-900">
        Variant Grouping
      </tw.h2>

      <tw.p className="text-gray-600 text-lg">
        Group multiple classes under a single variant prefix using parentheses.
      </tw.p>

      <tw.div className="flex flex-wrap gap-4">
        {/* Hover grouping */}
        <tw.button className="
          px-6 py-3 rounded-lg font-semibold
          bg-blue-500 text-white
          hover:(bg-blue-600 shadow-lg scale-105)
          transition-all duration-200
        ">
          Hover me (grouped)
        </tw.button>

        {/* Focus grouping */}
        <tw.button className="
          px-6 py-3 rounded-lg font-semibold
          bg-green-500 text-white
          focus:(ring-4 ring-green-300 ring-offset-2 outline-none)
          transition-all
        ">
          Focus me (grouped)
        </tw.button>

        {/* Active grouping */}
        <tw.button className="
          px-6 py-3 rounded-lg font-semibold
          bg-purple-500 text-white
          active:(scale-95 bg-purple-700 shadow-inner)
          transition-all
        ">
          Press me (grouped)
        </tw.button>

        {/* Disabled grouping */}
        <tw.button
          disabled
          className="
            px-6 py-3 rounded-lg font-semibold
            bg-gray-500 text-white
            disabled:(opacity-50 cursor-not-allowed)
          "
        >
          Disabled (grouped)
        </tw.button>
      </tw.div>

      <tw.pre className="p-4 bg-gray-900 text-gray-100 rounded-lg text-sm overflow-x-auto">
        <tw.code>{`// Instead of repeating the variant:
className="hover:bg-blue-600 hover:shadow-lg hover:scale-105"

// Use grouping:
className="hover:(bg-blue-600 shadow-lg scale-105)"`}</tw.code>
      </tw.pre>
    </tw.section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Section 2: Responsive Grouping
// ═══════════════════════════════════════════════════════════════════════════════

function Section2_ResponsiveGrouping() {
  return (
    <tw.section className="space-y-6">
      <tw.h2 className="text-3xl font-bold text-gray-900">
        Responsive Grouping
      </tw.h2>

      <tw.p className="text-gray-600 text-lg">
        Group responsive breakpoint classes together for cleaner layouts.
      </tw.p>

      {/* Responsive layout demo */}
      <tw.div className="
        flex flex-col gap-4 p-4 bg-gray-100 rounded-xl
        sm:(flex-row flex-wrap)
        md:(gap-6)
        lg:(gap-8 max-w-4xl)
      ">
        <tw.div className="
          flex-1 p-6 bg-white rounded-lg shadow-sm min-w-0
          sm:(min-w-[200px])
          md:(min-w-[250px])
        ">
          <tw.h3 className="font-bold text-gray-900 sm:(text-lg) md:(text-xl)">Card 1</tw.h3>
          <tw.p className="text-gray-600 mt-2">Responsive grouping makes breakpoint classes clean.</tw.p>
        </tw.div>

        <tw.div className="
          flex-1 p-6 bg-white rounded-lg shadow-sm min-w-0
          sm:(min-w-[200px])
          md:(min-w-[250px])
        ">
          <tw.h3 className="font-bold text-gray-900 sm:(text-lg) md:(text-xl)">Card 2</tw.h3>
          <tw.p className="text-gray-600 mt-2">No more repeating sm:, md:, lg: for every class.</tw.p>
        </tw.div>

        <tw.div className="
          flex-1 p-6 bg-white rounded-lg shadow-sm min-w-0
          sm:(min-w-[200px])
          md:(min-w-[250px])
        ">
          <tw.h3 className="font-bold text-gray-900 sm:(text-lg) md:(text-xl)">Card 3</tw.h3>
          <tw.p className="text-gray-600 mt-2">Group related responsive styles together.</tw.p>
        </tw.div>
      </tw.div>

      <tw.pre className="p-4 bg-gray-900 text-gray-100 rounded-lg text-sm overflow-x-auto">
        <tw.code>{`// Instead of:
className="sm:flex-row sm:flex-wrap md:gap-6 lg:gap-8 lg:max-w-4xl"

// Use grouping:
className="sm:(flex-row flex-wrap) md:(gap-6) lg:(gap-8 max-w-4xl)"`}</tw.code>
      </tw.pre>
    </tw.section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Section 3: Nested Grouping
// ═══════════════════════════════════════════════════════════════════════════════

function Section3_NestedGrouping() {
  return (
    <tw.section className="space-y-6">
      <tw.h2 className="text-3xl font-bold text-gray-900">
        Nested Grouping
      </tw.h2>

      <tw.p className="text-gray-600 text-lg">
        Nest groups inside groups for complex variant combinations.
      </tw.p>

      <tw.div className="flex flex-wrap gap-4">
        {/* Dark mode with hover */}
        <tw.button className="
          px-6 py-3 rounded-lg font-semibold transition-all
          bg-white text-gray-900 border border-gray-200
          hover:(bg-gray-50 border-gray-300)
          dark:(bg-gray-800 text-white border-gray-700 hover:(bg-gray-700 border-gray-600))
        ">
          Dark + Hover (nested)
        </tw.button>

        {/* Responsive with state */}
        <tw.button className="
          px-4 py-2 rounded-lg font-medium transition-all
          bg-indigo-500 text-white text-sm
          hover:(bg-indigo-600)
          md:(px-6 py-3 text-base hover:(shadow-lg scale-105))
        ">
          Responsive + Hover (nested)
        </tw.button>
      </tw.div>

      <tw.pre className="p-4 bg-gray-900 text-gray-100 rounded-lg text-sm overflow-x-auto">
        <tw.code>{`// Nested: dark mode + hover state
className="dark:(bg-gray-800 text-white hover:(bg-gray-700 text-gray-100))"

// Expands to:
// dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-gray-100

// Triple nesting:
className="dark:(md:(hover:(bg-gray-700 text-white)))"
// → dark:md:hover:bg-gray-700 dark:md:hover:text-white`}</tw.code>
      </tw.pre>
    </tw.section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Section 4: Special Grouping (!important and negative)
// ═══════════════════════════════════════════════════════════════════════════════

function Section4_SpecialGrouping() {
  return (
    <tw.section className="space-y-6">
      <tw.h2 className="text-3xl font-bold text-gray-900">
        Special Grouping (! and -)
      </tw.h2>

      <tw.p className="text-gray-600 text-lg">
        Group important (!) and negative (-) modifiers for multiple classes at once.
      </tw.p>

      <tw.div className="space-y-4">
        {/* Important grouping */}
        <tw.div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <tw.h4 className="font-bold text-yellow-900 mb-2">!important Grouping</tw.h4>
          <tw.div className="!(p-6 bg-yellow-100 rounded border-2 border-yellow-400)">
            <tw.p className="text-yellow-800">
              This element uses <tw.code className="bg-yellow-200 px-1 rounded">!(p-6 bg-yellow-100 rounded)</tw.code> to
              apply !important to all grouped classes at once.
            </tw.p>
          </tw.div>
        </tw.div>

        {/* Negative grouping */}
        <tw.div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <tw.h4 className="font-bold text-blue-900 mb-2">Negative Grouping</tw.h4>
          <tw.div className="relative h-32 bg-blue-100 rounded overflow-hidden">
            <tw.div className="absolute bottom-0 right-0 w-16 h-16 bg-blue-500 rounded -(mb-2 mr-2)">
            </tw.div>
            <tw.p className="absolute top-4 left-4 text-blue-800 text-sm">
              Blue box uses <tw.code className="bg-blue-200 px-1 rounded">-(mb-2 mr-2)</tw.code> for negative margins
            </tw.p>
          </tw.div>
        </tw.div>
      </tw.div>

      <tw.pre className="p-4 bg-gray-900 text-gray-100 rounded-lg text-sm overflow-x-auto">
        <tw.code>{`// Important grouping:
className="!(bg-red-500 text-white p-4)"
// → !bg-red-500 !text-white !p-4

// Negative grouping:
className="-(mt-4 ml-2 translate-x-1)"
// → -mt-4 -ml-2 -translate-x-1`}</tw.code>
      </tw.pre>
    </tw.section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Section 5: Real-World Comparison
// ═══════════════════════════════════════════════════════════════════════════════

function Section5_RealWorldComparison() {
  const [isActive, setIsActive] = useState(false);

  return (
    <tw.section className="space-y-6">
      <tw.h2 className="text-3xl font-bold text-gray-900">
        Real-World: Before vs After
      </tw.h2>

      <tw.div className="grid grid-cols-2 gap-8">
        {/* Before */}
        <tw.div className="space-y-4">
          <tw.h3 className="text-xl font-bold text-red-700">
            ❌ Without Grouping (Verbose)
          </tw.h3>
          <tw.pre className="p-4 bg-gray-900 text-gray-100 rounded-lg text-xs overflow-x-auto">
            <tw.code>{`<tw.button className="
  px-4 py-2 rounded-lg font-medium
  bg-blue-500 text-white
  hover:bg-blue-600
  hover:shadow-lg
  hover:scale-105
  focus:ring-2
  focus:ring-blue-300
  focus:ring-offset-2
  active:scale-95
  active:bg-blue-700
  disabled:opacity-50
  disabled:cursor-not-allowed
  disabled:pointer-events-none
  dark:bg-blue-600
  dark:hover:bg-blue-500
  sm:text-sm
  sm:px-3
  sm:py-1.5
  md:text-base
  md:px-4
  md:py-2
  lg:text-lg
  lg:px-6
  lg:py-3
">`}</tw.code>
          </tw.pre>
        </tw.div>

        {/* After */}
        <tw.div className="space-y-4">
          <tw.h3 className="text-xl font-bold text-green-700">
            ✅ With Grouping (Clean)
          </tw.h3>
          <tw.pre className="p-4 bg-gray-900 text-gray-100 rounded-lg text-xs overflow-x-auto">
            <tw.code>{`<tw.button className="
  px-4 py-2 rounded-lg font-medium
  bg-blue-500 text-white
  hover:(bg-blue-600 shadow-lg scale-105)
  focus:(ring-2 ring-blue-300 ring-offset-2)
  active:(scale-95 bg-blue-700)
  disabled:(opacity-50 cursor-not-allowed
    pointer-events-none)
  dark:(bg-blue-600 hover:bg-blue-500)
  sm:(text-sm px-3 py-1.5)
  md:(text-base px-4 py-2)
  lg:(text-lg px-6 py-3)
">`}</tw.code>
          </tw.pre>
        </tw.div>
      </tw.div>

      {/* Live demo button */}
      <tw.div className="flex flex-col items-center gap-4 p-8 bg-gray-50 rounded-xl">
        <tw.p className="text-gray-600 font-medium">Live Demo (using grouped syntax):</tw.p>
        <tw.button
          onClick={() => setIsActive(!isActive)}
          className="
            px-6 py-3 rounded-xl font-semibold transition-all duration-200
            bg-gradient-to-r from-blue-500 to-purple-600 text-white
            hover:(shadow-xl scale-105 from-blue-600 to-purple-700)
            focus:(ring-4 ring-purple-300 ring-offset-2 outline-none)
            active:(scale-95)
          "
        >
          {isActive ? '✨ Active!' : 'Click me'}
        </tw.button>

        <tw.p className="text-sm text-gray-500 mt-2">
          Savings: ~30% fewer characters, much more readable
        </tw.p>
      </tw.div>
    </tw.section>
  );
}
