'use client'

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { MenuItem } from '@/config/mobilemenu';

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
    return (
      <div className="px-4 py-3">
        {link ? (
          <Link 
            href={link} 
            className="block text-gray-800 text-xl"
            onClick={onClose}
          >
            {title}
          </Link>
        ) : (
          <span className="text-xl">{title}</span>
        )}
      </div>
    );
  }

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        className="flex justify-between items-center w-full px-4 py-3 text-left text-xl font-normal"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <span className="transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <ChevronDown size={20} />
        </span>
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="px-4 pb-2">
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

  if (!children) {
    return (
      <div className={`py-2 pl-${depth * 2}`}>
        {link ? (
          <Link 
            href={link} 
            className="block text-gray-600 hover:text-blue-600 text-xl"
            onClick={onClose}
          >
            {title}
          </Link>
        ) : (
          <span className="text-xl">{title}</span>
        )}
      </div>
    );
  }

  return (
    <div className="mt-1">
      <button
        className={`flex justify-between items-center w-full py-2 pl-${depth * 2} pr-2 text-left text-xl font-normal`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <span className="transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <ChevronDown size={20} />
        </span>
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className={`pl-${(depth + 1) * 2}`}>
          {children.map((item, index) => (
            <div key={index} className="py-1">
              {item.children ? (
                <NestedAccordionItem
                  title={item.title}
                  children={item.children}
                  link={item.link}
                  depth={depth + 1}
                  onClose={onClose}
                />
              ) : (
                <div className="py-1">
                  {item.link ? (
                    <Link 
                      href={item.link} 
                      className="block text-gray-600 hover:text-blue-600 text-xl"
                      onClick={onClose}
                    >
                      {item.title}
                    </Link>
                  ) : (
                    <span className="text-xl">{item.title}</span>
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

export default function MobileMenu({ items, onClose }: CustomMobileMenuProps) {
  return (
    <div className="w-full bg-white">
      {items.map((item, index) => (
        <div key={index} className="bg-white">
          {item.children ? (
            <AccordionItem 
              title={item.title}
              onClose={onClose}
            >
              {item.children?.map((child: any, childIndex: number) => (
                <div key={childIndex} className="bg-white">
                  {child.children ? (
                    <NestedAccordionItem
                      title={child.title}
                      children={child.children}
                      link={child.link}
                      onClose={onClose}
                    />
                  ) : (
                    <div className="py-2 pl-4 bg-white">
                      {child.link ? (
                        <Link 
                          href={child.link} 
                          className="block text-gray-600 cursor-pointer text-lg"
                          onClick={onClose}
                        >
                          {child.title}
                        </Link>
                      ) : (
                        <span className="text-lg">{child.title}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </AccordionItem>
          ) : (
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