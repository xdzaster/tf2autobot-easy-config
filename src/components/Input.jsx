import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { optionActions } from "../store/options-ctx";
import MultipleSelect from "./SelectList/MultipleSelect";
import Dropdown from "./Dropdown";
import DescriptionButton from "./Description/DescriptionButton";
import CopyButton from "./CopyButton";

const Input = ({ type, label, value, id, isChecked, isList, description }) => {
  const [copiedData, setCopiedData] = useState("");
  const [tags, setTags] = useState("");
  const [selected, setSelected] = useState("");
  const dispatch = useDispatch();
  const keyValue = description ? description["keyvalues"] : null;

  //function to set copieddata to clipboard
  const copyData = () => {
    navigator.clipboard.writeText(copiedData);
  };

  // sets value when multiple select input changes
  useEffect(() => {
    setCopiedData(`!config ${id.replaceAll("_", ".")}=${JSON.stringify(tags)}`);
    dispatch(
      optionActions.editOption({
        optionValue: tags,
        optionKeys: id,
      })
    );
  }, [tags]);

  useEffect(() => {
    setCopiedData(`!config ${id.replaceAll("_", ".")}=${selected}`);
    dispatch(
      optionActions.editOption({
        optionValue: selected,
        optionKeys: id,
      })
    );
  }, [selected]);
  // sets copiedData value to default when new hovering on new item
  useEffect(() => {
    setCopiedData(`!config ${id.replaceAll("_", ".")}=${value}`);
  }, [id]);

  // function to handle changes in text and checkbox
  const handleChange = (event) => {
    let inputValue = event.target.value;
    if (event.target.type === "number") {
      inputValue = +inputValue;
    }
    if (event.target.type === "checkbox") {
      inputValue = event.target.checked;
    }
    setCopiedData(`!config ${id.replaceAll("_", ".")}=${inputValue}`);
    dispatch(
      optionActions.editOption({
        optionValue: inputValue,
        optionKeys: id,
      })
    );
  };

  //this functions current description
  const handleEnter = () => {
    dispatch(optionActions.setCurrentDescription({ id, description }));
  };
  //function to get tags from the createList component
  const handleTags = (data) => {
    setTags(data);
  };

  //gets data from select component and sets it to copied data and updates edited options
  const handleSelect = (data) => {
    setSelected(data);
  };

  return (
    <div
      className="p-1 flex my-1 flex-wrap align-middle group/option"
      onMouseEnter={handleEnter}
    >
      <label
        htmlFor={id}
        className={`text-slate-200 flex-1/2  hover:cursor-pointer self-center  ${
          type === "checkbox" ? "order-2 ml-2" : "md:mr-2"
        }  `}
      >
        {label}
      </label>
      <DescriptionButton
        externalClasses={`${type === "checkbox" && "order-3"} md:hidden`}
      />
      <CopyButton
        onClick={copyData}
        classes={`mr-1 ${type === "checkbox" && "order-3 ml-3"}`}
      />
      {isList && (
        <MultipleSelect
          label={label}
          id={id}
          sendTags={handleTags}
          options={description ? description.options : null}
        />
      )}

      {!isList && !keyValue && (
        <input
          onChange={handleChange}
          className={`
          bg-slate-900 text-slate-200
          mx-1
          rounded-md border-slate-500 border hover:outline-none outline-none
          hover:border-lime-300 
          pl-2 py-0.5
          placeholder:italic
          placeholder:text-slate-600
          accent-lime-500
          ${type === "text" ? "flex-1 order-4 md:order-none" : ""}
          `}
          type={type}
          defaultChecked={isChecked}
          id={id}
          defaultValue={value}
        />
      )}
      {keyValue && (
        <Dropdown
          options={keyValue}
          id={id}
          defaultValue={value}
          sendSelected={handleSelect}
        />
      )}
    </div>
  );
};

export default Input;
