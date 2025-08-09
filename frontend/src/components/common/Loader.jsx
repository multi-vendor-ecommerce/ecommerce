import LoaderGif from "../../assets/loader.gif";

const Loader = () => {
  return (
    <div className="text-center my-3">
      <img className="w-11" src={LoaderGif} alt="Loader" />
    </div>
  )
}

export default Loader;