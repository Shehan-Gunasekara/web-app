import React, { useState, useRef } from "react";
import { Flex, Button, Row, Col, theme, Form } from "antd";
import style from "@/styles/menu/menu-modals";
import { useMenuContext } from "@/app/providers/MenuProvider";
import { TbInfoCircle } from "react-icons/tb";
// import { v4 as uuidv4 } from "uuid";
import EditItemOption from "./edit-item-option";
import { useMutation } from "@apollo/client";
import { UPDATE_ITEM_OPTION } from "@/lib/mutations/item_option";

interface ChildRef {
  childFunction: () => any;
}

function UpdateItemOption() {
  const {
    token: {
      colorBgContainerDisabled,
      colorFillSecondary,
      colorTextLightSolid,
      colorBgContainer,
    },
  } = theme.useToken();

  const {
    updateCurrentStep,
    planOption,
    itemOptionList,
    _setItemOptionList,
    itemOptionGroups,
    _setItemOptionGroups,
    _initialItemOptionGroups,
    selectedItemOptionList,
    setSelectedItemOptionList,
    setIsUpdatingItemOption,
    updateOptionId,
  } = useMenuContext();

  const [selectedId, _setSelectedId] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [updateItemOption] = useMutation<any>(UPDATE_ITEM_OPTION);

  const childRef = useRef<ChildRef>(null);
  const updateItemsList = async () => {
    let updatedOptions = itemOptionList;
    const newSelectedItemOptionList = [...selectedItemOptionList];

    console.log(updatedOptions);
    updatedOptions.forEach((item: any) => {
      const existingItemIndex = newSelectedItemOptionList.findIndex(
        (selectedItem) => selectedItem.id === item.id
      );
      item.choice_limit =
        item.choice_limit > 0 ? item.choice_limit : item.choices.length;

      if (existingItemIndex !== -1) {
        item["index_no"] = existingItemIndex;
        newSelectedItemOptionList[existingItemIndex] = item;
      } else {
        if (item.title && item.title.length > 0) {
          item["index_no"] = newSelectedItemOptionList.length;
          newSelectedItemOptionList.push(item);
        }
      }
    });

    setIsLoading(true);
    const items = newSelectedItemOptionList.map((element: any) => {
      const choices = element.choices.map((choice: any) => {
        return {
          label: choice.label,
          price: parseFloat(choice.price),
          index_no: choice.index_no,
        };
      });
      return {
        id: element.id,
        index_no: element.index_no,
        type: element.type,
        title: element.title,
        choice_limit:
          element.choice_limit > 0 ? element.choice_limit : choices.length,
        choices: choices,
      };
    });
    const newItem = items.find((item: any) => item.id === updateOptionId);
    console.log(newItem);

    try {
      const { data: _data } = await updateItemOption({
        variables: {
          input: newItem,
        },
      });
      if (_data) {
        setIsLoading(false);
      }
    } catch (error: any) {
      setIsLoading(false);
      console.log(error);
    }
    setSelectedItemOptionList(newSelectedItemOptionList);
    updateCurrentStep(false);
    setIsUpdatingItemOption(false);
  };

  function _generateRandomUniqueInteger(min: number, max: number) {
    const range = Array.from(
      { length: max - min + 1 },
      (_, index) => min + index
    );
    const shuffledRange = range.sort(() => Math.random() - 0.5);
    return shuffledRange[Math.floor(Math.random() * shuffledRange.length)];
  }

  // Not sure why do we need this useEffect!!!
  // It does not have a comment/desc that what it's purpose
  // Commenting out the whole section for updating item options feature
  //
  // useEffect(() => {
  //   const resetItemOptions = () => {
  //     if (itemOptionList.length == 0 && itemOptionGroups.length > 0) {
  //       let countIndex =
  //         selectedItemOptionList.length > 0
  //           ? selectedItemOptionList[selectedItemOptionList.length - 1].id +
  //           generateRandomUniqueInteger(1000, 5000)
  //           : generateRandomUniqueInteger(10000, 30000);
  //       const updatedItemOptions = itemOptionGroups.map(
  //         (item: any, index: number) => {
  //           if (!item.option_id) {
  //             // const randomId = uuidv4();
  //             item.option_id = countIndex;
  //             item.index_no = index;
  //             if (item.type == planOption.toLowerCase()) {
  //               setSelectedId(countIndex);
  //             }
  //             countIndex++;
  //           }
  //           return item;
  //         }
  //       );
  //       setItemOptionGroups(updatedItemOptions);
  //     }
  //   };
  //   resetItemOptions();

  //   return () => {
  //     setItemOptionGroups(initialItemOptionGroups);
  //     setItemOptionList([]);
  //   };
  // }, []);

  const [form] = Form.useForm();

  return (
    <Flex
      vertical={true}
      justify="space-between"
      gap={8}
      style={{ marginTop: "1rem", ...style.menuNewOptionModals }}
    >
      <div>
        <Form
          form={form}
          name="validateOnly"
          layout="vertical"
          autoComplete="off"
        >
          <EditItemOption
            groupItem={itemOptionGroups.find(
              (item: any) => item.type == planOption.toLowerCase()
            )}
            id={selectedId}
            ref={childRef}
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
              onClick={() => {
                updateCurrentStep(false);
                setIsUpdatingItemOption(false);
              }}
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
              disabled={isLoading}
            >
              Update
            </Button>
          </Col>
        </Row>
      </Col>
    </Flex>
  );
}

export default UpdateItemOption;
