# twx-react Examples

Working code examples demonstrating the key features of twx-react. Each file is self-contained and shows a specific API in action.

## Examples

### [button.tsx](./button.tsx)

A Button component built with `createTwComponent`. Covers:
- Multiple variants: `size` (sm/md/lg), `color` (primary/secondary/danger), `variant` (solid/outline/ghost)
- Compound variants for combining conditions (e.g., solid + primary = blue bg + shadow)
- Default variant values
- Polymorphic `as` prop (rendering a button as an anchor tag)
- Ref forwarding
- `className` override for custom styling

### [card.tsx](./card.tsx)

A Card component built with `createTwSlots`. Covers:
- Multi-part slots: root, header, body, footer
- Shared variants that affect multiple slots simultaneously
- Compound variants for slot-specific conditional styling
- Using the slots function directly in a React component

### [tabs.tsx](./tabs.tsx)

A Tabs compound component built with `createTwCompound`. Covers:
- Multiple related sub-components: Root, List, Tab, Panel
- Per-part variants (active state on Tab, orientation on Root/List)
- Custom element types per part (`button` for Tab)
- Rendering compound components together with state management

### [theme-switching.tsx](./theme-switching.tsx)

Theme switching with the built-in theme system. Covers:
- Creating light/dark themes with `createTwTheme`
- Extending the default Tailwind theme with `createTwTheme.extend`
- Wrapping your app with `TwThemeProvider`
- Reading and switching themes at runtime with `useTwTheme`
- Consuming theme tokens via CSS variables

### [typescript-usage.tsx](./typescript-usage.tsx)

TypeScript type inference and type safety. Covers:
- `InferVariantProps` — extracting variant types from an existing component
- `InferComponentProps` — extracting the full props type
- Type-safe variant selection (compile-time enforcement)
- Type-safe compound variants
- Typed compound components with `createTwCompound`
- Shared variant type patterns

## Running the Examples

These examples are reference files that demonstrate the twx-react API. They import from `'twx-react'` and are valid TypeScript+JSX. To use them in a project:

1. Install twx-react in your React project
2. Copy the example code into your component files
3. Import and render the exported components

The examples are not standalone applications — they show API usage patterns you can adapt for your own components.
