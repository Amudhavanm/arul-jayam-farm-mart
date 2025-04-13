
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-3xl mx-auto mb-8">
      <Input
        type="text"
        placeholder="Search for agricultural machinery..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <Button type="submit" className="rounded-l-none">
        <Search size={18} className="mr-2" />
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
