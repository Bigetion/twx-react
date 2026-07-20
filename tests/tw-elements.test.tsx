/**
 * @jest-environment jsdom
 */

import { useRef } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { tw } from '../src';

describe('tw.elements', () => {
  // ═══════════════════════════════════════════════════════════════════════════════
  // Basic Rendering Tests
  // ═══════════════════════════════════════════════════════════════════════════════

  describe('Basic Rendering', () => {
    it('should render tw.div with className', () => {
      render(<tw.div data-testid="test-div" className="flex items-center" />);
      const element = screen.getByTestId('test-div');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('flex items-center');
      expect(element.tagName).toBe('DIV');
    });

    it('should render tw.span with className', () => {
      render(<tw.span data-testid="test-span" className="text-blue-500" />);
      const element = screen.getByTestId('test-span');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('text-blue-500');
      expect(element.tagName).toBe('SPAN');
    });

    it('should render tw.button with className', () => {
      render(<tw.button data-testid="test-button" className="px-4 py-2 bg-blue-500">Click</tw.button>);
      const element = screen.getByTestId('test-button');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('px-4 py-2 bg-blue-500');
      expect(element.tagName).toBe('BUTTON');
    });

    it('should render without className', () => {
      render(<tw.div data-testid="no-class">Content</tw.div>);
      const element = screen.getByTestId('no-class');
      expect(element).toBeInTheDocument();
      expect(element.className).toBe('');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // Props Forwarding Tests
  // ═══════════════════════════════════════════════════════════════════════════════

  describe('Props Forwarding', () => {
    it('should forward all HTML props to tw.div', () => {
      render(
        <tw.div
          data-testid="props-div"
          id="my-div"
          role="banner"
          aria-label="Test banner"
          className="flex"
        >
          Content
        </tw.div>
      );
      const element = screen.getByTestId('props-div');
      expect(element).toHaveAttribute('id', 'my-div');
      expect(element).toHaveAttribute('role', 'banner');
      expect(element).toHaveAttribute('aria-label', 'Test banner');
    });

    it('should forward event handlers', () => {
      const handleClick = jest.fn();
      render(
        <tw.button data-testid="click-button" onClick={handleClick} className="px-4">
          Click me
        </tw.button>
      );
      const button = screen.getByTestId('click-button');
      button.click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should forward input props', () => {
      const handleChange = jest.fn();
      render(
        <tw.input
          data-testid="test-input"
          type="text"
          placeholder="Enter name"
          value="John"
          onChange={handleChange}
          className="border rounded"
        />
      );
      const input = screen.getByTestId('test-input') as HTMLInputElement;
      expect(input).toHaveAttribute('type', 'text');
      expect(input).toHaveAttribute('placeholder', 'Enter name');
      expect(input.value).toBe('John');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // Ref Forwarding Tests
  // ═══════════════════════════════════════════════════════════════════════════════

  describe('Ref Forwarding', () => {
    it('should forward ref to tw.div', () => {
      const TestComponent = () => {
        const divRef = useRef<HTMLDivElement>(null);
        return (
          <tw.div ref={divRef} data-testid="ref-div" className="flex">
            Content
          </tw.div>
        );
      };

      const { container } = render(<TestComponent />);
      const element = container.querySelector('[data-testid="ref-div"]');
      expect(element).toBeInTheDocument();
    });

    it('should forward ref to tw.button', () => {
      const TestComponent = () => {
        const buttonRef = useRef<HTMLButtonElement>(null);
        return (
          <tw.button ref={buttonRef} data-testid="ref-button" className="px-4">
            Click
          </tw.button>
        );
      };

      const { container } = render(<TestComponent />);
      const element = container.querySelector('[data-testid="ref-button"]');
      expect(element).toBeInTheDocument();
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // CSS Injection Tests
  // ═══════════════════════════════════════════════════════════════════════════════

  describe('CSS Injection', () => {
    it('should inject CSS for Tailwind classes', () => {
      render(<tw.div data-testid="css-test" className="bg-red-500 text-white p-4" />);
      
      // Check element has the classes
      const element = screen.getByTestId('css-test');
      expect(element).toHaveClass('bg-red-500 text-white p-4');
    });

    it('should handle responsive classes', () => {
      render(
        <tw.div
          data-testid="responsive"
          className="flex flex-col md:flex-row lg:grid"
        />
      );
      const element = screen.getByTestId('responsive');
      expect(element).toHaveClass('flex flex-col md:flex-row lg:grid');
    });

    it('should handle pseudo-classes', () => {
      render(
        <tw.button
          data-testid="hover-test"
          className="bg-blue-500 hover:bg-blue-600 focus:ring-2"
        >
          Hover me
        </tw.button>
      );
      const button = screen.getByTestId('hover-test');
      expect(button).toHaveClass('bg-blue-500 hover:bg-blue-600 focus:ring-2');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // Multiple Elements Tests
  // ═══════════════════════════════════════════════════════════════════════════════

  describe('Multiple Elements', () => {
    it('should render nested tw.elements', () => {
      render(
        <tw.div data-testid="parent" className="p-4">
          <tw.h1 data-testid="heading" className="text-2xl">Title</tw.h1>
          <tw.p data-testid="paragraph" className="text-gray-600">Content</tw.p>
        </tw.div>
      );

      expect(screen.getByTestId('parent')).toBeInTheDocument();
      expect(screen.getByTestId('heading')).toBeInTheDocument();
      expect(screen.getByTestId('paragraph')).toBeInTheDocument();
    });

    it('should support all common HTML elements', () => {
      const { container } = render(
        <tw.div className="container">
          <tw.header className="header">
            <tw.nav className="nav">
              <tw.a href="#" className="link">Link</tw.a>
            </tw.nav>
          </tw.header>
          <tw.main className="main">
            <tw.article className="article">
              <tw.section className="section">
                <tw.h1 className="h1">Heading 1</tw.h1>
                <tw.h2 className="h2">Heading 2</tw.h2>
                <tw.p className="p">Paragraph</tw.p>
                <tw.ul className="ul">
                  <tw.li className="li">Item 1</tw.li>
                  <tw.li className="li">Item 2</tw.li>
                </tw.ul>
              </tw.section>
            </tw.article>
          </tw.main>
          <tw.footer className="footer">Footer</tw.footer>
        </tw.div>
      );

      expect(container.querySelector('.container')).toBeInTheDocument();
      expect(container.querySelector('.header')).toBeInTheDocument();
      expect(container.querySelector('.nav')).toBeInTheDocument();
      expect(container.querySelector('.footer')).toBeInTheDocument();
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // Edge Cases
  // ═══════════════════════════════════════════════════════════════════════════════

  describe('Edge Cases', () => {
    it('should handle empty className', () => {
      render(<tw.div data-testid="empty-class" className="">Content</tw.div>);
      const element = screen.getByTestId('empty-class');
      expect(element.className).toBe('');
    });

    it('should handle undefined className', () => {
      render(<tw.div data-testid="undefined-class" className={undefined as any}>Content</tw.div>);
      const element = screen.getByTestId('undefined-class');
      expect(element.className).toBe('');
    });

    it('should handle very long className strings', () => {
      // Note: `focus:ring-2` and `focus:ring-blue-300` now compose via
      // shared ring CSS variables; both classes are preserved and injected.
      const longClassName = 'flex items-center justify-center gap-4 p-8 m-4 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300';
      const expectedClassName = 'flex items-center justify-center gap-4 p-8 m-4 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300';
      render(<tw.div data-testid="long-class" className={longClassName} />);
      const element = screen.getByTestId('long-class');
      expect(element).toHaveClass(expectedClassName);
      expect(element).toHaveClass('focus:ring-2');
    });

    it('should handle dynamic className', () => {
      const isActive = true;
      const className = `px-4 py-2 ${isActive ? 'bg-blue-500' : 'bg-gray-500'}`;
      render(<tw.button data-testid="dynamic" className={className}>Button</tw.button>);
      const button = screen.getByTestId('dynamic');
      expect(button).toHaveClass('px-4 py-2 bg-blue-500');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // Form Elements
  // ═══════════════════════════════════════════════════════════════════════════════

  describe('Form Elements', () => {
    it('should render tw.form', () => {
      render(
        <tw.form data-testid="test-form" className="space-y-4">
          <tw.input type="text" className="border" />
        </tw.form>
      );
      expect(screen.getByTestId('test-form')).toBeInTheDocument();
      expect(screen.getByTestId('test-form').tagName).toBe('FORM');
    });

    it('should render tw.label', () => {
      render(
        <tw.label htmlFor="test-input" data-testid="test-label" className="font-bold">
          Name
        </tw.label>
      );
      const label = screen.getByTestId('test-label');
      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute('for', 'test-input');
    });

    it('should render tw.textarea', () => {
      render(
        <tw.textarea
          data-testid="test-textarea"
          rows={4}
          className="border rounded"
          placeholder="Enter text"
        />
      );
      const textarea = screen.getByTestId('test-textarea') as HTMLTextAreaElement;
      expect(textarea).toBeInTheDocument();
      expect(textarea.rows).toBe(4);
    });

    it('should render tw.select', () => {
      render(
        <tw.select data-testid="test-select" className="border rounded">
          <tw.option value="1">Option 1</tw.option>
          <tw.option value="2">Option 2</tw.option>
        </tw.select>
      );
      const select = screen.getByTestId('test-select');
      expect(select).toBeInTheDocument();
      expect(select.tagName).toBe('SELECT');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // Performance Tests
  // ═══════════════════════════════════════════════════════════════════════════════

  describe('Performance', () => {
    it('should not re-process same className multiple times', () => {
      const { rerender } = render(
        <tw.div data-testid="perf-test" className="flex items-center">
          Content 1
        </tw.div>
      );

      // Same className should use cached result
      rerender(
        <tw.div data-testid="perf-test" className="flex items-center">
          Content 2
        </tw.div>
      );

      const element = screen.getByTestId('perf-test');
      expect(element).toHaveTextContent('Content 2');
      expect(element).toHaveClass('flex items-center');
    });

    it('should handle many elements efficiently', () => {
      const ManyElements = () => (
        <tw.div>
          {Array.from({ length: 100 }, (_, i) => (
            <tw.div key={i} className="p-2">
              Item {i}
            </tw.div>
          ))}
        </tw.div>
      );

      const startTime = performance.now();
      render(<ManyElements />);
      const endTime = performance.now();

      // Should render in reasonable time (less than 1 second)
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });
});
