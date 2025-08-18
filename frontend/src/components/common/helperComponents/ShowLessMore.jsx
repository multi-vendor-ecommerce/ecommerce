// components/ShowMoreLess.jsx
const ShowLessMore = ({ showAll, toggleShowAll, condition }) => {
  if (!condition) return null;

  return (
    <div className="text-center mt-4">
      <button
        onClick={toggleShowAll}
        className="text-blue-600 hover:underline cursor-pointer font-medium"
        title="Toggle visibility"
      >
        {showAll ? "Show Less" : "Show More"}
      </button>
    </div>
  );
};

export default ShowLessMore;
