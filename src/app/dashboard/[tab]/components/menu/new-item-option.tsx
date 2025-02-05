import React, { useState, useEffect, useRef } from "react";
import { Flex, Button, Row, Col, theme, Form } from "antd";
import style from "@/styles/menu/menu-modals";
import { useMenuContext } from "@/app/providers/MenuProvider";
import { TbInfoCircle } from "react-icons/tb";
// import { v4 as uuidv4 } from "uuid";
import AddItemOption from "./add-item-option";

interface ChildRef {
  childFunction: () => any;
}

function NewItemOption() {
  const {
    token: {
      colorFillAlter,
      colorBgContainerDisabled,
      colorFillSecondary,
      colorTextLightSolid,
      colorBgContainer,
      colorTextBase,
    },
  } = theme.useToken();

  const {
    updateCurrentStep,
    planOption,
    setPlanOption,
    itemOptionList,
    setItemOptionList,
    itemOptionGroups,
    setItemOptionGroups,
    initialItemOptionGroups,
    selectedItemOptionList,
    setSelectedItemOptionList,
  } = useMenuContext();

  const [selectedId, setSelectedId] = useState(-1);
  const [isDisableAddButton, setIsDisableAddButton] = useState(true);

  const childRef = useRef<ChildRef>(null);
  const updateItemsList = () => {
    let updatedOptions = childRef.current
      ? childRef.current.childFunction()
      : itemOptionList;
    console.log("uuuuuuuuuuuu", updatedOptions);

    setSelectedItemOptionList((prevList: any) => {
      const updatedList = [...prevList];

      updatedOptions.forEach((item: any) => {
        const existingItemIndex = updatedList.findIndex(
          (selectedItem) => selectedItem.id === item.id
        );

        if (existingItemIndex !== -1) {
          item["index_no"] = existingItemIndex;
          updatedList[existingItemIndex] = item;
        } else {
          if (item.title && item.title.length > 0) {
            item["index_no"] = updatedList.length;
            updatedList.push(item);
          }
        }
      });

      return updatedList;
    });
    updateCurrentStep(false);
  };

  function generateRandomUniqueInteger(min: number, max: number) {
    const range = Array.from(
      { length: max - min + 1 },
      (_, index) => min + index
    );
    const shuffledRange = range.sort(() => Math.random() - 0.5);
    return shuffledRange[Math.floor(Math.random() * shuffledRange.length)];
  }

  useEffect(() => {
    const resetItemOptions = () => {
      if (itemOptionList.length == 0 && itemOptionGroups.length > 0) {
        let countIndex =
          selectedItemOptionList.length > 0
            ? selectedItemOptionList[selectedItemOptionList.length - 1].id +
              generateRandomUniqueInteger(1000, 5000)
            : generateRandomUniqueInteger(10000, 30000);
        const updatedItemOptions = itemOptionGroups.map(
          (item: any, index: number) => {
            if (!item.option_id) {
              // const randomId = uuidv4();
              item.option_id = countIndex;
              item.index_no = index;
              if (item.type == planOption.toLowerCase()) {
                setSelectedId(countIndex);
              }
              countIndex++;
            }
            return item;
          }
        );
        setItemOptionGroups(updatedItemOptions);
      }
    };
    resetItemOptions();

    return () => {
      setItemOptionGroups(initialItemOptionGroups);
      setItemOptionList([]);
    };
  }, []);

  // const onChangeRadio = ({ target: { value } }: RadioChangeEvent) => {
  //   setPlanOption(value);
  //   const optionItem = itemOptionGroups.find(
  //     (item: any) => item.type == value.toLowerCase()
  //   );
  //   if (optionItem && optionItem.option_id) {
  //     setSelectedId(optionItem.option_id);
  //   }
  // };

  const onChangeButton = (value: string) => {
    setPlanOption(value);
    const optionItem = itemOptionGroups.find(
      (item: any) => item.type === value.toLowerCase()
    );
    if (optionItem && optionItem.option_id) {
      setSelectedId(optionItem.option_id);
    }
    setPlanOption(value);
  };

  const [form] = Form.useForm();

  return (
    <Flex
      vertical={true}
      justify="space-between"
      gap={8}
      style={{ marginTop: "1rem", ...style.menuNewOptionModals }}
    >
      <div>
        {/* <Flex>
          <Radio.Group
            onChange={onChangeRadio}
            value={planOption}
            style={{ width: "100%" }}
            buttonStyle={"outline"}
          >
            <Flex vertical={false} gap={8} justify="space-between">
              {itemOptionGroups.map((option: any) => (
                <Flex
                  key={option.type}
                  style={{
                    border: `1px solid ${colorFillAlter}`,
                    borderRadius: "4px",
                    marginBottom: "8px",
                    padding: "8px",
                    width: "100%",
                  }}
                >
                  <Radio
                    value={option.type}
                    style={{
                      color: planOption == option.type ? colorTextBase : blue9,
                    }}
                  >
                    {option.label}
                  </Radio>
                </Flex>
              ))}
            </Flex>
          </Radio.Group>
        </Flex> */}
        <Flex gap={10}>
          {itemOptionGroups.map((option: any) => (
            <Button
              key={option.type}
              onClick={() => onChangeButton(option.type)}
              // type={planOption === option.type ? "primary" : "default"}
              style={{
                border: `1px solid ${colorFillAlter}`,
                color:
                  planOption === option.type ? colorBgContainer : colorTextBase,
                backgroundColor:
                  planOption == option.type ? colorTextBase : colorBgContainer,
                borderRadius: 10,
                fontWeight: 600,
                width: "100%",
                height: "2rem",
              }}
              name={option.type}
            >
              {option.label}
            </Button>
          ))}
        </Flex>

        <Form
          form={form}
          name="validateOnly"
          layout="vertical"
          autoComplete="off"
        >
          <AddItemOption
            groupItem={itemOptionGroups.find(
              (item: any) => item.type == planOption.toLowerCase()
            )}
            id={selectedId}
            ref={childRef}
            isDisableAddButton={isDisableAddButton}
            setIsDisableAddButton={setIsDisableAddButton}
          />
        </Form>
      </div>

      <Col>
        <Row justify="center">
          <div
            style={{
              color: "#9D9D9D",
              margin: "0.5rem",
              display: "flex",
              gap: "0.2rem",
            }}
          >
            <TbInfoCircle style={{ fontSize: "1rem" }} />
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: "400",
              }}
            >
              {itemOptionGroups.find(
                (item: any) => item.type == planOption.toLowerCase()
              )?.description ?? ""}
            </span>
          </div>
        </Row>
        <Row style={{ marginLeft: "-8px" }}>
          <Col sm={24} md={10}>
            <Button
              style={{
                backgroundColor: colorBgContainer,
                border: `2px solid ${colorBgContainerDisabled}`,
                ...style.cancelButton,
              }}
              onClick={() => updateCurrentStep(false)}
              name="backButton"
            >
              Back
            </Button>
          </Col>
          <Col sm={24} md={14}>
            <Button
              style={{
                backgroundColor: colorFillSecondary,
                color: colorTextLightSolid,
                ...style.modalBtn,
              }}
              onClick={updateItemsList}
              name="addButton"
            >
              Add
            </Button>
          </Col>
        </Row>
      </Col>
    </Flex>
  );
}

export default NewItemOption;
