import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  Dropdown,
  MenuProps,
  // Typography,
  Flex,
  Image,
  theme,
} from "antd";
// import Image from "next/image";
import { MdMoreHoriz, MdEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { Item } from "@/utils/interfaces";
import style from "@/styles/menu/menu-item";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LuLeaf } from "react-icons/lu";
import { RiLeafLine } from "react-icons/ri";
import { PiFlowerTulip } from "react-icons/pi";
import { useMenuContext } from "@/app/providers/MenuProvider";

// const { Title } = Typography;

function ItemListItem({
  id,
  img_urls,
  name,
  price,
  description,
  action,
  clickedComponent,
  ...item
}: Item) {
  const {
    token: { colorBgBase, colorPrimaryBg, cyan2, geekblue7 },
  } = theme.useToken();

  const { selectedLabel } = useMenuContext();

  const handleClick = (componentType: string, itemID: number) => {
    clickedComponent = componentType;
    action(clickedComponent, itemID);
  };

  const handleMenuClick: MenuProps["onClick"] = (e: any) => {
    if (e.key === "update") {
      handleClick("Update item", id);
    } else if (e.key === "delete") {
      handleClick("Delete item", id);
    }
  };

  const items: MenuProps["items"] = [
    {
      label: "Update",
      key: "update",
      icon: <MdEdit />,
    },
    {
      label: "Delete",
      key: "delete",
      icon: <RiDeleteBinLine />,
    },
  ];

  const labels =
    item.labels && item.custom_labels
      ? item.labels.concat(item.custom_labels)
      : item.labels
      ? item.labels
      : item.custom_labels
      ? item.custom_labels
      : [];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const getLabelIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case "vegan":
        return (
          <span>
            <LuLeaf />{" "}
          </span>
        );
      case "glutenfree":
        return (
          <span>
            <PiFlowerTulip />{" "}
          </span>
        );
      case "vegetarian":
        return (
          <span>
            <RiLeafLine />{" "}
          </span>
        );
      default:
        return <></>;
    }
  };

  const [fontSize, setFontSize] = useState(19);
  const titleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const titleElement = titleRef.current;
    if (titleElement) {
      const lineHeight = parseFloat(getComputedStyle(titleElement).lineHeight);
      const titleHeight = titleElement.offsetHeight;
      if (titleHeight > lineHeight) {
        setFontSize(18); // Set font size to 18 if title spans more than one line
      }
    }
  }, [name]);

  return (
    <Card
      onClick={() => handleClick("Update item", id)}
      hoverable={true}
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Transform.toString(transform),
        ...style.itemCard,
      }}
      {...attributes}
      {...listeners}
      cover={
        <Image
          preview={false}
          alt="example"
          src={
            img_urls && img_urls[0] && !img_urls[0].startsWith("http")
              ? process.env.NEXT_PUBLIC_IMAGES_URL + img_urls[0]
              : "/assets/images/mains1.png"
          }
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
            margin: 0,
            padding: 0,
            borderTopLeftRadius: "0.5rem",
            borderTopRightRadius: "0.5rem",
          }}
          width={280}
          height={100}
        />
      }
      bordered={false}
      bodyStyle={style.itemBodyStyle}
    >
      {selectedLabel === "Specials" && (
        <Image
          alt="fire icon outined"
          src={"/assets/fire_icon_item.svg"}
          style={style.fireIcon}
        />
      )}
      {selectedLabel != "Archived" && (
        <Dropdown menu={menuProps} placement="bottomRight">
          <div
            style={{
              background: colorPrimaryBg,
              ...style.itemOptions,
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <MdMoreHoriz color={colorBgBase} fontSize="1rem" />
          </div>
        </Dropdown>
      )}

      <div style={style.itemTitleContainer}>
        <span
          ref={titleRef}
          style={{
            fontSize: `${fontSize}px`,
            ...style.itemTitle,
          }}
          // style={{
          //   ...style.itemTitle,
          //   fontSize: "19px",
          // }}
        >
          {name ?? "Crypsy Buttermilk Fried"}
        </span>
        <p style={style.priceStyle}>{"$" + (price ?? "18.00")}</p>
        <p
          style={{
            color: geekblue7,
            ...style.itemDescription,
          }}
        >
          {description ? description : "Chicken, Oliva oil, salt, pepper"}
        </p>

        <div style={{ height: "5rem", margin: "0.8rem 0" }}>
          <Flex gap="0.5rem" wrap="wrap">
            <>
              {labels &&
                labels?.map((label, index) => {
                  return (
                    <div
                      key={index}
                      style={{
                        color: colorPrimaryBg,
                        border: `1px solid ${cyan2}`,
                        ...style.itemLable,
                      }}
                    >
                      {getLabelIcon(label)}
                      {label}
                    </div>
                  );
                })}
            </>
          </Flex>
        </div>
      </div>
    </Card>
  );
}

export default ItemListItem;
