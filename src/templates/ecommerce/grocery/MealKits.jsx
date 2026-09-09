import React, { useState, useMemo } from "react";
import {
  Utensils,
  Clock,
  Flame,
  Users,
  Check,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

export default function MealKits({ onAddToCart }) {
  const [selectedRecipeId, setSelectedRecipeId] = useState("truffle-pasta");
  const [servings, setServings] = useState(2);
  const [selectedIngredients, setSelectedIngredients] = useState([
    "ing-1",
    "ing-2",
    "ing-3",
    "ing-4",
  ]);

  const recipes = [
    {
      id: "truffle-pasta",
      name: "Tuscan Truffle & Wild Porcini Tagliatelle",
      tagline: "Restaurant-quality Italian feast in 20 minutes",
      prepTime: "20 Mins",
      difficulty: "Easy Chef",
      calories: "580 kcal",
      badge: "Chef's Signature",
      image:
        "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80",
      description:
        "Bronze-cut artisan tagliatelle tossed with sautéed cremini mushrooms, French black truffle butter, and 36-month aged Parmigiano Reggiano.",
      steps: [
        "Bring 4 quarts of salted water to a rolling boil and cook tagliatelle for 8–9 minutes until al dente.",
        "Sauté cremini mushrooms in truffle butter over medium-high heat until golden caramelized.",
        "Toss hot pasta directly in pan with 1/4 cup reserved pasta water and freshly grated Parmigiano.",
      ],
      ingredients: [
        {
          id: "ing-1",
          name: "Artisan Bronze-Cut Tagliatelle",
          baseQty: "500g",
          price: 4.5,
        },
        {
          id: "ing-2",
          name: "Fresh Organic Cremini Mushrooms",
          baseQty: "250g",
          price: 3.2,
        },
        {
          id: "ing-3",
          name: "Black Truffle Infused Butter",
          baseQty: "100g",
          price: 6.8,
        },
        {
          id: "ing-4",
          name: "Aged Parmigiano Reggiano Wedge",
          baseQty: "150g",
          price: 5.5,
        },
      ],
    },
    {
      id: "acai-bowl",
      name: "Superfood Organic Acai & Dragonfruit Bowl",
      tagline: "Antioxidant-dense tropical breakfast in 10 minutes",
      prepTime: "10 Mins",
      difficulty: "No Cook",
      calories: "340 kcal",
      badge: "Immunity Boost",
      image:
        "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=80",
      description:
        "Amazonian wild-harvested frozen acai puree topped with chia seed granola, fresh orchard blueberries, and raw mountain honeycomb.",
      steps: [
        "Blend frozen acai packets with 1/2 cup almond milk until thick and creamy smoothie bowl texture.",
        "Pour into bowl and arrange sprouted granola, fresh blueberries, and chia seeds across top.",
        "Drizzle generously with raw mountain wildflower honeycomb and serve immediately cold.",
      ],
      ingredients: [
        {
          id: "ing-1",
          name: "Organic Wild Acai Smoothie Packs",
          baseQty: "4ct (400g)",
          price: 7.0,
        },
        {
          id: "ing-2",
          name: "Ancient Grain Sprouted Granola",
          baseQty: "350g bag",
          price: 5.4,
        },
        {
          id: "ing-3",
          name: "Fresh Orchard Blueberries",
          baseQty: "170g punnet",
          price: 3.99,
        },
        {
          id: "ing-4",
          name: "Raw Mountain Honeycomb",
          baseQty: "250g jar",
          price: 8.5,
        },
      ],
    },
    {
      id: "salmon-bowl",
      name: "Mediterranean Herb-Crusted Wild Salmon",
      tagline: "Heart-healthy omega rich dinner in 25 minutes",
      prepTime: "25 Mins",
      difficulty: "Medium",
      calories: "620 kcal",
      badge: "Omega-3 Rich",
      image:
        "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80",
      description:
        "Pan-seared sustainably sourced salmon fillets served over warm organic tri-color quinoa, baby spinach, and early harvest Greek EVOO.",
      steps: [
        "Simmer quinoa in vegetable stock for 15 minutes until fluffy; fold in tender baby spinach.",
        "Season salmon fillets with sea salt and cracked pepper; pan-sear in EVOO 4 mins each side.",
        "Plate salmon atop quinoa bed and finish with a squeeze of fresh lemon and fresh dill.",
      ],
      ingredients: [
        {
          id: "ing-1",
          name: "Sustainably Sourced Salmon Fillets",
          baseQty: "2x 180g fillets",
          price: 14.5,
        },
        {
          id: "ing-2",
          name: "Organic Tri-Color Quinoa",
          baseQty: "300g pouch",
          price: 4.2,
        },
        {
          id: "ing-3",
          name: "Organic Baby Spinach Leaves",
          baseQty: "200g bag",
          price: 2.8,
        },
        {
          id: "ing-4",
          name: "Greek Kalamata Extra Virgin Olive Oil",
          baseQty: "250ml bottle",
          price: 8.0,
        },
      ],
    },
  ];

  const currentRecipe =
    recipes.find((r) => r.id === selectedRecipeId) || recipes[0];

  // Calculate kit total based on selected ingredients and servings
  const servingMultiplier = servings / 2;
  const kitTotal = useMemo(() => {
    const sum = currentRecipe.ingredients
      .filter((ing) => selectedIngredients.includes(ing.id))
      .reduce((total, ing) => total + ing.price, 0);
    return sum * servingMultiplier;
  }, [currentRecipe, selectedIngredients, servingMultiplier]);

  const toggleIngredient = (id) => {
    if (selectedIngredients.includes(id)) {
      setSelectedIngredients(selectedIngredients.filter((i) => i !== id));
    } else {
      setSelectedIngredients([...selectedIngredients, id]);
    }
  };

  const handleAddKitToCart = () => {
    const includedIngs = currentRecipe.ingredients.filter((i) =>
      selectedIngredients.includes(i.id)
    );
    if (includedIngs.length === 0) {
      toast.error("Please select at least one ingredient to build your kit.");
      return;
    }

    const kitProduct = {
      _id: `chefkit-${currentRecipe.id}-${Date.now()}`,
      name: `Chef Kit: ${currentRecipe.name} (${servings} Servings)`,
      price: kitTotal,
      image: currentRecipe.image,
      category: "Chef's Meal-Kits",
      unit: `${servings} Servings (${includedIngs.length} Ingredients)`,
      description: `Customized Kit includes: ${includedIngs.map((i) => i.name).join(", ")}.`,
    };

    if (onAddToCart) {
      onAddToCart(kitProduct, 1);
    }
    toast.success(`Complete ${currentRecipe.name} meal-kit added! 🍳`);
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 text-left font-sans animate-fade-in">
      {/* ================= 1. HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-emerald-950/10 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#15803D] text-xs font-bold">
            <Utensils size={14} />
            <span>INTERACTIVE CHEF RECIPE STUDIO</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Farm-Fresh Meal-Kits Ready in Under 25 Mins.
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            All organic ingredients pre-measured from local farms. Adjust your serving size, customize ingredients you already have at home, and add the full kit with 1 click.
          </p>
        </div>

        {/* Recipe Switcher Buttons */}
        <div className="flex flex-wrap gap-2">
          {recipes.map((rec) => {
            const isSelected = selectedRecipeId === rec.id;
            return (
              <button
                key={rec.id}
                onClick={() => {
                  setSelectedRecipeId(rec.id);
                  setSelectedIngredients(rec.ingredients.map((i) => i.id));
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? "bg-[#15803D] text-white shadow-md shadow-emerald-950/20"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50"
                }`}
              >
                <span>{rec.name.split(" ")[0]}</span>
                {rec.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? "bg-emerald-800 text-emerald-100" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {rec.prepTime}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= 2. ACTIVE RECIPE BUILDER ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Visual & Cooking Steps */}
        <div className="lg:col-span-6 space-y-6">
          <div className="relative aspect-video sm:aspect-4/3 rounded-[32px] overflow-hidden bg-slate-100 shadow-xl border-4 border-white">
            <img
              src={currentRecipe.image}
              alt={currentRecipe.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3.5 py-1 rounded-full bg-[#15803D] text-white text-xs font-black uppercase tracking-wider shadow-md">
                {currentRecipe.badge}
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-slate-950/80 backdrop-blur-md text-white flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <Clock size={15} className="text-emerald-400" />
                <span>Prep Time: <strong>{currentRecipe.prepTime}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame size={15} className="text-amber-400" />
                <span>Calories: <strong>{currentRecipe.calories}</strong></span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-700 text-[10px] font-bold">
                {currentRecipe.difficulty}
              </span>
            </div>
          </div>

          {/* Step-by-Step Cooking Guide */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Utensils size={16} className="text-emerald-700" />
              <span>Chef's 3-Step Preparation Guide</span>
            </h3>

            <div className="space-y-3">
              {currentRecipe.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#15803D] font-black flex items-center justify-center shrink-0 text-[11px]">
                    {idx + 1}
                  </span>
                  <p className="text-slate-600 leading-relaxed pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Customizer & Cart Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider text-[#16A34A] font-bold">
              Customizable Farm Ingredients
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
              {currentRecipe.name}
            </h2>
            <p className="text-xs text-slate-500">{currentRecipe.tagline}</p>
          </div>

          {/* Serving Size Scale Selector */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Users size={15} className="text-emerald-700" />
                <span>Select Number of Servings:</span>
              </span>
              <span className="text-xs font-black text-[#15803D]">
                {servings} Servings ({servingMultiplier}x portion scale)
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              {[2, 4, 6].map((srv) => (
                <button
                  key={srv}
                  onClick={() => setServings(srv)}
                  className={`py-2.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    servings === srv
                      ? "bg-[#15803D] text-white border-[#15803D] shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {srv} Servings
                </button>
              ))}
            </div>
          </div>

          {/* Ingredients Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">
                Ingredients Included ({selectedIngredients.length}/{currentRecipe.ingredients.length})
              </span>
              <button
                onClick={() => {
                  if (selectedIngredients.length === currentRecipe.ingredients.length) {
                    setSelectedIngredients([]);
                  } else {
                    setSelectedIngredients(currentRecipe.ingredients.map((i) => i.id));
                  }
                }}
                className="text-emerald-700 font-bold hover:underline cursor-pointer"
              >
                {selectedIngredients.length === currentRecipe.ingredients.length
                  ? "Unselect All"
                  : "Select All"}
              </button>
            </div>

            <div className="space-y-2">
              {currentRecipe.ingredients.map((ing) => {
                const isChecked = selectedIngredients.includes(ing.id);
                const scaledPrice = ing.price * servingMultiplier;
                return (
                  <div
                    key={ing.id}
                    onClick={() => toggleIngredient(ing.id)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                      isChecked
                        ? "bg-white border-emerald-300 shadow-2xs"
                        : "bg-slate-50 border-slate-200 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center transition ${
                          isChecked ? "bg-[#15803D] text-white" : "border border-slate-300"
                        }`}
                      >
                        {isChecked && <Check size={13} />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{ing.name}</div>
                        <div className="text-[10px] text-slate-500">
                          {ing.baseQty} ({servingMultiplier}x scaled)
                        </div>
                      </div>
                    </div>

                    <div className="text-xs font-mono font-bold text-slate-800">
                      ₹{scaledPrice.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Total & Action Button */}
          <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-emerald-800 font-bold block">
                  Total Kit Cost ({servings} Servings)
                </span>
                <span className="text-2xl font-black text-[#15803D]">
                  ₹{kitTotal.toFixed(2)}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700">
                ₹{(kitTotal / servings).toFixed(2)} per plate
              </span>
            </div>

            <button
              onClick={handleAddKitToCart}
              className="w-full py-4 bg-[#15803D] hover:bg-emerald-800 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
            >
              <ShoppingBag size={17} />
              <span>Add Complete Kit to Fresh Basket</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
