import { useState, useMemo } from "react";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { X, Search, Sprout, CheckCircle2 } from "lucide-react";
import { Card } from "./ui/card";

interface CropSelectorProps {
  selectedCrops: string[];
  onCropsChange: (crops: string[]) => void;
  label?: string;
}

// Comprehensive Tanzanian crops organized by category
const CROP_CATEGORIES = {
  "Cereals": [
    "Maize (Mahindi)", 
    "Rice (Mchele)", 
    "Wheat (Ngano)", 
    "Sorghum (Mtama)", 
    "Finger Millet (Ulezi)",
    "Pearl Millet (Uwele)"
  ],
  "Legumes": [
    "Beans (Maharagwe)", 
    "Cowpeas (Kunde)", 
    "Groundnuts (Karanga)", 
    "Pigeon Peas (Mbaazi)",
    "Chickpeas (Dengu)",
    "Green Grams (Choroko)",
    "Soybeans (Soya)"
  ],
  "Root & Tuber Crops": [
    "Cassava (Muhogo)", 
    "Sweet Potatoes (Viazi Vitamu)", 
    "Irish Potatoes (Viazi Mviringo)",
    "Yams (Kiazi Kikuu)",
    "Cocoyams (Madumbe)"
  ],
  "Vegetables": [
    "Tomatoes (Nyanya)", 
    "Onions (Vitunguu)", 
    "Cabbage (Kabichi)", 
    "Carrots (Karoti)",
    "African Spinach (Mchicha)",
    "Kale (Sukuma Wiki)",
    "Eggplant (Biringanya)",
    "Sweet Peppers (Pilipili Hoho)",
    "Hot Peppers (Pilipili Kali)",
    "Cucumbers (Matango)",
    "Pumpkins (Malenge)",
    "Okra (Bamia)",
    "Amaranth (Terere)"
  ],
  "Fruits": [
    "Bananas (Ndizi)", 
    "Mangoes (Maembe)", 
    "Avocados (Parachichi)", 
    "Oranges (Machungwa)",
    "Pineapples (Nanasi)",
    "Papayas (Papai)",
    "Watermelons (Tikiti Maji)",
    "Passion Fruits (Maparachichi)",
    "Lemons (Ndimu)",
    "Coconuts (Nazi)"
  ],
  "Cash Crops": [
    "Coffee (Kahawa)", 
    "Tea (Chai)", 
    "Cotton (Pamba)", 
    "Tobacco (Tumbaku)",
    "Cashew Nuts (Korosho)",
    "Sisal (Katani)",
    "Sunflower (Alizeti)",
    "Sesame (Ufuta)",
    "Sugarcane (Miwa)",
    "Pyrethrum",
    "Vanilla (Vanila)"
  ],
  "Spices & Herbs": [
    "Cloves (Karafuu)",
    "Cardamom (Iliki)",
    "Black Pepper (Pilipili Manga)",
    "Ginger (Tangawizi)",
    "Turmeric (Bizari)",
    "Cinnamon (Mdalasini)"
  ]
};

// Flatten all crops for searching
const ALL_CROPS = Object.entries(CROP_CATEGORIES).flatMap(([category, crops]) =>
  crops.map(crop => ({ name: crop, category }))
);

export function CropSelector({ selectedCrops, onCropsChange, label }: CropSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Filter crops based on search query
  const filteredCrops = useMemo(() => {
    if (!searchQuery.trim()) {
      return ALL_CROPS;
    }
    const query = searchQuery.toLowerCase();
    return ALL_CROPS.filter(crop => 
      crop.name.toLowerCase().includes(query) ||
      crop.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Group filtered crops by category
  const groupedFilteredCrops = useMemo(() => {
    const groups: Record<string, string[]> = {};
    filteredCrops.forEach(crop => {
      if (!groups[crop.category]) {
        groups[crop.category] = [];
      }
      groups[crop.category].push(crop.name);
    });
    return groups;
  }, [filteredCrops]);

  const toggleCrop = (crop: string) => {
    if (selectedCrops.includes(crop)) {
      onCropsChange(selectedCrops.filter(c => c !== crop));
    } else {
      onCropsChange([...selectedCrops, crop]);
    }
  };

  const removeCrop = (crop: string) => {
    onCropsChange(selectedCrops.filter(c => c !== crop));
  };

  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2">
        <Sprout className="h-4 w-4" />
        {label || "Crops You Grow"}
      </Label>

      {/* Selected Crops Tags */}
      {selectedCrops.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-green-50 rounded-lg border border-green-100">
          {selectedCrops.map((crop) => (
            <Badge 
              key={crop} 
              variant="secondary" 
              className="bg-green-600 text-white hover:bg-green-700 pl-3 pr-2 py-1.5 text-sm"
            >
              {crop}
              <button
                type="button"
                onClick={() => removeCrop(crop)}
                className="ml-2 hover:bg-green-700 rounded-full p-0.5 transition-colors"
                aria-label={`Remove ${crop}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search crops... (e.g., maize, vegetables, mahindi)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            // Delay to allow click events on crop items
            setTimeout(() => setIsFocused(false), 200);
          }}
          className="pl-10 pr-4"
        />
      </div>

      {/* Crops Dropdown */}
      {isFocused && (
        <Card className="max-h-80 overflow-y-auto shadow-lg border-2">
          <div className="p-2 space-y-3">
            {Object.keys(groupedFilteredCrops).length > 0 ? (
              Object.entries(groupedFilteredCrops).map(([category, crops]) => (
                <div key={category}>
                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 rounded">
                    {category}
                  </div>
                  <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {crops.map((crop) => {
                      const isSelected = selectedCrops.includes(crop);
                      return (
                        <button
                          key={crop}
                          type="button"
                          onClick={() => toggleCrop(crop)}
                          className={`
                            text-left px-3 py-2 rounded text-sm transition-colors
                            ${isSelected 
                              ? 'bg-green-100 text-green-800 font-medium' 
                              : 'hover:bg-gray-100'
                            }
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <span>{crop}</span>
                            {isSelected && (
                              <span className="text-green-600">✓</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                <Sprout className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No crops found matching &quot;{searchQuery}&quot;</p>
                <p className="text-xs mt-1">Try searching in English or Swahili</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Quick Select Popular Crops (when not searching) */}
      {!isFocused && selectedCrops.length === 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">Popular crops:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "Maize (Mahindi)",
              "Rice (Mchele)",
              "Beans (Maharagwe)",
              "Tomatoes (Nyanya)",
              "Cassava (Muhogo)",
              "Bananas (Ndizi)"
            ].map((crop) => (
              <button
                key={crop}
                type="button"
                onClick={() => toggleCrop(crop)}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-full hover:bg-green-50 hover:border-green-300 transition-colors"
              >
                + {crop}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Helper Text */}
      <p className="text-xs text-gray-500">
        {selectedCrops.length === 0 
          ? "Click the search box to browse all crops or select from popular options above"
          : `${selectedCrops.length} crop${selectedCrops.length !== 1 ? 's' : ''} selected`
        }
      </p>
    </div>
  );
}