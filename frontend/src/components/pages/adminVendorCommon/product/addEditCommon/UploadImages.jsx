import { FiPlusCircle, FiX } from "react-icons/fi";
import StepperControls from "../../../../common/StepperControls";

const UploadImages = ({
  step = 2,
  nextStep,
  prevStep,
  handleImageChange,
  handleImageDelete,
  images,
  isEditing = true,
  showStepper = true,
}) => {
  return (
    <>
      <div className={`w-full min-h-[200px] mb-5 bg-gray-100 rounded-xl flex flex-col justify-center items-center hover:border-2 hover:border-blue-500 transition duration-200 ${!isEditing ? "opacity-60 pointer-events-none" : ""}`}>
        <div>
          <label
            htmlFor="images"
            className="flex flex-col font-medium text-gray-700 items-center gap-2 cursor-pointer"
            title="Upload at least one clear image"
          >
            <FiPlusCircle size={50} className="text-blue-600" />
            <span className="text-base md:text-lg">Upload Product Images</span>
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="images"
            disabled={!isEditing}
          />
        </div>
        <p className="text-gray-600 text-center px-3 md:px-0 text-xs md:text-sm mt-3">
          Upload at least 3 (max 7) clear images of the product from multiple angles.
        </p>
        <p className="text-yellow-600 text-xs md:text-sm mt-0.5">
          Image size should not exceed 5MB.
        </p>
      </div>

      <div>
        <div className="text-lg md:text-xl font-semibold">Images:</div>
        {images.length > 0 && (
          <div className="flex flex-wrap gap-3 my-3">
            {images.map((file, idx) => (
              <div key={idx} className="w-24 h-24 rounded-lg overflow-hidden relative">
                <img
                  src={
                    file instanceof File
                      ? URL.createObjectURL(file)
                      : file.url || file
                  }
                  alt={`preview-${idx}`}
                  className="w-full h-full object-cover"
                />
                {isEditing && (
                  <button
                    type="button"
                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-red-600/60 transition rounded-lg cursor-pointer"
                    style={{ zIndex: 2 }}
                    onClick={() => handleImageDelete(idx)}
                    title="Delete image"
                  >
                    <FiX size={50} className="text-white select-none pointer-events-none" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="text-gray-600 text-sm">
          {images.length} image{images.length !== 1 ? "s" : ""} selected
        </div>
      </div>

      {isEditing && showStepper && (
        <StepperControls
          currentStep={step}
          onNext={nextStep}
          onBack={prevStep}
          nextDisabled={step === 2 && images.length < 3}
        />
      )}
    </>
  );
};

export default UploadImages;