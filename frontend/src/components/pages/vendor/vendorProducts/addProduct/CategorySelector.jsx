import { useEffect } from "react";
import useCategorySelection from "../../../../../hooks/useCategorySelection";
import StepperControls from "../../../../common/StepperControls";

const CategorySelector = ({
  formData,
  step = 1,
  nextStep,
  prevStep,
  setFormData,
  selectedCategories,
  setSelectedCategories,
  onCategoryFinalSelect,
}) => {
  const {
    categoryLevels,
    loadCategories,
    handleCategoryClick,
    getSelectedCategoryPath,
  } = useCategorySelection(onCategoryFinalSelect, setSelectedCategories, selectedCategories);

  useEffect(() => {
    loadCategories(null, 0);
  }, []);

  return (
    <>
      <div className="w-full flex flex-wrap gap-4 overflow-x-auto pb-2">
        {categoryLevels.map((level, levelIndex) => (
          <div
            key={levelIndex}
            className="min-w-full md:min-w-[200px] md:max-h-[300px] overflow-y-auto rounded-lg shadow-md shadow-purple-500 bg-gray-50 p-2 break-words"
          >
            <h3 className="text-sm md:text-[16px] font-semibold mb-2 text-gray-600">
              Level {levelIndex + 1}
            </h3>
            {level.map((cat) => (
              <div
                key={cat._id}
                onClick={() => handleCategoryClick(cat._id, levelIndex)}
                className={`cursor-pointer px-3 py-2 my-1 rounded-lg transition ${selectedCategories[levelIndex] === cat._id
                  ? "bg-blue-200 font-semibold"
                  : "hover:bg-blue-100"
                  }`}
              >
                - {cat.name}
              </div>
            ))}
          </div>
        ))}

        {formData.category && (
          <div className="min-w-full md:min-w-[250px] max-w-sm px-3 py-2 rounded-lg shadow-md shadow-purple-500 bg-gray-50 break-words">
            <h3 className="font-bold text-gray-800 mb-2">Selected Category</h3>
            <p className="text-gray-600 text-sm md:text-[16px]">
              {getSelectedCategoryPath()}
            </p>
          </div>
        )}
      </div>

      <StepperControls
        currentStep={step}
        onNext={nextStep}
        onBack={prevStep}
        nextDisabled={step === 1 && !formData.category}
      />
    </>
  );
};

export default CategorySelector;
