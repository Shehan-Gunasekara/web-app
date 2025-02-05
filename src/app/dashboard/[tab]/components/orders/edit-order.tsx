import { Flex, theme, Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { UPDATE_ORDER } from "@/lib/mutations/orders";
import { useMutation } from "@apollo/client";
import { useOrderContext } from "@/app/providers/OrderProvider";
import ItemCounter from "./item-counter";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { Item, OrderDetail } from "@/utils/interfaces";
interface EditOrderProps {
  orderId: number;
  orderItems: Item[];
  handleEditModalVisibility: () => any;
  orderDetails: OrderDetail[];
  isPressUpdate: boolean;
  setIsPressUpdate: (state: boolean) => any;
}
function EditOrder({
  orderId,
  orderItems,
  orderDetails,
  handleEditModalVisibility,
  isPressUpdate,
  setIsPressUpdate,
}: EditOrderProps) {
  const {
    token: { blue7, colorBgBase },
  } = theme.useToken();
  const [updatedOrderItems, setUpdatedOrderItems] = useState([...orderItems]);
  const [updatedOrderdetails, setUpdatedOrderDetails] = useState([
    ...orderDetails,
  ]);
  const { handleIsOrderUpdated } = useOrderContext();

  const deleteItem = (itemIndex: number, id: number) => {
    setUpdatedOrderDetails((prevOrderDetails) => {
      return prevOrderDetails.map((item) => {
        if (item.item_id === id) {
          return { ...item, quantity: 0 };
        }
        return item;
      });
    });

    setUpdatedOrderItems((prevOrderItems) => {
      return prevOrderItems.filter((_, index) => index !== itemIndex);
    });
  };

  const handleIncrement = (itemIndex: number, id: number) => {
    setUpdatedOrderDetails((prevOrderDetails) => {
      return prevOrderDetails.map((item) => {
        if (item.item_id === id) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
    });
  };

  const handleDecrement = (itemIndex: number, id: number) => {
    setUpdatedOrderDetails((prevOrderDetails) => {
      return prevOrderDetails.map((item) => {
        if (item.item_id === id && item.quantity > 0) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });
    });
  };

  const [updateOrder, { loading }] = useMutation(UPDATE_ORDER);

  const handleUpdateOrder = async (
    _orderId: number,
    items: {
      item_id: number;
      quantity: number;
      total: number;
      order_id: number;
    }[]
  ) => {
    try {
      const res = await updateOrder({
        variables: {
          orderInput: {
            id: orderId,
            items: items,
          },
        },
      });
      console.log(res);
    } catch (_error: any) {
      console.log(_error?.message ?? _error);
    }
  };

  const handleUpdateOrderClick = async () => {
    const tformattedOrderDetails = updatedOrderdetails.map(
      ({ item_id, quantity }) => ({
        item_id,
        quantity: quantity,
        total: -1,
        order_id: orderId,
      })
    );

    await handleUpdateOrder(orderId, tformattedOrderDetails).then(() => {
      setIsPressUpdate(false);
      if (!loading) {
        handleIsOrderUpdated();
        handleEditModalVisibility();
      }
    });
  };

  useEffect(() => {
    if (isPressUpdate) {
      handleUpdateOrderClick();
    }
  }, [isPressUpdate]);
  return (
    <Flex vertical={true} justify="space-between" style={{ height: "100%" }}>
      <Flex vertical={true} gap={"0.4rem"} justify={"center"}>
        <Row justify={"space-between"} style={{ marginBottom: -4 }}>
          <Col
            style={{
              color: colorBgBase,
              fontSize: "12px",
              textAlign: "start",
              fontWeight: "400",
              width: "45%",
              lineHeight: "14.52px",
              marginLeft: "28px",
            }}
          >
            Items
          </Col>
          <Col
            style={{
              width: "20%",
              display: "flex",
              justifyContent: "flex-end",
              gap: "13px",
              fontWeight: "400",
              //border: "1px solid red",
            }}
          >
            <Col
              style={{
                color: colorBgBase,
                fontSize: "12px",
                textAlign: "right",
                fontWeight: 400,
                lineHeight: "14.52px",
                marginRight: "24.29px",
              }}
            >
              Qty
            </Col>
          </Col>
        </Row>
        {updatedOrderItems.map((order, index) => (
          <Flex
            key={index}
            vertical={false}
            justify="space-between"
            style={{
              marginLeft: "2px",

              color: blue7,
              fontWeight: "500",
            }}
          >
            <RiDeleteBin6Fill
              style={{
                cursor: "pointer",
                position: "absolute",
                marginTop: "5px",
              }}
              fontSize={"12px"}
              onClick={() => deleteItem(index, order.id)}
              name="delete-order-btn"
            />
            <span style={{ color: blue7, marginLeft: "25px" }}>
              {order.name}
            </span>
            <ItemCounter
              choiceLimit={false}
              count={
                updatedOrderdetails.find((item) => item.item_id === order.id)
                  ?.quantity!
                // orderDetails.map((orderItem,_index) => (
                //   orderItem.item_id === order.id && (
                //     orderItem.quantity
                //   )))
                // orderDetails[index] ? updatedOrderdetails[index].quantity : 0
              }
              handleDecrement={handleDecrement}
              handleIncrement={handleIncrement}
              index={index}
              id={order.id}
            />
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}

export default EditOrder;
