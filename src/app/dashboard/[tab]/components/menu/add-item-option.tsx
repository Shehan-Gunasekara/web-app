import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Flex, Input, theme } from "antd";
// import { CiCirclePlus } from "react-icons/ci";
import ItemChoiceCounter from "./item-choice-counter";
import { useMenuContext } from "@/app/providers/MenuProvider";
import { ItemOption } from "@/utils/interfaces";
import AddItemOptionChoices from "./add-item-option-choices";
import { v4 as uuidv4 } from "uuid";
import {
  DndContext,
  KeyboardSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { MdOutlineDragIndicator } from "react-icons/md";
import style from "@/styles/menu/item-option";
import { modifierOptions } from "@/constants/lonovm-constants";
import { SmartPointerSensor } from "@/utils/smart-pointer";

const AddItemOption = forwardRef<
  unknown,
  {
    groupItem: { label: string; description: string };
    id?: number;
    isDisableAddButton: boolean;
    setIsDisableAddButton: (value: boolean) => void;
  }
>(({ groupItem: { label, description }, id }, ref) => {
  const {
    token: { cyan4, cyan7, colorBgBase, colorTextBase, cyan8 },
  } = theme.useToken();

  const [input, setInput] = useState("");

  const { planOption, itemOptionList, setItemOptionList } = useMenuContext();

  const [choices, setItemChoices] = useState<ItemOption[]>([]);
  const [choiceLimit, setChoiceLimit] = useState<number>(0);
  const [itemOptionLabel, setItemOptionLabel] = useState("");
  const [itemOptionPrice, setItemOptionPrice] = useState("");
  const [elementIndex, setElementIndex] = useState<number>(0);
  const [isValidPriceInput, setIsValidPriceInput] = useState(true);
  const [isValidTextInput, setIsValidTextInput] = useState(true);

  /*useEffect(() => {
      if (choices.length > 0 && input != "" && isDisableAddButton) {
        setIsDisableAddButton(false);
      } else {
        if (!isDisableAddButton) {
          setIsDisableAddButton(true);
        }
      }
    }, [choices, input]);*/

  useEffect(() => {
    if (id) {
      const index = itemOptionList.findIndex((item: any) => item.id === id);
      if (index === -1) {
        const defaultElement = {
          id: id,
          index_no: itemOptionList.length,
          type: planOption,
          label: label,
          description: description,
          title: "",
          choice_limit: 1,
          choices: [],
        };
        const updatedOptions = [...itemOptionList];
        updatedOptions.push(defaultElement);
        setItemOptionList(updatedOptions);
        setElementIndex(updatedOptions.length - 1);
      } else {
        const element = itemOptionList[index];
        setElementIndex(index);
        setInput(element.title);
        setChoiceLimit(element.choice_limit);
        setItemChoices(element.choices);
      }
    }

    return () => {
      setChoiceLimit(0);
      setInput("");
      setItemChoices([]);
      setItemOptionLabel("");
      setItemOptionPrice("");
    };
  }, [id]);

  const changeChoiceLimit = (isIncrease: boolean) => {
    if (isIncrease) {
      setChoiceLimit((prev) => {
        return prev + 1;
      });
    } else if (choiceLimit > 0) {
      setChoiceLimit((prev) => {
        return prev - 1;
      });
    } else {
      setChoiceLimit(1);
    }
  };

  const handleAddToList = (priceIncluded: boolean) => {
    const updatedOptions = [...itemOptionList];
    if (!isValidPriceInput || !isValidTextInput) {
      if (!isValidPriceInput) {
        if (itemOptionPrice === "") {
          setIsValidPriceInput(true);
        }
      } else {
        return updatedOptions;
      }
    }

    if (!itemOptionLabel) return updatedOptions;

    const index_no = choices.length;

    const newItem = {
      id: uuidv4(),
      label: priceIncluded ? itemOptionLabel : "",
      price: itemOptionPrice != "" ? itemOptionPrice : "0.00",
      index_no: index_no,
    };
    const choicesList = [...choices, newItem];
    setItemChoices(choicesList);

    const choicesTemp = [
      ...(updatedOptions[elementIndex]?.choices ?? []),
      newItem,
    ];
    updatedOptions[elementIndex] = {
      ...updatedOptions[elementIndex],
      type: planOption,
      title: input,
      choice_limit: choiceLimit > 0 ? choiceLimit : choicesTemp.length,
      choices: choicesTemp,
    };

    setItemOptionList(updatedOptions);
    setItemOptionLabel("");
    setItemOptionPrice("");

    // Return for parent call since hook update is async
    return updatedOptions;
  };

  useImperativeHandle(ref, () => ({
    childFunction() {
      return handleAddToList(true);
    },
  }));

  const handleRemoveFromList = (providedIndex: number) => {
    if (choices.length > 0) {
      if (providedIndex >= 0 && providedIndex < choices.length) {
        const updatedChoices = [...choices];
        updatedChoices.splice(providedIndex, 1);
        setItemChoices(updatedChoices);
        const updatedOptions = [...itemOptionList];
        const updatedItems = [...(updatedOptions[elementIndex]?.choices ?? [])];
        updatedItems.splice(providedIndex, 1);
        updatedOptions[elementIndex] = {
          ...updatedOptions[elementIndex],
          choices: updatedItems,
        };
        setItemOptionList(updatedOptions);
      }
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id === over.id) return;
    const oldIndex = choices.findIndex(
      (item: ItemOption) => item.id === active.id
    );
    const newIndex = choices.findIndex(
      (item: ItemOption) => item.id === over.id
    );
    const newList = arrayMove(choices, oldIndex, newIndex);
    newList.forEach((item: any, index) => {
      item.index_no = index;
    });
    setItemChoices(newList);
    const updatedItemOptionList = [...itemOptionList];
    updatedItemOptionList[elementIndex].choices = newList;
    setItemOptionList(updatedItemOptionList);
  };

  const sensors = useSensors(
    // Used modified pointer sensor instead of original of dnd-kit
    // Purpoe is to avoid activating sensor while editing input fields' values
    useSensor(SmartPointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleInputPriceChange = (e: any) => {
    const inputValue = e.target.value;
    const isValidNumber = /^-?\d*\.?\d*$/.test(inputValue); // Updated regex to allow negative numbers

    if (inputValue == "-") {
      setItemOptionPrice(inputValue);
      setIsValidPriceInput(false);
      return;
    }

    if (isValidNumber) {
      setItemOptionPrice(inputValue);
      setIsValidPriceInput(true);
    } else {
      setIsValidPriceInput(false);
    }
  };

  const handleInputTextChange = (e: any) => {
    const inputValue = e.target.value;
    if (/^[a-zA-Z0-9\s]*$/.test(inputValue)) {
      setItemOptionLabel(inputValue);
      setIsValidTextInput(true);
    } else {
      setIsValidTextInput(false);
    }
  };

  return (
    <Flex vertical={true} style={{ marginTop: "0.5rem" }}>
      <Flex
        vertical={false}
        gap={4}
        align={"start"}
        justify="space-between"
        style={{ margin: "0.5rem 0" }}
      >
        <div
          style={{
            display: "inline-block",
            width: "calc(70% - 0.5rem)",
            marginBottom: "0rem",
          }}
        >
          <span
            style={{
              ...style.topicStyle,
              color: cyan4,
            }}
          >
            Title
          </span>
          <Input
            placeholder={
              label === modifierOptions.required.label
                ? "e.g. Choose Your Size"
                : label === modifierOptions.optional.label
                ? "e.g. Add Your Toppings"
                : "e.g. Remove Undesired"
            }
            style={{
              border: "none",
              marginTop: "0.3rem",
              height: "44px",
              borderRadius: 10,
              fontSize: "16px",
              fontWeight: 700,
            }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            name="titleSelection"
          />
        </div>
        <div style={style.choiceLimitContainer}>
          <ItemChoiceCounter
            handleDecrement={() => changeChoiceLimit(false)}
            handleIncrement={() => changeChoiceLimit(true)}
            count={choiceLimit}
            label={label}
          />
        </div>
      </Flex>

      <div style={{ display: "flex", marginTop: "0.5rem" }}>
        <div
          style={{
            display: "inline-block",
            width: "calc(70% - 0.5rem)",
          }}
        >
          <span
            style={{
              ...style.topicStyle,
              color: cyan4,
            }}
          >
            Options
          </span>
        </div>
        <div
          style={{
            display: "inline-block",
            width: "calc(30% - 0.5rem)",
            marginLeft: "0.5rem",
          }}
        >
          <span
            style={{
              ...style.topicStyle,
              color: cyan4,
            }}
          >
            Price Adjustment
          </span>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        {choices && (
          <SortableContext
            items={choices}
            strategy={verticalListSortingStrategy}
          >
            {choices.map((option, index) => (
              <AddItemOptionChoices
                key={option.id}
                index={index}
                option={option}
                handleRemoveFromList={() => handleRemoveFromList(index)}
                choices={choices}
                setItemChoices={setItemChoices}
                elementIndex={elementIndex}
                itemOptionList={itemOptionList}
                setItemOptionList={setItemOptionList}
              />
            ))}
          </SortableContext>
        )}
      </DndContext>

      <Flex
        vertical={true}
        justify={"space-between"}
        style={{
          marginTop: "0.5rem",
        }}
      >
        <Flex
          vertical={true}
          style={{
            background: cyan8,
            padding: "1rem 0",
            borderRadius: "6px",
          }}
        >
          <Flex vertical={false} align={"center"} gap={4}>
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
                marginLeft: -2.5,
                background: colorBgBase,
                borderRadius: 10,
              }}
            >
              <Input
                placeholder={
                  label === modifierOptions.required.label
                    ? "e.g: Small"
                    : "e.g: Green Pepper"
                }
                style={{
                  border: "none",
                  background: "transparent",
                  height: 35,
                }}
                value={itemOptionLabel}
                // onChange={(e) => setItemOptionLabel(e.target.value)}
                onChange={handleInputTextChange}
                name="titleSelection"
              />
            </div>
            <div
              style={{
                display: "inline-block",
                width: "21.5%",
                marginLeft: "0.26rem",
                marginRight: "0.7rem",
                marginBottom: "0rem",
                background: colorBgBase,
                borderRadius: 10,
              }}
            >
              <Input
                placeholder="0.00"
                prefix={
                  <span
                    style={{
                      color: itemOptionPrice ? colorTextBase : cyan7,
                    }}
                  >
                    $
                  </span>
                }
                style={{
                  border: "none",
                  background: "transparent",
                  height: 35,
                }}
                value={itemOptionPrice}
                // onChange={(e) => setItemOptionPrice(e.target.value)}
                onChange={handleInputPriceChange}
                name="priceSelection"
              />
            </div>

            {/* <CiCirclePlus
              fontSize={"1.5rem"}
              style={{
                cursor: "pointer",
                marginRight: "0.5rem",
                marginLeft: 0,
              }}
              onClick={() => handleAddToList(true)}
            /> */}

            <div
              style={{
                borderRadius: 10,
                height: "23px",
                width: "25px",
                border:
                  isValidTextInput && isValidPriceInput && itemOptionLabel
                    ? `1px solid ${colorTextBase}`
                    : `1px solid ${cyan7}`,

                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                marginRight: "12px",
                marginLeft: "-2px",
              }}
              onClick={() => handleAddToList(true)}
              id="add-btn-1"
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 300,
                  color:
                    isValidTextInput && isValidPriceInput && itemOptionLabel
                      ? colorTextBase
                      : cyan7,
                  marginTop: "-3px",
                }}
              >
                +
              </div>
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
      </Flex>
    </Flex>
  );
});

AddItemOption.displayName = "AddItemOption";

export default AddItemOption;
