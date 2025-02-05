import React from "react";
import { Flex, Dropdown, MenuProps, theme } from "antd";
import style from "@/styles/menu/menu-modals";
import { BsThreeDots } from "react-icons/bs";
import { ItemOptionList } from "@/utils/interfaces";
import { RiPencilFill } from "react-icons/ri";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdOutlineDragIndicator } from "react-icons/md";
import { useMenuContext } from "@/app/providers/MenuProvider";
import { modifierOptions } from "@/constants/lonovm-constants";

function ItemOptionListItem({
  item,
  handleDeleteClick,
}: {
  item: ItemOptionList;
  handleDeleteClick: (id: number) => void;
}) {
  const {
    token: { colorTextBase },
  } = theme.useToken();

  const { setUpdateOptionId, setIsUpdatingItemOption, updateCurrentStep } =
    useMenuContext();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id! });

  const handleMenuClick: MenuProps["onClick"] = (e: any) => {
    if (e.key === "update") {
      setUpdateOptionId(item.id);
      setIsUpdatingItemOption(true);
      updateCurrentStep(true);
    } else if (e.key === "delete") {
      handleDeleteClick(item.id!);
    }
  };

  const items: MenuProps["items"] = [
    {
      label: "Update",
      key: "update",
      icon: <RiPencilFill />,
    },
    {
      label: "Delete",
      key: "delete",
      icon: <RiDeleteBin6Fill />,
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  //most price you can shave off using this option
  const maxSubtraction = Math.min(
    0,
    item.choices
      .filter((choice) => parseInt(choice.price) < 0)
      .sort((a, b) => parseInt(a.price) - parseInt(b.price))
      .slice(0, item.choice_limit)
      .reduce((sum, choice) => sum + parseInt(choice.price), 0)
  );

  return (
    <Flex
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      vertical={false}
      justify={"space-between"}
      style={{
        padding: "1rem 1rem 1rem 0.5rem",
        borderRadius: "10px",
        background: "#3B3D43",
        touchAction: "none",
        transition: transition,
        transform: CSS.Transform.toString(transform),
        width: "394px",
        marginLeft: "-9px",
      }}
    >
      <Flex
        vertical={false}
        gap={4}
        align={"start"}
        style={{ alignItems: "center" }}
      >
        <MdOutlineDragIndicator
          fontSize={16}
          style={{
            ...style.dragableIcon,
          }}
        />
        <Flex vertical={true} gap={4} align={"start"}>
          <span style={style.updateLabel}>{item.title}</span>
          <span style={{ color: colorTextBase, fontSize: 14 }}>
            {item.type === modifierOptions.required.value
              ? "Required "
              : "Optional "}{" "}
            &bull;&nbsp;
            {item.choices?.length ?? 0} Options
          </span>
        </Flex>
      </Flex>

      <Flex vertical={true} gap={4} align={"end"}>
        <Dropdown menu={menuProps} placement="bottomRight">
          <div style={style.threeDotIcon}>
            <BsThreeDots />
          </div>
        </Dropdown>
        <span style={{ ...style.updateLabelF, color: colorTextBase }}>
          Choice Limit: {item.choice_limit}
        </span>
        {maxSubtraction !== 0 && (
          <span
            style={{
              ...style.updateLabelF,
              color: colorTextBase,
            }}
          >
            Max Subtraction: ${maxSubtraction}
          </span>
        )}
      </Flex>
    </Flex>
  );
}

export default ItemOptionListItem;
