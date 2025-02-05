"use client";

import axios from "axios";
import { Form } from "antd";
import { useQuery, useMutation } from "@apollo/client";
import React, { createContext, useContext, useState } from "react";
import { ItemOptionGroup, ItemOptionList } from "@/utils/interfaces";
import { GET_ALL_ITEMS } from "@/lib/queries/items";
import { GET_ALL_MENUS, GET_ALL_CATEGORIES } from "@/lib/queries/menu";
import { UPLOAD_IMAGE } from "@/lib/mutations/file";
import { modifierOptions } from "@/constants/lonovm-constants";

const MenuContext = createContext<any>(null);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [form] = Form.useForm();

  const initialItemOptionGroups: ItemOptionGroup[] = [
    {
      type: modifierOptions.required.value,
      label: modifierOptions.required.label,
      description: modifierOptions.required.description,
      text: modifierOptions.required.text,
    },
    {
      type: modifierOptions.optional.value,
      label: modifierOptions.optional.label,
      description: modifierOptions.optional.description,
      text: modifierOptions.optional.text,
    },
  ];

  const initialItemOptionList: ItemOptionList[] = [];

  const [selectedStep, setSelectedStep] = useState(0);
  const [planOption, setPlanOption] = useState(modifierOptions.required.value);
  const [itemFileUrl, setItemFileUrl] = useState<string | null>(null);
  const [isExistingItem, setIsExistingItem] = useState(false);
  const [shouldRerender, setShouldRerender] = useState(false);
  const [updateOptionId, setUpdateOptionId] = useState<any>(undefined);

  const [menuUpdated, setMenuUpdated] = useState(false);
  const [categoryUpdated, setCategoryUpdated] = useState(false);
  const [categoryOrderUpdated, setCategoryOrderUpdated] = useState(false);
  const [itemOrderUpdated, setItemOrderUpdated] = useState(false);
  const [isUpdatingCategoryOrder, setIsUpdatingCategoryOrder] = useState(false);
  const [isUpdatingItemOrder, setIsUpdatingItemOrder] = useState(false);
  const [isUpdatingItemOption, setIsUpdatingItemOption] = useState(false);
  const [itemUpdated, setItemUpdated] = useState(false);
  const [menuCount, setMenuCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [specialMenuCount, setSpecialMenuCount] = useState(0);
  const [specialCategoryCount, setSpecialCategoryCount] = useState(0);
  const [specialItemCount, setSpecialItemCount] = useState(0);
  const [archivedMenuCount, setarchivedMenuCount] = useState(0);
  const [archivedCategoryCount, setarchivedCategoryCount] = useState(0);
  const [archivedItemCount, setarchivedItemCount] = useState(0);
  const [searchValue, setSearchValue] = useState("");

  const [itemOptionGroups, setItemOptionGroups] = useState<ItemOptionGroup[]>(
    initialItemOptionGroups
  );

  const [itemOptionList, setItemOptionList] = useState<ItemOptionList[]>(
    initialItemOptionList
  );

  const [selectedItemOptionList, setSelectedItemOptionList] = useState<
    ItemOptionList[]
  >([]);

  const [uploadImage] = useMutation(UPLOAD_IMAGE);
  const [itemFileUrls, setItemFileUrls] = useState<string[]>([]);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [clickedMenuCardId, setClickedMenuCardId] = useState(0);
  const [clickedCategoryCardId, setClickedCategoryCardId] = useState(0);
  const [selectedLabel, setSelectedLabel] = useState("Menu");

  let restaurant_id: number | null = null;
  if (typeof window !== "undefined") {
    const storedId = localStorage.getItem("lono_restaurant_id");
    if (storedId) {
      restaurant_id = parseInt(storedId, 10);
    }
  }
  const {
    data: menusData,
    loading: menusLoading,
    refetch: refetchMenus,
    error: menuError,
  } = useQuery<any>(GET_ALL_MENUS, {
    variables: {
      restaurant_id: restaurant_id,
    },
    fetchPolicy: "cache-first",
    onCompleted: () => {
      console.log("Menu data loaded!");
    },
    onError: () => {
      console.log("Failed to load menu data!");
    },
  });

  const {
    data: categoriesData,
    loading: categoriesLoading,
    refetch: refetchCategories,
    error: categoryError,
  } = useQuery<any>(GET_ALL_CATEGORIES, {
    variables: {
      restaurant_id: restaurant_id,
    },
    fetchPolicy: "cache-first",
    onCompleted: () => {
      console.log("Category data loaded!");
    },
    onError: () => {
      console.log("Failed to load category data!");
    },
  });

  const {
    data: itemsData,
    loading: itemsLoading,
    refetch: refetchItems,
    error: itemError,
  } = useQuery<any>(GET_ALL_ITEMS, {
    variables: {
      restaurant_id: restaurant_id,
    },
    fetchPolicy: "cache-first",
    onCompleted: () => {
      console.log("Category data loaded!");
    },
    onError: () => {
      console.log("Failed to load category data!");
    },
  });

  const updateCurrentStep = (
    isNext: boolean,
    nextPlan: string = modifierOptions.required.value
  ) => {
    if (isNext) {
      if (nextPlan != planOption) {
        setPlanOption(nextPlan);
      }
      setSelectedStep((prevStep: number) => prevStep + 1);
    } else {
      setIsExistingItem(false);
      setSelectedStep((prevStep: number) => prevStep - 1);
    }
  };

  function generateRandomString(length: number) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const resizeAndCropImage = (file: File, maxSize: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const size = Math.min(img.width, img.height);
        canvas.width = maxSize;
        canvas.height = maxSize;

        if (ctx) {
          ctx.drawImage(
            img,
            (img.width - size) / 2,
            (img.height - size) / 2,
            size,
            size,
            0,
            0,
            maxSize,
            maxSize
          );

          canvas.toBlob((blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
              });
              resolve(resizedFile);
            } else {
              reject(new Error("Canvas is empty"));
            }
          }, file.type);
        } else {
          reject(new Error("Canvas context is not available"));
        }
      };
      img.onerror = reject;
    });
  };

  // Function to handle file upload
  const handleFileUpload = async (file: any) => {
    const resizedImage = await resizeAndCropImage(file, 512);
    file = new File([resizedImage], file.name, { type: file.type });
    try {
      setIsImageUploading(true);
      const extension = file.name.substring(file.name.lastIndexOf(".") + 1);
      const randomString = generateRandomString(10) + Date.now();
      const fileName = extension
        ? randomString + "." + extension
        : randomString;

      // Make a request to your backend to get the signed URL
      const response = await uploadImage({
        variables: {
          input: {
            file_name: fileName,
            folder_name: "food",
            file_extension: file.type,
          },
        },
      });

      // Extract the signed URL from the response
      const signedURL = response.data.getFileUploadUrl;

      // Upload the file to the signed URL
      await axios.put(signedURL, file, {
        headers: {
          "Content-Type": file.type,
        },
      });
      setItemFileUrls(["food/" + fileName]);

      setItemFileUrl("food/" + fileName);
      setIsImageUploading(false);
    } catch (_error) {
      setIsImageUploading(false);
    }
  };

  const updateMenuAdded = () => {
    setMenuUpdated(!menuUpdated);
  };

  const updateCategoryAdded = () => {
    setCategoryUpdated(!categoryUpdated);
  };

  const updatedCategoryOrder = () => {
    setCategoryOrderUpdated(!categoryOrderUpdated);
  };

  const updatedItemOrder = () => {
    setItemOrderUpdated(!itemOrderUpdated);
  };

  const updatingCategoryOrder = (state: boolean) => {
    setIsUpdatingCategoryOrder(state);
  };
  const updatingItemOrder = (state: boolean) => {
    setIsUpdatingItemOrder(state);
  };

  const updateItemAdded = () => {
    setItemUpdated(!itemUpdated);
  };

  return (
    <MenuContext.Provider
      value={{
        form,
        initialItemOptionGroups,
        itemOptionGroups,
        setItemOptionGroups,
        selectedStep,
        setSelectedStep,
        updateCurrentStep,
        planOption,
        setPlanOption,
        itemOptionList,
        setItemOptionList,
        selectedItemOptionList,
        setSelectedItemOptionList,
        isExistingItem,
        setIsExistingItem,
        isUpdatingItemOption,
        setIsUpdatingItemOption,
        updateOptionId,
        setUpdateOptionId,
        shouldRerender,
        setShouldRerender,
        updateItemAdded,
        updateMenuAdded,
        updateCategoryAdded,
        updatedCategoryOrder,
        updatedItemOrder,
        updatingCategoryOrder,
        updatingItemOrder,
        isUpdatingCategoryOrder,
        isUpdatingItemOrder,
        itemFileUrls,
        isImageUploading,
        setIsImageUploading,
        menuUpdated,
        categoryUpdated,
        categoryOrderUpdated,
        itemOrderUpdated,
        itemUpdated,
        itemFileUrl,
        handleFileUpload,
        setItemFileUrls,
        menuCount,
        setMenuCount,
        categoryCount,
        setCategoryCount,
        itemCount,
        setItemCount,
        specialMenuCount,
        setSpecialMenuCount,
        specialCategoryCount,
        setSpecialCategoryCount,
        specialItemCount,
        setSpecialItemCount,
        clickedMenuCardId,
        setClickedMenuCardId,
        clickedCategoryCardId,
        setClickedCategoryCardId,
        setSearchValue,
        searchValue,
        selectedLabel,
        setSelectedLabel,
        setarchivedItemCount,
        setarchivedCategoryCount,
        setarchivedMenuCount,
        archivedItemCount,
        archivedCategoryCount,
        archivedMenuCount,
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
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenuContext() {
  return useContext(MenuContext);
}
