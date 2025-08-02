import React from "react";
import css from "../SearchBox/SearchBox.module.css";

interface SearchBoxProps {
  value?: string;
  onChange: (value: string) => void;
}

const SearchBox = ({ value, onChange }: SearchBoxProps) => (
  <input
    className={css.input}
    type="text"
    placeholder="Search notes"
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);

export default SearchBox;
