import React, { useState } from "react";
import { Flex, Input, theme } from "antd";
import { ItemOption, ItemOptionList } from "@/utils/interfaces";
import { MdOutlineDragIndicator } from "react-icons/md";
//import { modifierOptions } from "@/constants/lonovm-constants";
//import { useMenuContext } from "@/app/providers/MenuProvider";

function OptionInput({
  elementIndex,
  optionIndex,
  option: { label, price },
  choices,
  setItemChoices,
  itemOptionList,
  setItemOptionList,
}: {
  elementIndex: number;
  optionIndex: number;
  option: ItemOption;
  choices: ItemOption[];
  setItemChoices: React.Dispatch<React.SetStateAction<ItemOption[]>>;
  itemOptionList: ItemOptionList[];
  setItemOptionList: React.Dispatch<React.SetStateAction<ItemOptionList[]>>;
}) {
  const {
    token: { colorBgBase, cyan6, colorTextBase },
  } = theme.useToken();
  //const { planOption } = useMenuContext();

  const [isValidPriceInput, setIsValidPriceInput] = useState(true);
  const [isValidTextInput, setIsValidTextInput] = useState(true);
  // const timeOutRef = useRef<any>(null);

  // Updates the choices with the latest text value entered
  const handleItemOptionLabelEnter = (e: any) => {
    const newItemOptionLabel = e.target.value;

    if (choices.length) {
      const updatedChoices = [...choices];
      updatedChoices[optionIndex] = {
        ...updatedChoices[optionIndex],
        label: newItemOptionLabel,
      };
      setItemChoices(updatedChoices);
      const updatedOptions = [...itemOptionList];
      const updatedItems = [...updatedOptions[elementIndex].choices];
      updatedItems[optionIndex] = {
        ...updatedItems[optionIndex],
        label: newItemOptionLabel,
      };
      updatedOptions[elementIndex] = {
        ...updatedOptions[elementIndex],
        choices: updatedItems,
      };
      setItemOptionList(updatedOptions);
    }
  };

  // Updates the choices with the latest price value entered
  const handleItemOptionPriceEnter = (priceInput: any) => {
    // const newItemOptionPrice = e.target.value;
    const newItemOptionPrice = priceInput;

    if (choices.length) {
      const updatedChoices = [...choices];
      updatedChoices[optionIndex] = {
        ...updatedChoices[optionIndex],
        price: newItemOptionPrice,
      };
      setItemChoices(updatedChoices);
      const updatedOptions = [...itemOptionList];
      const updatedItems = [...updatedOptions[elementIndex].choices];
      updatedItems[optionIndex] = {
        ...updatedItems[optionIndex],
        price: newItemOptionPrice,
      };
      updatedOptions[elementIndex] = {
        ...updatedOptions[elementIndex],
        choices: updatedItems,
      };
      setItemOptionList(updatedOptions);
    }
  };

  const handleInputTextChange = (e: any) => {
    const inputValue = e.target.value;
    if (/^[a-zA-Z0-9\s]*$/.test(inputValue)) {
      handleItemOptionLabelEnter(e);
      setIsValidTextInput(true);
    } else {
      setIsValidTextInput(false);
    }
  };

  const handleInputPriceChange = (e: any) => {
    const inputValue = e.target.value;
    // const isValidNumber = /^-?\d*\.?\d*$/.test(inputValue); // Updated regex to allow negative numbers
    const isValidNumber = !isNaN(parseFloat(inputValue));

    if (isValidNumber) {
      // timeOutRef.current = null;
      handleItemOptionPriceEnter(inputValue);
      setIsValidPriceInput(true);
    } else {
      if (inputValue === "" || inputValue === "-") {
        handleItemOptionPriceEnter(inputValue);
        setIsValidPriceInput(true);

        // if (!timeOutRef.current) {
        //   timeOutRef.current = setTimeout(() => {
        //     handleItemOptionPriceEnter("0");
        //     setIsValidPriceInput(true);
        //     timeOutRef.current = null;
        //   }, 5000);
        // }
        return;
      }
      setIsValidPriceInput(false);
    }
  };

  return (
    <Flex
      vertical={true}
      style={{
        background: cyan6,
        padding: "0.5rem 0",
        borderRadius: "0.3rem",
        // border: "1px solid #d9d9d9",
      }}
    >
      <Flex vertical={false} align={"center"}>
        <MdOutlineDragIndicator
          fontSize={16}
          style={{
            padding: 0,
            marginTop: "5px",
            clipPath: "polygon(120% 0, 50% 70%, 65% 100%, 0% 10%)",
            color: "#5D6068",
            height: "25px",
            width: "25px",
          }}
          color={"rgba(93, 96, 104, 1)"}
        />
        <div
          style={{
            display: "inline-block",
            width: "70%",
            marginBottom: "0rem",
            // marginLeft: "0.3rem",
            background: colorBgBase,
            borderRadius: 10,
          }}
        >
          <Input
            placeholder="e.g: Small"
            defaultValue={label ?? ""}
            style={{
              border: "none",
              background: "transparent",
              height: 35,
            }}
            value={label}
            onChange={(e) => handleInputTextChange(e)}
            name="itemOptionLabel"
          />
        </div>
        <div
          style={{
            display: "inline-block",
            width: "21.5%",
            marginLeft: "0.5rem",
            //marginRight: "0.5rem",
            marginBottom: "0rem",
            background: colorBgBase,
            borderRadius: 10,
          }}
        >
          <Input
            prefix={
              <span
                style={{
                  color: colorTextBase,
                }}
              >
                $
              </span>
            }
            placeholder="0.00"
            defaultValue={price ?? "0.00"}
            style={{
              border: "none",
              background: "transparent",
              height: 35,
              color: colorTextBase,
            }}
            value={price ?? "0.00"}
            name="itemOptionPrice"
            onChange={(e) => handleInputPriceChange(e)}
          />
        </div>
      </Flex>

      {!isValidPriceInput && (
        <p
          style={{
            color: "red",
            margin: "4px 0 -10px 20px",
            padding: 0,
          }}
        >
          Only positive or negative numbers are allowed!
        </p>
      )}
      {!isValidTextInput && (
        <p
          style={{
            color: "red",
            margin: "4px 0 -10px 20px",
            padding: 0,
          }}
        >
          Special characters are not allowed!
        </p>
      )}
    </Flex>
  );
}

export default OptionInput;
