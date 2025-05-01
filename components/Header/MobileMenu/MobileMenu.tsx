'use client'

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react'; // Removed ChevronRight as it wasn't used
import { MenuItem } from '@/config/mobilemenu'; // Assuming this path is correct

interface CustomMobileMenuProps {
  items: MenuItem[];
  onClose: () => void;
}

// Custom Accordion Item component
const AccordionItem = ({
  title,
  children,
  link,
  onClose
}: {
  title: string;
  children?: React.ReactNode;
  link?: string;
  onClose: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!children) {
    // Leaf node (no children) - Top Level
    return (
      <div className="px-5 py-4"> {/* Maintained padding */}
        {link ? (
          <Link
            href={link}
            className="block text-gray-800 text-xl uppercase" // Reduced from 2xl to xl
            onClick={onClose}
          >
            {title}
          </Link>
        ) : (
          <span className="text-xl uppercase">{title}</span> // Reduced from 2xl to xl
        )}
      </div>
    );
  }

  // Node with children - Top Level
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        className="flex justify-between items-center w-full px-5 py-4 text-left text-xl font-normal uppercase" // Reduced from 2xl to xl
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <span className="transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <ChevronDown size={20} /> {/* Reduced from 24 to 20 */}
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96' : 'max-h-0' // max-h might need adjustment if content is very long
        }`}
      >
        <div className="px-5 pb-3"> {/* Maintained padding */}
          {children}
        </div>
      </div>
    </div>
  );
};

// Nested Accordion Item
const NestedAccordionItem = ({
  title,
  children,
  link,
  depth = 0,
  onClose
}: {
  title: string;
  children?: any[];
  link?: string;
  depth?: number;
  onClose: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const paddingLeftClass = `pl-${5 + depth * 2}`; // Base padding 5 + depth indent

  if (!children) {
    // Leaf node (no children) - Nested
    return (
      <div className={`py-3 ${paddingLeftClass}`}> {/* Maintained padding */}
        {link ? (
          <Link
            href={link}
            className="block text-gray-600 hover:text-blue-600 text-lg uppercase" // Reduced from xl to lg
            onClick={onClose}
          >
            {title}
          </Link>
        ) : (
          <span className="text-lg uppercase">{title}</span> // Reduced from xl to lg
        )}
      </div>
    );
  }

  // Node with children - Nested
  return (
    <div className="mt-1">
      <button
        className={`flex justify-between items-center w-full py-3 ${paddingLeftClass} pr-2 text-left text-lg font-normal uppercase`} // Reduced from xl to lg
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <span className="transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <ChevronDown size={20} /> {/* Reduced from 24 to 20 */}
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96' : 'max-h-0' // max-h might need adjustment
        }`}
      >
        <div className={`pl-${(depth + 1) * 2}`}> {/* Indentation for children */}
          {children.map((item, index) => (
            <div key={index} className="py-2"> {/* Maintained padding */}
              {item.children ? (
                <NestedAccordionItem
                  title={item.title}
                  children={item.children}
                  link={item.link}
                  depth={depth + 1}
                  onClose={onClose}
                />
              ) : (
                <div className="py-2"> {/* Consistent padding */}
                  {item.link ? (
                    <Link
                      href={item.link}
                      className="block text-gray-600 hover:text-blue-600 text-lg uppercase" // Reduced from xl to lg
                      onClick={onClose}
                    >
                      {item.title}
                    </Link>
                  ) : (
                    <span className="text-lg uppercase">{item.title}</span> // Reduced from xl to lg
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Mobile Menu Component
export default function MobileMenu({ items, onClose }: CustomMobileMenuProps) {
  return (
    <div className="w-full bg-white">
      {items.map((item, index) => (
        <div key={index} className="bg-white">
          {item.children ? (
            // Top-level item with children
            <AccordionItem
              title={item.title}
              onClose={onClose}
            >
              {item.children?.map((child: any, childIndex: number) => (
                <div key={childIndex} className="bg-white">
                  {child.children ? (
                    // Second-level item with children (uses NestedAccordion)
                    <NestedAccordionItem
                      title={child.title}
                      children={child.children}
                      link={child.link}
                      depth={1} // Start nested depth at 1
                      onClose={onClose}
                    />
                  ) : (
                    // Second-level item without children (simple link/span)
                    <div className="py-3 pl-5 bg-white"> {/* Maintained padding */}
                      {child.link ? (
                        <Link
                          href={child.link}
                          className="block text-gray-600 cursor-pointer text-lg uppercase" // Reduced from xl to lg
                          onClick={onClose}
                        >
                          {child.title}
                        </Link>
                      ) : (
                        <span className="text-lg uppercase">{child.title}</span> // Reduced from xl to lg
                      )}
                    </div>
                  )}
                </div>
              ))}
            </AccordionItem>
          ) : (
            // Top-level item without children
            <AccordionItem
              title={item.title}
              link={item.link}
              onClose={onClose}
            />
          )}
        </div>
      ))}
    </div>
  );
}