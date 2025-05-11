"use client"

import React, { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Search } from "lucide-react"
import SearchContent from "./SearchContent"

export default function SearchButton() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <button className="cursor-pointer">
          <Search/>
        </button>
      </DrawerTrigger>
      <DrawerContent className="h-[90vh]">
        <div className="mx-auto w-full max-w-5xl h-full">
          <DrawerHeader className="pb-2">
            <VisuallyHidden>
              <DrawerTitle>Search</DrawerTitle>
            </VisuallyHidden>
            <div className="w-full flex justify-center">
              <Input 
                type="search" 
                placeholder="Search..." 
                className="w-full max-w-lg text-lg"
                autoFocus
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </DrawerHeader>
          {/* Content area with search results */}
          <div className="px-4 py-2 w-full h-[calc(90vh-80px)] overflow-y-auto">
            <SearchContent searchTerm={searchTerm} />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}