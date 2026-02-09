'use client'

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { MenuItem } from '@/config/mobilemenu';

interface CustomMobileMenuProps {
  items: MenuItem[];
  onClose: () => void;
}

// Custom Accordion Item component with controlled state
const AccordionItem = ({
  id,
  title,
  children,
  link,
  isOpen,
  onToggle,
  onClose
}: {
  id: string;
  title: string;
  children?: React.ReactNode;
  link?: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) => {
  if (!children) {
    // Leaf node (no children) - Top Level
    return (
      <div className="px-5 py-4">
        {link ? (
          <Link
            href={link}
            className="block text-gray-800 text-xl uppercase"
            onClick={onClose}
          >
            {title}
          </Link>
        ) : (
          <span className="text-xl uppercase">{title}</span>
        )}
      </div>
    );
  }

  // Node with children - Top Level
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        className="flex justify-between items-center w-full px-5 py-4 text-left text-xl font-normal uppercase"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <span 
          className="transition-transform duration-300 ease-out"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <ChevronDown size={20} />
        </span>
      </button>

      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{
          maxHeight: isOpen ? '500px' : '0px',
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="px-5 pb-3">
          {children}
        </div>
      </div>
    </div>
  );
};

// Nested Accordion Item (for deeper levels if needed)
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
  const paddingLeftClass = `pl-${5 + depth * 2}`;

  if (!children) {
    // Leaf node (no children) - Nested
    return (
      <div className={`py-3 ${paddingLeftClass}`}>
        {link ? (
          <Link
            href={link}
            className="block text-gray-600 hover:text-blue-600 text-lg uppercase"
            onClick={onClose}
          >
            {title}
          </Link>
        ) : (
          <span className="text-lg uppercase">{title}</span>
        )}
      </div>
    );
  }

  // Node with children - Nested
  return (
    <div className="mt-1">
      <button
        className={`flex justify-between items-center w-full py-3 ${paddingLeftClass} pr-2 text-left text-lg font-normal uppercase`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <span 
          className="transition-transform duration-300 ease-out"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <ChevronDown size={20} />
        </span>
      </button>

      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{
          maxHeight: isOpen ? '500px' : '0px',
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className={`pl-${(depth + 1) * 2}`}>
          {children.map((item, index) => (
            <div key={index} className="py-2">
              {item.children ? (
                <NestedAccordionItem
                  title={item.title}
                  children={item.children}
                  link={item.link}
                  depth={depth + 1}
                  onClose={onClose}
                />
              ) : (
                <div className="py-2">
                  {item.link ? (
                    <Link
                      href={item.link}
                      className="block text-gray-600 hover:text-blue-600 text-lg uppercase"
                      onClick={onClose}
                    >
                      {item.title}
                    </Link>
                  ) : (
                    <span className="text-lg uppercase">{item.title}</span>
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
  // Track which accordion is open (only one at a time)
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  const handleToggle = (itemId: string) => {
    // If clicking the same item, close it; otherwise open the new one
    setOpenItemId(prev => prev === itemId ? null : itemId);
  };

  return (
    <div className="w-full bg-white">
      {items.map((item) => (
        <div key={item.id} className="bg-white">
          {item.children ? (
            // Top-level item with children
            <AccordionItem
              id={item.id}
              title={item.title}
              isOpen={openItemId === item.id}
              onToggle={() => handleToggle(item.id)}
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
                      depth={1}
                      onClose={onClose}
                    />
                  ) : (
                    // Second-level item without children (simple link/span)
                    <div className="py-3 pl-5 bg-white">
                      {child.link ? (
                        <Link
                          href={child.link}
                          className="block text-gray-600 cursor-pointer text-lg uppercase"
                          onClick={onClose}
                        >
                          {child.title}
                        </Link>
                      ) : (
                        <span className="text-lg uppercase">{child.title}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </AccordionItem>
          ) : (
            // Top-level item without children
            <AccordionItem
              id={item.id}
              title={item.title}
              link={item.link}
              isOpen={false}
              onToggle={() => {}}
              onClose={onClose}
            />
          )}
        </div>
      ))}
    </div>
  );
}