import React, { useEffect, useRef, useState } from "react";
import { Layout, Divider, theme, Button } from "antd";
import ListContentDraggable from "./list-content-draggable";
import { DELETE_MENU, DELETE_CATEGORY } from "@/lib/mutations/menu";
import { ARCHIVE_MENU, ARCHIVE_CATEGORY } from "@/lib/mutations/menu";
import { ARCHIVE_ITEM } from "@/lib/mutations/item";
import { useMutation } from "@apollo/client";
import { useMenuContext } from "@/app/providers/MenuProvider";
import ConfirmationModal from "@/app/components/confirmation-modal";
import { DELETE_ITEM } from "@/lib/mutations/item";
import MenuCardSkeleton from "@/app/components/skeletons/menu/menu-card";
import ItemCardSkeleton from "@/app/components/skeletons/menu/item-card";
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown } from "antd";
import style from "@/styles/menu/left-content";
import SkeletonDropdownMenu from "@/app/components/skeletons/menu/menu-dropdown";
import LoadingErrorHandler from "@/app/components/errors/loadingErrorHandler";
import DeleteCheckModal from "./delete-check-modal";
import { PiDotOutlineFill } from "react-icons/pi";
import ToastMessage from "@/app/components/toast-message";
import { dashboardMetrics } from "@/constants/lonovm-constants";

interface MenuItemProps {
  setMenuLoading: (loading: boolean) => void;
  setCategoryLoading: (loading: boolean) => void;
  setItemLoading: (loading: boolean) => void;
  setMenuError: (error: boolean) => void;
  setCategoryError: (error: boolean) => void;
  setItemError: (error: boolean) => void;
  callRetry: boolean;
}

interface Category {
  id: number;
  name: string;
  menu: any;
}

