/**
 * Example: tw.element API
 * 
 * Demonstrates the new tw.element syntax for cleaner component styling
 * without explicitly calling tw() function
 */

import React, { useState } from 'react';
import { tw } from '../src';

export function TwElementsExamples() {
  return (
    <tw.div className="space-y-12">
      <Section1_BasicUsage />
      <Section2_InteractiveCard />
      <Section3_FormExample />
      <Section4_ComparisonExample />
    </tw.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Section 1: Basic Usage
// ═══════════════════════════════════════════════════════════════════════════════

function Section1_BasicUsage() {
  return (
    <tw.section className="space-y-6">
      <tw.h2 className="text-3xl font-bold text-gray-900">
        Basic tw.element Usage
      </tw.h2>
      
      <tw.p className="text-gray-600 text-lg">
        Use <tw.code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">tw.div</tw.code>, 
        <tw.code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono ml-1">tw.span</tw.code>, etc.
        instead of <tw.code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono ml-1">{'className={tw(...)}'}</tw.code>
      </tw.p>

      <tw.div className="grid grid-cols-3 gap-4">
        <tw.div className="p-6 bg-blue-100 rounded-lg">
          <tw.h3 className="font-semibold text-blue-900">Blue Card</tw.h3>
          <tw.p className="text-blue-700 mt-2">Using tw.div and tw.p</tw.p>
        </tw.div>

        <tw.div className="p-6 bg-green-100 rounded-lg">
          <tw.h3 className="font-semibold text-green-900">Green Card</tw.h3>
          <tw.p className="text-green-700 mt-2">Much cleaner syntax</tw.p>
        </tw.div>

        <tw.div className="p-6 bg-purple-100 rounded-lg">
          <tw.h3 className="font-semibold text-purple-900">Purple Card</tw.h3>
          <tw.p className="text-purple-700 mt-2">No more tw() wrapper</tw.p>
        </tw.div>
      </tw.div>
    </tw.section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Section 2: Interactive Card with State
// ═══════════════════════════════════════════════════════════════════════════════

function Section2_InteractiveCard() {
  const [likes, setLikes] = useState(42);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return (
    <tw.section className="space-y-6">
      <tw.h2 className="text-3xl font-bold text-gray-900">
        Interactive Components
      </tw.h2>

      <tw.article className="max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <tw.img 
          src="https://picsum.photos/400/200?random=1" 
          alt="Random" 
          className="w-full h-48 object-cover"
        />
        
        <tw.div className="p-6">
          <tw.h3 className="text-xl font-bold text-gray-900">
            Beautiful Landscape
          </tw.h3>
          
          <tw.p className="text-gray-600 mt-2">
            This card is built entirely with tw.element components. 
            No tw() function calls needed!
          </tw.p>

          <tw.div className="flex items-center gap-4 mt-4">
            <tw.button
              onClick={handleLike}
              className={`
                px-4 py-2 rounded-lg font-semibold transition-colors
                ${isLiked 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }
              `}
            >
              {isLiked ? '❤️' : '🤍'} {likes} Likes
            </tw.button>

            <tw.button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors">
              Share
            </tw.button>
          </tw.div>
        </tw.div>
      </tw.article>
    </tw.section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Section 3: Form Example
// ═══════════════════════════════════════════════════════════════════════════════

function Section3_FormExample() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Form submitted! Check console.');
  };

  return (
    <tw.section className="space-y-6">
      <tw.h2 className="text-3xl font-bold text-gray-900">
        Form with tw.elements
      </tw.h2>

      <tw.form 
        onSubmit={handleSubmit}
        className="max-w-md bg-white rounded-xl shadow-lg p-6 space-y-4"
      >
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
    </tw.section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Section 4: Comparison (Old vs New)
// ═══════════════════════════════════════════════════════════════════════════════

function Section4_ComparisonExample() {
  return (
    <tw.section className="space-y-6">
      <tw.h2 className="text-3xl font-bold text-gray-900">
        Old vs New API Comparison
      </tw.h2>

      <tw.div className="grid grid-cols-2 gap-8">
        {/* Old Way */}
        <tw.div className="space-y-4">
          <tw.h3 className="text-xl font-bold text-gray-700">
            ❌ Old Way (Still Works)
          </tw.h3>
          <tw.pre className="p-4 bg-gray-900 text-gray-100 rounded-lg text-sm overflow-x-auto">
            <tw.code>{`<div className={tw('flex gap-4')}>
  <h1 className={tw('text-2xl')}>
    Title
  </h1>
  <button className={tw('px-4 py-2')}>
    Click
  </button>
</div>`}</tw.code>
          </tw.pre>
        </tw.div>

        {/* New Way */}
        <tw.div className="space-y-4">
          <tw.h3 className="text-xl font-bold text-green-700">
            ✅ New Way (Recommended)
          </tw.h3>
          <tw.pre className="p-4 bg-gray-900 text-gray-100 rounded-lg text-sm overflow-x-auto">
            <tw.code>{`<tw.div className="flex gap-4">
  <tw.h1 className="text-2xl">
    Title
  </tw.h1>
  <tw.button className="px-4 py-2">
    Click
  </tw.button>
</tw.div>`}</tw.code>
          </tw.pre>
        </tw.div>
      </tw.div>

      <tw.div className="p-6 bg-green-50 border-l-4 border-green-500 rounded">
        <tw.h4 className="font-bold text-green-900 mb-2">
          ✨ Benefits
        </tw.h4>
        <tw.ul className="space-y-2 text-green-800">
          <tw.li className="flex items-start gap-2">
            <tw.span className="font-bold">•</tw.span>
            <tw.span>Cleaner syntax - no more tw() wrapper</tw.span>
          </tw.li>
          <tw.li className="flex items-start gap-2">
            <tw.span className="font-bold">•</tw.span>
            <tw.span>Better readability - className looks like normal HTML</tw.span>
          </tw.li>
          <tw.li className="flex items-start gap-2">
            <tw.span className="font-bold">•</tw.span>
            <tw.span>Full TypeScript support - all HTML props work</tw.span>
          </tw.li>
          <tw.li className="flex items-start gap-2">
            <tw.span className="font-bold">•</tw.span>
            <tw.span>Automatic ref forwarding</tw.span>
          </tw.li>
          <tw.li className="flex items-start gap-2">
            <tw.span className="font-bold">•</tw.span>
            <tw.span>Performance optimized with React.memo</tw.span>
          </tw.li>
        </tw.ul>
      </tw.div>
    </tw.section>
  );
}
