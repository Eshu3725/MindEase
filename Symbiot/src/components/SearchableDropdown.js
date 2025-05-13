import React, { useState, useRef, useEffect } from 'react';

const SearchableDropdown = ({
  options,
  value,
  onChange,
  placeholder = "Search...",
  id,
  required = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Handle option selection
  const handleSelect = (option) => {
    onChange({ target: { value: option } });
    setIsOpen(false);
    setSearchTerm("");
  };

  // Handle keyboard navigation
  const handleKeyDown = (e, option = null) => {
    // Toggle dropdown with Enter or Space
    if ((e.key === 'Enter' || e.key === ' ') && option === null) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }

    // Select option with Enter or Space
    if ((e.key === 'Enter' || e.key === ' ') && option !== null) {
      e.preventDefault();
      handleSelect(option);
    }

    // Close dropdown with Escape
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Display selected value or placeholder
  const displayValue = value || placeholder;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center justify-between p-2 border border-gray-300 rounded cursor-pointer bg-white text-gray-700 w-full"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => handleKeyDown(e)}
        aria-controls="dropdown-list"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        id={`${id}-button`}
      >
        <span className={value ? "text-gray-900" : "text-gray-500"}>
          {displayValue}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute z-50 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto"
          id="dropdown-list"
        >
          <div className="sticky top-0 bg-white p-2 border-b">
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Type to search..."
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#66FCF1]"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {filteredOptions.length > 0 ? (
            <div
              className="max-h-48 overflow-y-auto"
              id={`${id}-listbox`}
            >
              {filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className="w-full text-left p-2 hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => handleSelect(option)}
                  onKeyDown={(e) => handleKeyDown(e, option)}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-2 text-gray-500 text-center">No results found</div>
          )}
        </div>
      )}

      {/* Hidden input for form submission */}
      <input
        type="hidden"
        id={id}
        value={value}
        required={required}
      />
    </div>
  );
};

export default SearchableDropdown;
