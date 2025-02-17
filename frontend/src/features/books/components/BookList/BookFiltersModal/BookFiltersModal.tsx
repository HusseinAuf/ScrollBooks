import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import useCommonDataContext from "../../../../../contexts/CommonDataContext";
import Button from "../../../../../components/common/buttons/Button";
import Select from "../../../../../components/common/Select/Select";

interface BookFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: any;
  filters: any;
}

const BookFiltersModal: React.FC<BookFilterModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  filters,
}) => {
  const { categories, languages } = useCommonDataContext();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    filters.categories
  );
  const [selectedRating, setSelectedRating] = useState<number>(filters.rating);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    filters.language
  );

  const handleCategoryChange = (categoryID: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryID)
        ? prev.filter((c) => c !== categoryID)
        : [...prev, categoryID]
    );
  };

  const handleApplyFilters = () => {
    onApplyFilters({
      categories: selectedCategories,
      rating: selectedRating,
      language: selectedLanguage,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-white rounded-lg p-6 w-96 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-darkBlue font-bold">Filter Books</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        <div className="mb-4">
          <div className="flex gap-1 items-center mb-2">
            <h3 className="font-semibold text-mediumBlue">Categories</h3>
            <div className="text-sm text-gray-700">
              ({selectedCategories.length})
            </div>
          </div>
          <div className="h-40 overflow-auto">
            {categories.map((category: any) => (
              <label key={category.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                  className="form-checkbox w-4 h-4 appearance-none border-2 border-gray-500 rounded-md bg-white checked:bg-mediumBlue checked:border-mediumBlue"
                />
                <span>{category.display_name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-mediumBlue mb-2">Rating</h3>
          <Select
            value={selectedRating}
            onChange={(e) => setSelectedRating(parseFloat(e.target.value))}
          >
            <option value={0}>All Ratings</option>
            <option value={4.5}>4.5 & above</option>
            <option value={4.0}>4.0 & above</option>
            <option value={3.5}>3.5 & above</option>
            <option value={3.0}>3.0 & above</option>
          </Select>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-mediumBlue mb-2">Language</h3>
          <Select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            <option value="">All Languages</option>
            {languages.map((language: any) => (
              <option key={language.code} value={language.code}>
                {language.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex justify-end space-x-2">
          <Button onClick={onClose} className="!text-sm">
            Cancel
          </Button>
          <Button
            onClick={handleApplyFilters}
            className="!bg-darkBlue !text-sm"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookFiltersModal;