function LeftContent({
  setMenuLoading,
  setCategoryLoading,
  setItemLoading,
  setMenuError,
  setCategoryError,
  setItemError,
  callRetry,
}: MenuItemProps) {
  const {
    token: {
      colorBgBase,
      colorTextBase,
      colorBgContainerDisabled,
      cyan1,
      colorWhite,
      colorInfoBg,
    },
  } = theme.useToken();

  const {
    menuUpdated,
    categoryUpdated,
    categoryOrderUpdated,
    updatingCategoryOrder,
    isUpdatingCategoryOrder,
    isUpdatingItemOrder,
    updatingItemOrder,
    itemUpdated,
    itemOrderUpdated,
    updateMenuAdded,
    updateCategoryAdded,
    updateItemAdded,
    setMenuCount,
    setSpecialMenuCount,
    setCategoryCount,
    setSpecialCategoryCount,
    setItemCount,
    setSpecialItemCount,
    clickedMenuCardId,
    clickedCategoryCardId,
    searchValue,
    setClickedMenuCardId,
    setClickedCategoryCardId,
    selectedLabel,
    setSelectedLabel,
    setarchivedItemCount,
    setarchivedCategoryCount,
    setarchivedMenuCount,
    menusData,
    menusLoading,
    menuError,
    refetchMenus,
    categoriesData,
    categoriesLoading,
    categoryError,
    refetchCategories,
    itemsData,
    itemsLoading,
    itemError,
    refetchItems,
  } = useMenuContext();

  const [IsAddItemModalVisible, setIsAddItemModalVisible] = useState(false);
  const [IsAddMenuModalVisible, setIsAddMenuModalVisible] = useState(false);
  const [IsAddCategoryModalVisible, setIsAddCategoryModalVisible] =
    useState(false);
  const [clickedAddComponent, setClickedAddComponent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [id, setId] = useState(0);
  const [isDeleteCheckVisible, setIsDeleteCheckVisible] = useState(false);
  const [isDeleteProhibited, setIsDeleteProhibited] = useState(false);
  // const [confirmArchive, setConfirmArchive] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [type, setType] = useState("");
  // const [selectedLabel, setSelectedLabel] = useState("Menu");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResultsMenu, setSearchResultsMenu] = useState<any[]>([]);
  const [searchResultsCategory, setSearchResultsCategory] = useState<any[]>([]);
  const [searchResultsItem, setSearchResultsItem] = useState<any[]>([]);
  const renderCount = useRef<number>(0);
  const [toastMessage, setToastMessage] = useState("");
  const [toastMsgStyle, setToastMsgStyle] = useState("");

  const {
    token: {},
  } = theme.useToken();

  const [deleteMenu] = useMutation<any>(DELETE_MENU);
  const [deleteCategory] = useMutation<any>(DELETE_CATEGORY);
  const [deleteItem] = useMutation<any>(DELETE_ITEM);
  const [archiveData] = useMutation<any>(
    type == "menu"
      ? ARCHIVE_MENU
      : type == "category"
      ? ARCHIVE_CATEGORY
      : ARCHIVE_ITEM
  );

  const menuList =
    menusData && menusData.getAllMenus && menusData.getAllMenus.menus;
  const categoryList = categoriesData && categoriesData.getAllCategorys;
  const itemListData = itemsData && itemsData.getAllItems;

  const menuListSpecial =
    menuList && menuList.filter((menu: any) => menu.is_special === true);

  const menuListNormal =
    menuList &&
    menuList.filter(
      (menu: any) => menu.is_special === false && menu.is_deleted === false
    );

  const menuListArchived =
    menuList &&
    menuList.filter(
      (menu: any) => menu.is_deleted === true || menu.is_items_deleted === true
    );

  const clickedMenuCard =
    menuList && menuList.filter((menu: any) => menu.id === clickedMenuCardId);

  const filteredCategoryList =
    selectedLabel === "Archived"
      ? categoryList && menuListArchived && menuListArchived.length > 0
        ? categoryList.filter((category: any) => {
            if (category.menu) {
              return (
                category.menu.id === clickedMenuCardId &&
                (category.is_deleted === true ||
                  category.is_items_deleted === true)
              );
            }
          })
        : []
      : selectedLabel === "Menu"
      ? categoryList &&
        categoryList.filter((category: any) => {
          if (category && menuListNormal && menuListNormal.length > 0) {
            return (
              category.menu.id === clickedMenuCardId &&
              category.is_deleted === false
            );
          }
        })
      : categoryList &&
        categoryList.filter((category: any) => {
          if (category && menuListSpecial && menuListSpecial.length > 0) {
            return (
              category.menu.id === clickedMenuCardId &&
              category.is_deleted === false
            );
          }
        });

  const clickedCategoryCard =
    categoryList &&
    categoryList.filter(
      (category: any) => category.id === clickedCategoryCardId
    );

  const filteredItemList =
    selectedLabel === "Archived"
      ? itemListData &&
        (clickedCategoryCardId
          ? itemListData?.filter(
              (item: any) =>
                // item.menu_id === clickedMenuCardId &&
                item.category_id === clickedCategoryCardId && item.is_deleted
            )
          : itemListData?.filter(
              (item: any) =>
                // item.menu_id === clickedMenuCardId &&
                item.menu_id === clickedMenuCardId && item.is_deleted
            ))
      : itemListData &&
        (clickedCategoryCardId
          ? itemListData?.filter(
              (item: any) =>
                // item.menu_id === clickedMenuCardId &&
                item.category_id === clickedCategoryCardId &&
                item.is_deleted == false
            )
          : itemListData?.filter(
              (item: any) =>
                // item.menu_id === clickedMenuCardId &&
                item.menu_id === clickedMenuCardId && item.is_deleted == false
            ));

  //Refetch data when menu is added
  useEffect(() => {
    refetchMenus();
    if (menusData && menusData.getAllMenus) {
      setMenuCount(menusData.getAllMenus.menuCount ?? 0);
      setSpecialMenuCount(menusData.getAllMenus.specialMenuCount ?? 0);
      setarchivedMenuCount(menusData.getAllMenus.archivedMenuCount ?? 0);
    }
  }, [menuUpdated]);

  //Refetch data when category is added
  useEffect(() => {
    refetchCategories();
    if (menusData && menusData.getAllMenus) {
      setCategoryCount(menusData.getAllMenus.categoryCount ?? 0);
      setSpecialCategoryCount(menusData.getAllMenus.specialCategoryCount ?? 0);
      setarchivedCategoryCount(menusData.getAllMenus.archiveCategoryCount ?? 0);
    }
  }, [categoryUpdated]);

  useEffect(() => {
    if (isUpdatingCategoryOrder) {
      refetchCategories().then(() => {
        updatingCategoryOrder(false);
      });
      if (menusData && menusData.getAllMenus) {
        setCategoryCount(menusData.getAllMenus.categoryCount ?? 0);
        setSpecialCategoryCount(
          menusData.getAllMenus.specialCategoryCount ?? 0
        );
        setarchivedCategoryCount(
          menusData.getAllMenus.archiveCategoryCount ?? 0
        );
      }
    }
  }, [categoryOrderUpdated]);

  //Refetch data when item is added
  useEffect(() => {
    refetchItems();
    if (menusData && menusData.getAllMenus) {
      setItemCount(menusData.getAllMenus.itemCount ?? 0);
      setSpecialItemCount(menusData.getAllMenus.specialItemCount ?? 0);
      setarchivedItemCount(menusData.getAllMenus.archivedItemCount ?? 0);
    }
  }, [itemUpdated]);

  //Refetch data when item is added
  useEffect(() => {
    if (isUpdatingItemOrder) {
      refetchItems().then(() => {
        updatingItemOrder(false);
      });
      if (menusData && menusData.getAllMenus) {
        setItemCount(menusData.getAllMenus.itemCount ?? 0);
        setSpecialItemCount(menusData.getAllMenus.specialItemCount ?? 0);
        setarchivedItemCount(menusData.getAllMenus.archivedItemCount ?? 0);
      }
    }
  }, [itemOrderUpdated]);

  // Render the latest info about the counted menus
  useEffect(() => {
    if (menusData && menusData.getAllMenus) {
      setMenuCount(menusData.getAllMenus.menuCount ?? 0);
      setSpecialMenuCount(menusData.getAllMenus.specialMenuCount ?? 0);
      setCategoryCount(menusData.getAllMenus.categoryCount ?? 0);
      setSpecialCategoryCount(menusData.getAllMenus.specialCategoryCount ?? 0);
      setItemCount(menusData.getAllMenus.itemCount ?? 0);
      setSpecialItemCount(menusData.getAllMenus.specialItemCount ?? 0);
      setarchivedItemCount(menusData.getAllMenus.archivedItemCount ?? 0);
      setarchivedCategoryCount(menusData.getAllMenus.archiveCategoryCount ?? 0);
      setarchivedMenuCount(menusData.getAllMenus.archivedMenuCount ?? 0);
    }
  }, [menuList, categoryList, itemListData]);

  // select cards on render
  const selectCard = () => {
    if (selectedLabel === "Menu") {
      menusData &&
        menuListNormal[0] &&
        setClickedMenuCardId(
          menusData && menuListNormal[0] && menuListNormal[0].id
        );

      const selectedCategoryList =
        menuListNormal[0] &&
        categoryList.filter((category: Category) => {
          if (category.menu) {
            return category.menu.id === menuListNormal[0].id;
          }
        });

      selectedCategoryList &&
        selectedCategoryList[0] &&
        setClickedCategoryCardId(
          selectedCategoryList &&
            selectedCategoryList[0] &&
            selectedCategoryList[0].id
        );
    } else if (selectedLabel === "Specials") {
      menusData &&
        menuListSpecial[0] &&
        setClickedMenuCardId(
          menusData && menuListSpecial[0] && menuListSpecial[0].id
        );

      const selectedCategoryListSpecial = categoryList.filter(
        (category: Category) => {
          if (category.menu) {
            return category.menu.id === menuListSpecial[0].id;
          }
        }
      );

      selectedCategoryListSpecial &&
        selectedCategoryListSpecial[0] &&
        setClickedCategoryCardId(
          selectedCategoryListSpecial &&
            selectedCategoryListSpecial[0] &&
            selectedCategoryListSpecial[0].id
        );
    } else if (selectedLabel === "Archived") {
      menusData &&
        menuListArchived[0] &&
        setClickedMenuCardId(
          menusData && menuListArchived[0] && menuListArchived[0].id
        );

      const selectedCategoryList =
        menuListArchived[0] &&
        categoryList.filter((category: Category) => {
          if (category.menu) {
            return category.menu.id === menuListArchived[0].id;
          }
        });

      selectedCategoryList &&
        selectedCategoryList[0] &&
        setClickedCategoryCardId(
          selectedCategoryList &&
            selectedCategoryList[0] &&
            selectedCategoryList[0].id
        );
    }
  };

  useEffect(() => {
    if (
      menusData &&
      menuList[0] &&
      menuList[0].id &&
      categoriesData &&
      categoryList[0] &&
      categoryList[0].id
    ) {
      if (renderCount.current === 0) {
        selectCard();
        renderCount.current++;
      }
    }
  }, [categoriesData, menusData]);

  useEffect(() => {
    if (
      menusData &&
      menuList[0] &&
      menuList[0].id &&
      categoriesData &&
      categoryList[0] &&
      categoryList[0].id
    ) {
      selectCard();
    }
  }, [selectedLabel]);

  // Until the page is loaded properly
  useEffect(() => {
    if (!menusLoading) {
      setMenuLoading(false);
      setMenuError(false);
    }
    if (!categoriesLoading) {
      setCategoryLoading(false);
      setCategoryError(false);
    }
    if (!itemsLoading) {
      setItemLoading(false);
      setItemError(false);
    }
    menuError && setMenuError(true);
    categoryError && setCategoryError(true);
    itemError && setItemError(true);
  }, [
    menusLoading,
    categoriesLoading,
    itemsLoading,
    menuError,
    categoryError,
    itemError,
  ]);

  const closeIsDeletableModal = () => {
    setIsDeleteCheckVisible(false);
    setIsDeleteModalVisible(false);
  };

  const handleShowDeleteModal = () => {
    setIsDeleteCheckVisible(false);
    setIsDeleteModalVisible(true);
  };

  const handleCancelClick = () => {
    setIsDeleteModalVisible(false);
  };

  const handleArchive = () => {
    archiveData({
      variables: {
        id: id,
      },
      onCompleted: (data: any) => {
        console.log(`${type} data has been archived!`);
        console.log(data);
        setIsDeleteCheckVisible(!isDeleteCheckVisible);
        updateItemAdded();
        updateCategoryAdded();
        updateMenuAdded();

        setToastMessage(`${type} data has been archived!`);
        setToastMsgStyle("success");
      },
      onError: (err: any) => {
        console.log(`Failed to archive ${type} data!`);
        console.log(err);
        if (err.graphQLErrors) {
          err.graphQLErrors.forEach((error: any) => {
            console.log("GraphQL Error:", error.message);
            console.log("Path:", error.path);
            console.log("Locations:", error.locations);
          });
        }
        setIsDeleteCheckVisible(!isDeleteCheckVisible);

        setToastMessage(`Failed to archive ${type} data!`);
        setToastMsgStyle("error");
      },
    });
  };

  const handleDeleteClick = async () => {
    if (type === "menu") {
      try {
        const _response = await deleteMenu({
          variables: {
            id: id,
          },
        });
        setIsDeleteModalVisible(false);
        updateItemAdded();
        updateCategoryAdded();
        updateMenuAdded();
      } catch (_error) {}
    } else if (type === "category") {
      try {
        const _response = await deleteCategory({
          variables: {
            id: id,
          },
        });
        setIsDeleteModalVisible(false);
        updateItemAdded();
        updateCategoryAdded();
        updateMenuAdded();
      } catch (_error) {}
    } else if (type === "item") {
      try {
        const _response = await deleteItem({
          variables: {
            id: id,
          },
        });
        setIsDeleteModalVisible(false);
        updateItemAdded();
        updateCategoryAdded();
      } catch (_error) {}
    }
  };

  const handleAddClick = async (clickedItem = "", itemId: any) => {
    if (clickedItem.includes("Add menu")) {
      setClickedAddComponent("Add menu");
      setModalTitle("Add menu");
      setIsAddMenuModalVisible(!IsAddMenuModalVisible);
    } else if (clickedItem.includes("Add category")) {
      setClickedAddComponent("Add category");
      setIsAddCategoryModalVisible(!IsAddCategoryModalVisible);
    } else if (clickedItem.includes("Add item")) {
      setClickedAddComponent("Add item");
      setIsAddItemModalVisible(!IsAddItemModalVisible);
    } else if (clickedItem === "Update menu") {
      setId(itemId);
      setClickedAddComponent("Update menu");
      setModalTitle("Update menu");
      setIsAddMenuModalVisible(!IsAddMenuModalVisible);
    } else if (clickedItem === "Update category") {
      setId(itemId);
      setClickedAddComponent("Update category");
      setModalTitle("Update category");
      setIsAddMenuModalVisible(!IsAddCategoryModalVisible);
    } else if (clickedItem === "Update item") {
      setId(itemId);
      setClickedAddComponent("Update item");
      setModalTitle("Update item");
      setIsAddItemModalVisible(!IsAddItemModalVisible);
    } else if (clickedItem === "Delete menu") {
      setId(itemId);
      setType("menu");
      setModalTitle("Delete menu");
      setIsDeleteCheckVisible(!isDeleteCheckVisible);
    } else if (clickedItem === "Delete category") {
      setId(itemId);
      setType("category");
      setModalTitle("Delete category");
      setIsDeleteCheckVisible(!isDeleteCheckVisible);
    } else if (clickedItem === "Delete item") {
      setId(itemId);
      setType("item");
      setModalTitle("Delete item");
      setIsDeleteCheckVisible(!isDeleteCheckVisible);
    }
  };

  const menuCardSkeleton = (count: number) => {
    const skeletons = [];
    for (let i = 0; i < count; i++) {
      skeletons.push(<MenuCardSkeleton key={i} />);
    }
    return skeletons;
  };

  //menu seach bar
  const searchMenuItems = (input: string) => {
    setIsSearching(true);
    if (menuList) {
      const filteredMenu = menuList.filter((menuItem: any) => {
        const matchesMenuName = menuItem.name
          .toLowerCase()
          .includes(input.toLowerCase());
        return matchesMenuName;
      });
      setSearchResultsMenu(filteredMenu);
    }
    if (categoryList) {
      const filteredCategory = categoryList.filter((categoryItem: any) => {
        const matchesCategoryName = categoryItem.name
          .toLowerCase()
          .includes(input.toLowerCase());
        return matchesCategoryName;
      });
      setSearchResultsCategory(filteredCategory);
    }
    if (itemListData) {
      const filteredItems = itemListData.filter((item: any) => {
        const itemName = item.name;
        const matchesItemName =
          itemName && itemName.toLowerCase().includes(input.toLowerCase());
        return matchesItemName;
      });
      setSearchResultsItem(filteredItems);
    }
  };

  useEffect(() => {
    if (searchValue === "") {
      setIsSearching(false);
      return;
    }
    searchMenuItems(searchValue);
  }, [searchValue]);

  const handleMenuClick = (e: any) => {
    setSelectedLabel(e.key);
  };

  const items: MenuProps["items"] = [
    {
      key: "Menu",
      label: (
        <p style={{ color: colorInfoBg, ...style.menuDropDownFont }}>Menu</p>
      ),
    },
    {
      key: "Specials",
      label: (
        <p style={{ color: colorInfoBg, ...style.menuDropDownFont }}>
          Specials
        </p>
      ),
    },
    {
      key: "Archived",
      label: (
        <p style={{ color: colorInfoBg, ...style.menuDropDownFont }}>
          Archived
        </p>
      ),
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
    backgroundColor: colorBgContainerDisabled,
  };

  const handleRetryClick = () => {
    if (menuError) {
      refetchMenus();
    }
    if (categoryError) {
      refetchCategories();
    }
    if (itemError) {
      refetchItems();
    }
  };

  useEffect(() => {
    handleRetryClick();
  }, [callRetry]);

  // This design requirement has been changed and removed from the page
  /**
   * This renders parent menu name beside the main item name outline
   * @param renderable
   * @param elmType
   * @returns html design
   */
  const _renderBaseMenuName = (renderable: boolean, elmType: string) => {
    if (renderable) {
      return (
        <>
          <div>
            <PiDotOutlineFill
              style={{
                color: cyan1,
                width: "1rem",
                height: "0.9rem",
              }}
            />
          </div>
          <p
            style={{
              color: colorTextBase,
              ...style.rowTextTwo,
            }}
          >
            {elmType == dashboardMetrics.category
              ? clickedMenuCard[0].name
              : clickedCategoryCard[0].name}
          </p>
        </>
      );
    }
  };

  if (menuError || categoryError || itemError) {
    <LoadingErrorHandler
      handleRetryClick={handleRetryClick}
      text={"table content"}
    />;
  }

  return (
    <Layout style={{ background: colorBgBase, ...style.containter }}>
      <div style={style.menuDropdownContainer}>
        {!menusLoading && menusData ? (
          <Dropdown menu={menuProps} placement="bottom" arrow>
            <Button
              style={{
                border: `1px solid ${colorTextBase}`,
                ...style.menuBtn,
              }}
            >
              <div style={{ color: colorWhite, ...style.menuLabel }}>
                {selectedLabel}
              </div>
              <div style={{ position: "absolute", right: 10 }}>
                <DownOutlined />
              </div>
            </Button>
          </Dropdown>
        ) : menuError ? null : (
          <SkeletonDropdownMenu />
        )}
      </div>

      <div style={style.rowContainer}>
        <p
          style={{
            color: cyan1,
            ...style.rowTextMenu,
          }}
        >
          Menus
        </p>

        <div style={{ width: "100%" }}>
          <Divider
            style={{
              borderTop: `1px solid ${colorBgContainerDisabled}`,
              padding: 0,
              margin: 0,
            }}
          />
        </div>
      </div>

      {!menusLoading && menusData ? (
        <>
          {isSearching ? (
            <ListContentDraggable
              itemType="menu"
              itemList={searchResultsMenu}
              addItemText="Add menu"
              action={handleAddClick}
              clickedComponent={clickedAddComponent}
              modalVisibility={IsAddMenuModalVisible}
              modalTitle={modalTitle}
              itemId={id}
            />
          ) : selectedLabel === "Menu" ? (
            <ListContentDraggable
              itemType="menu"
              itemList={menuListNormal}
              addItemText="Add menu"
              action={handleAddClick}
              clickedComponent={clickedAddComponent}
              modalVisibility={IsAddMenuModalVisible}
              modalTitle={modalTitle}
              itemId={id}
            />
          ) : selectedLabel === "Specials" ? (
            <ListContentDraggable
              itemType="menu"
              itemList={menuListSpecial}
              addItemText="Add menu"
              action={handleAddClick}
              clickedComponent={clickedAddComponent}
              modalVisibility={IsAddMenuModalVisible}
              modalTitle={modalTitle}
              itemId={id}
            />
          ) : (
            <ListContentDraggable
              itemType="menu"
              itemList={menuListArchived}
              addItemText="Add menu"
              action={handleAddClick}
              clickedComponent={clickedAddComponent}
              modalVisibility={IsAddMenuModalVisible}
              modalTitle={modalTitle}
              itemId={id}
            />
          )}
        </>
      ) : menuError ? (
        <div style={{ marginTop: 20 }}>
          <LoadingErrorHandler
            handleRetryClick={handleRetryClick}
            text={"menus"}
          />
        </div>
      ) : (
        <div style={{ display: "flex" }}>{menuCardSkeleton(5)}</div>
      )}

      <div style={style.rowContainer}>
        <p
          style={{
            color: cyan1,
            ...style.rowTextMenu,
          }}
        >
          Categories
        </p>

        {/* {renderBaseMenuName((clickedMenuCard && clickedMenuCard[0]), dashboardMetrics.category)} */}

        <Divider
          style={{
            borderTop: `1px solid ${colorBgContainerDisabled}`,
            padding: 0,
            margin: 0,
          }}
        />
      </div>

      {!categoriesLoading && categoriesData ? (
        <>
          {isSearching ? (
            <ListContentDraggable
              itemType="category"
              itemList={searchResultsCategory}
              addItemText="Add category"
              action={handleAddClick}
              clickedComponent={clickedAddComponent}
              modalVisibility={IsAddCategoryModalVisible}
              modalTitle="Add category"
              itemId={id}
            />
          ) : (
            <ListContentDraggable
              itemType="category"
              itemList={filteredCategoryList}
              addItemText="Add category"
              action={handleAddClick}
              clickedComponent={clickedAddComponent}
              modalVisibility={IsAddCategoryModalVisible}
              modalTitle="Add category"
              itemId={id}
            />
          )}
        </>
      ) : categoryError ? (
        <div style={{ marginTop: 20 }}>
          <LoadingErrorHandler
            handleRetryClick={handleRetryClick}
            text={"categories"}
          />
        </div>
      ) : (
        <div style={{ display: "flex" }}>
          <MenuCardSkeleton />
        </div>
      )}

      <div style={style.rowContainer}>
        <p
          style={{
            color: cyan1,
            ...style.rowTextMenu,
          }}
        >
          Items
        </p>

        {/* {renderBaseMenuName((clickedCategoryCard && clickedCategoryCard[0]), dashboardMetrics.item)} */}

        <Divider
          style={{
            borderTop: `1px solid ${colorBgContainerDisabled}`,
            padding: 0,
            margin: 0,
          }}
        />
      </div>

      {!itemsLoading && itemsData ? (
        <>
          {isSearching ? (
            <ListContentDraggable
              itemType="item"
              itemList={searchResultsItem}
              addItemText="Add item"
              action={handleAddClick}
              clickedComponent={clickedAddComponent}
              modalVisibility={IsAddItemModalVisible}
              modalTitle="Add a New Item"
              itemId={id}
            />
          ) : (
            <ListContentDraggable
              itemType="item"
              itemList={filteredItemList}
              addItemText="Add item"
              action={handleAddClick}
              clickedComponent={clickedAddComponent}
              modalVisibility={IsAddItemModalVisible}
              modalTitle="Add a New Item"
              itemId={id}
            />
          )}
        </>
      ) : itemError ? (
        <div style={{ marginTop: 20 }}>
          <LoadingErrorHandler
            handleRetryClick={handleRetryClick}
            text={"items"}
          />
        </div>
      ) : (
        <div style={{ display: "flex" }}>
          <ItemCardSkeleton />
        </div>
      )}

      {isDeleteCheckVisible && (
        <DeleteCheckModal
          modalTitle={modalTitle}
          modalVisibility={isDeleteCheckVisible}
          itemId={id}
          type={type}
          messageOne={`Sorry, this ${type} cannot be deleted.`}
          messageTwo={`It is being used in an active order.`}
          btnCancelText="Close"
          handleCancelClick={closeIsDeletableModal}
          handleShowDeleteModal={handleShowDeleteModal}
          isDeleteProhibited={isDeleteProhibited}
          setIsDeleteProhibited={setIsDeleteProhibited}
          onHandleArchive={handleArchive}
        />
      )}

      <ConfirmationModal
        modalTitle={modalTitle}
        modalVisibility={isDeleteModalVisible}
        itemId={id}
        message={`Are you sure want to delete this ${type}?`}
        btnCancelText="Cancel"
        btnConfirmText="Delete"
        handleCancelClick={handleCancelClick}
        handleConfirmClick={handleDeleteClick}
      />
      {toastMessage !== "" && (
        <ToastMessage
          show={toastMessage !== ""}
          message={toastMessage}
          style={toastMsgStyle}
        />
      )}
    </Layout>
  );
}

export default LeftContent;
