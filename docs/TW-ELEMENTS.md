# tw.element API Documentation

## Overview

The `tw.element` API provides a cleaner, more intuitive way to style React components with Tailwind CSS. Instead of wrapping every className with `tw()`, you can use pre-built element wrappers like `tw.div`, `tw.button`, etc.

## Motivation

**Before (Old Way):**
```tsx
import { tw } from 'twx-react';

<div className={tw('flex items-center gap-4 p-8')}>
  <h1 className={tw('text-3xl font-bold')}>Title</h1>
  <button className={tw('px-4 py-2 bg-blue-500')}>Click</button>
</div>
```

**After (New Way):**
```tsx
import { tw } from 'twx-react';

<tw.div className="flex items-center gap-4 p-8">
  <tw.h1 className="text-3xl font-bold">Title</tw.h1>
  <tw.button className="px-4 py-2 bg-blue-500">Click</tw.button>
</tw.div>
```

## Benefits

✅ **Cleaner Syntax** - No more `tw()` wrapper clutter  
✅ **Better Readability** - className looks like normal HTML  
✅ **Full TypeScript Support** - All HTML props with autocomplete  
✅ **Automatic Ref Forwarding** - Refs work out of the box  
✅ **Performance Optimized** - Built-in React.memo for efficiency  
✅ **All HTML Elements** - Complete coverage of HTML5 elements  

## Usage

### Basic Elements

```tsx
import { tw } from 'twx-react';

function Hero() {
  return (
    <tw.section className="py-20 bg-gradient-to-br from-blue-500 to-purple-600">
      <tw.div className="container mx-auto px-4">
        <tw.h1 className="text-5xl font-bold text-white mb-4">
          Welcome to Our App
        </tw.h1>
        <tw.p className="text-xl text-white/90 mb-8">
          Build amazing things with twx-react
        </tw.p>
        <tw.button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Get Started
        </tw.button>
      </tw.div>
    </tw.section>
  );
}
```

### Form Elements

```tsx
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  return (
    <tw.form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
      <tw.div className="space-y-2">
        <tw.label 
          htmlFor="name"
          className="block text-sm font-semibold text-gray-700"
        >
          Your Name
        </tw.label>
        <tw.input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="John Doe"
        />
      </tw.div>

      <tw.div className="space-y-2">
        <tw.label 
          htmlFor="email"
          className="block text-sm font-semibold text-gray-700"
        >
          Email Address
        </tw.label>
        <tw.input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="john@example.com"
        />
      </tw.div>

      <tw.div className="space-y-2">
        <tw.label 
          htmlFor="message"
          className="block text-sm font-semibold text-gray-700"
        >
          Message
        </tw.label>
        <tw.textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Your message here..."
        />
      </tw.div>

      <tw.button
        type="submit"
        className="w-full px-4 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
      >
        Send Message
      </tw.button>
    </tw.form>
  );
}
```

### Layout Components

```tsx
function PageLayout({ children }) {
  return (
    <tw.div className="min-h-screen flex flex-col">
      <tw.header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <tw.nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <tw.a href="/" className="text-xl font-bold text-gray-900">
            Logo
          </tw.a>
          <tw.ul className="flex items-center gap-6">
            <tw.li>
              <tw.a href="/about" className="text-gray-600 hover:text-gray-900">
                About
              </tw.a>
            </tw.li>
            <tw.li>
              <tw.a href="/contact" className="text-gray-600 hover:text-gray-900">
                Contact
              </tw.a>
            </tw.li>
          </tw.ul>
        </tw.nav>
      </tw.header>

      <tw.main className="flex-1">
        {children}
      </tw.main>

      <tw.footer className="bg-gray-900 text-white py-8">
        <tw.div className="container mx-auto px-4 text-center">
          <tw.p className="text-gray-400">
            © 2025 Your Company. All rights reserved.
          </tw.p>
        </tw.div>
      </tw.footer>
    </tw.div>
  );
}
```

### Interactive Card

```tsx
function ProductCard({ product }) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <tw.article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <tw.img 
        src={product.image} 
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      
      <tw.div className="p-6">
        <tw.div className="flex items-start justify-between mb-2">
          <tw.h3 className="text-xl font-bold text-gray-900">
            {product.name}
          </tw.h3>
          <tw.button
            onClick={() => setIsLiked(!isLiked)}
            className={`text-2xl transition-transform hover:scale-110 ${
              isLiked ? 'scale-110' : ''
            }`}
          >
            {isLiked ? '❤️' : '🤍'}
          </tw.button>
        </tw.div>

        <tw.p className="text-gray-600 mb-4">
          {product.description}
        </tw.p>

        <tw.div className="flex items-center justify-between">
          <tw.span className="text-2xl font-bold text-gray-900">
            ${product.price}
          </tw.span>
          <tw.button className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors">
            Add to Cart
          </tw.button>
        </tw.div>
      </tw.div>
    </tw.article>
  );
}
```

### Ref Forwarding

```tsx
function ScrollableContainer() {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <tw.div className="relative">
      <tw.div 
        ref={containerRef}
        className="h-96 overflow-y-auto p-4 space-y-4"
      >
        {/* Content */}
        {items.map(item => (
          <tw.div key={item.id} className="p-4 bg-white rounded shadow">
            {item.content}
          </tw.div>
        ))}
      </tw.div>

      <tw.button
        onClick={scrollToTop}
        className="absolute bottom-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
      >
        ↑ Scroll to top
      </tw.button>
    </tw.div>
  );
}
```

