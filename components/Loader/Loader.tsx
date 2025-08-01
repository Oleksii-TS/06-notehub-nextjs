import ClipLoader from "react-spinners/ClipLoader";
import css from "../Loader/Loader.module.css";

interface LoaderProps {
  size?: number;
  color?: string;
}

export default function Loader({ size = 50, color = "#0d6efd" }: LoaderProps) {
  return (
    <div className={css.loaderWrapper}>
      <ClipLoader size={size} color={color} />
    </div>
  );
}
