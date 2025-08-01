import React from "react";
import css from "../SearchBox/SearchBox.module.css";

interface SearchBoxProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBox = ({ value, onChange }: SearchBoxProps) => (
  <input
    className={css.input}
    type="text"
    placeholder="Search notes"
    value={value}
    onChange={onChange}
  />
);

export default SearchBox;