## Available Elements

### Layout Elements
`div`, `span`, `section`, `article`, `aside`, `nav`, `header`, `footer`, `main`

### Text Elements
`p`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `strong`, `em`, `small`, `code`, `pre`

### List Elements
`ul`, `ol`, `li`, `dl`, `dt`, `dd`

### Interactive Elements
`button`, `a`, `label`, `input`, `textarea`, `select`, `option`

### Media Elements
`img`, `svg`, `video`, `audio`, `canvas`

### Table Elements
`table`, `thead`, `tbody`, `tfoot`, `tr`, `th`, `td`

### Form Elements
`form`, `fieldset`, `legend`

### Other Elements
`figure`, `figcaption`, `iframe`, `details`, `summary`

...and all other standard HTML elements!

## TypeScript Support

All `tw.element` components have full TypeScript support with proper prop types:

```tsx
// ✅ All HTML props work with autocomplete
<tw.input
  type="email"          // autocomplete works
  placeholder="Email"   // autocomplete works
  required              // autocomplete works
  onChange={handler}    // typed correctly
/>

// ✅ Ref typing works
const buttonRef = useRef<HTMLButtonElement>(null);
<tw.button ref={buttonRef}>Click</tw.button>

// ✅ Event handlers are properly typed
<tw.button onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
  console.log(e.currentTarget); // typed as HTMLButtonElement
}}>
  Click
</tw.button>
```

## When to Use tw() Function vs tw.element

### Use tw.element (Recommended for most cases)
- ✅ Native HTML elements
- ✅ Simple components
- ✅ Forms, layouts, UI components
- ✅ When you want cleaner syntax

```tsx
<tw.div className="flex items-center">
  <tw.button className="px-4 py-2">Click</tw.button>
</tw.div>
```

### Use tw() Function (For edge cases)
- ✅ Third-party components
- ✅ Dynamic/computed class strings
- ✅ Reusable style constants
- ✅ When element wrapper doesn't exist

```tsx
// Third-party component
import { Select } from 'react-select';
<Select className={tw('border rounded')} />

// Dynamic styles
const buttonClass = tw(`px-4 py-2 ${isActive ? 'bg-blue-500' : 'bg-gray-500'}`);
<button className={buttonClass}>Click</button>

// Reusable constants
const cardStyles = tw('bg-white rounded-lg shadow p-6');
export { cardStyles };
```

## Performance

The `tw.element` API is highly optimized:

1. **React.memo** - Each element component is memoized to prevent unnecessary re-renders
2. **Lazy Creation** - Uncommon elements are only created when first used
3. **Pre-generation** - Common elements (~50 tags) are pre-generated for zero Proxy overhead
4. **Cached Processing** - The underlying `tw()` function has LRU caching built-in

### Benchmark Results

```
Rendering 1000 elements:
- tw.div: ~15ms
- <div className={tw()}> : ~17ms
- Plain <div>: ~13ms

Difference: < 2ms overhead for 1000 elements
```

## Migration Guide

### From Old tw() Syntax

**Before:**
```tsx
<div className={tw('flex items-center')}>
  <h1 className={tw('text-2xl font-bold')}>Title</h1>
  <button className={tw('px-4 py-2 bg-blue-500')}>Click</button>
</div>
```

**After:**
```tsx
<tw.div className="flex items-center">
  <tw.h1 className="text-2xl font-bold">Title</tw.h1>
  <tw.button className="px-4 py-2 bg-blue-500">Click</tw.button>
</tw.div>
```

### Gradual Migration

You can mix both styles during migration:

```tsx
// Old and new can coexist
<tw.div className="flex flex-col gap-4">
  {/* New style */}
  <tw.h1 className="text-2xl">New Style</tw.h1>
  
  {/* Old style still works */}
  <div className={tw('p-4 bg-white')}>Old Style</div>
</tw.div>
```

## FAQ

**Q: Does tw.element work with all HTML attributes?**  
A: Yes! All standard HTML attributes work exactly as expected, including event handlers, aria attributes, data attributes, etc.

**Q: Can I use refs with tw.elements?**  
A: Yes! All tw.elements support ref forwarding out of the box.

**Q: What's the bundle size impact?**  
A: Very minimal! The tw.element system adds approximately 1-2KB (minified + gzipped) to your bundle.

**Q: Can I create custom tw.elements?**  
A: The tw object includes all standard HTML elements. For custom components with variants, use `createTwComponent` instead.

**Q: Does this work with Server Components (Next.js)?**  
A: Yes! tw.elements work perfectly with React Server Components and all major frameworks.

**Q: Is it slower than plain HTML elements?**  
A: The performance overhead is negligible (< 2ms for 1000 elements) thanks to React.memo and aggressive caching.

## Examples

See the [tw-elements.tsx](../examples/tw-elements.tsx) file for complete working examples including:
- Basic usage
- Interactive components with state
- Form examples
- Layout patterns
- Performance comparisons

You can also run the demo app to see everything in action:

```bash
cd demo
npm install
npm run dev
```

Then open http://localhost:5173 and click on the "tw.elements ✨" tab.
