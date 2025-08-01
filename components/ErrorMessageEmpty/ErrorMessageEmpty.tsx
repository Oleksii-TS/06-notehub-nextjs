import css from "./ErrorMessageEmpty.module.css";

export function ErrorMessageEmpty() {
  return <p className={css.text}>No notes found for your request.</p>;
}
