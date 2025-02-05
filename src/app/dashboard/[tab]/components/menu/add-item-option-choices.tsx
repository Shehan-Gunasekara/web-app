import React from "react";
import { Flex, theme } from "antd";
// import { CiCircleMinus } from "react-icons/ci";
import OptionInput from "./option-input";
import { ItemOption, ItemOptionList } from "@/utils/interfaces";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function AddItemOptionChoices({
  index,
  elementIndex,
  option,
  choices,
  setItemChoices,
  itemOptionList,
  setItemOptionList,
  handleRemoveFromList,
}: {
  index: number;
  elementIndex: number;
  option: ItemOption;
  choices: ItemOption[];
  setItemChoices: React.Dispatch<React.SetStateAction<ItemOption[]>>;
  itemOptionList: ItemOptionList[];
  setItemOptionList: React.Dispatch<React.SetStateAction<ItemOptionList[]>>;
  handleRemoveFromList: (providedIndex: number) => void;
}) {
  const {
    token: { cyan6, colorTextBase },
  } = theme.useToken();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: option.id });

  return (
    <Flex
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      vertical={true}
      justify={"space-between"}
      style={{
        margin: "0.3rem 0",
        background: cyan6,
        padding: "0.5rem 0",
        borderRadius: "6px",
        touchAction: "none",
        transition: transition,
        transform: CSS.Transform.toString(transform),
      }}
    >
      <Flex vertical={false} align={"center"} gap={4}>
        <OptionInput
          elementIndex={elementIndex}
          optionIndex={index}
          option={option}
          choices={choices}
          setItemChoices={setItemChoices}
          itemOptionList={itemOptionList}
          setItemOptionList={setItemOptionList}
        />
        <div
          style={{
            borderRadius: 10,
            height: "23px",
            width: "25px",
            border: `1px solid ${colorTextBase}`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            marginRight: "12px",
            marginLeft: "-2px",
          }}
          onClick={() => handleRemoveFromList(index)}
          id="remove-choice"
        >
          <div
            style={{
              fontSize: "24px",
              fontWeight: 300,
              color: colorTextBase,
              marginTop: "-3px",
            }}
          >
            -
          </div>
        </div>

        {/* <CiCircleMinus
          fontSize={"1.5rem"}
          style={{ cursor: "pointer", marginLeft: "0.5rem" }}
          onClick={() => handleRemoveFromList(index)}
        /> */}
      </Flex>
    </Flex>
  );
}

export default AddItemOptionChoices;
