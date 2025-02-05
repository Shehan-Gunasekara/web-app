import React, { useState } from "react";
import {
  Button,
  Image,
  Layout,
  Upload,
  Divider,
  Spin,
  message,
  theme,
} from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { GET_RESTAURANT } from "@/lib/queries/restaurants";
import { UPLOAD_IMAGE } from "@/lib/mutations/file";
import axios from "axios";
import { UPDATE_RESTAURANT } from "@/lib/mutations/restaurant";
import { IoCameraOutline } from "react-icons/io5";
import AccountInfo from "./components/account-info";
import ProfileSkeleton from "@/app/components/skeletons/profile/profile";
import style from "@/styles/profile/profile";

const { Content } = Layout;

function ProfilePage() {
  const {
    token: { colorBgBase, colorTextBase, colorTextDisabled, colorBgContainer },
  } = theme.useToken();

  const [isImageUploading, setIsImageUploading] = useState(false);

  let restaurant_id: number | null = null;
  if (typeof window !== "undefined") {
    const storedId = localStorage.getItem("lono_restaurant_id");
    if (storedId) {
      restaurant_id = parseInt(storedId, 10);
    }
  }

  const { data, loading } = useQuery<any>(GET_RESTAURANT, {
    variables: {
      id: restaurant_id,
    },
  });

  const restaurantData = data && data.getRestaurant;

  const [uploadImage] = useMutation(UPLOAD_IMAGE);

  const [itemFileUrl, setItemFileUrl] = useState<string | null>(null);

  const [updateRestaurant] = useMutation<any>(UPDATE_RESTAURANT);

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
      // Make a request to your backend to get the signed URL
      const response = await uploadImage({
        variables: {
          input: {
            file_name: file.name,
            folder_name: "restaurant_pic",
            file_extension: file.type,
          },
        },
      });

      // Extract the signed URL from the response
      const signedURL = response.data.getFileUploadUrl;

      // Upload the file to the signed URL
      try {
        await axios.put(signedURL, file, {
          headers: {
            "Content-Type": file.type,
          },
        });
      } catch (err) {
        console.log("error while uploading image", err);
      }
      setItemFileUrl("restaurant_pic/" + file.name);

      const { data: _updateData } = await updateRestaurant({
        variables: {
          input: {
            id: restaurant_id,
            image: "restaurant_pic/" + file.name,
          },
        },
      });
      setIsImageUploading(false);
    } catch (_error) {
      setIsImageUploading(false);
      message.error("Error while uploading image. Please try again");
    }
  };

  return loading && !restaurantData ? (
    <ProfileSkeleton />
  ) : (
    <Content style={{ background: colorBgBase }}>
      <div style={{ ...style.baseContainer }}>
        <div style={{ ...style.logoContainer }}>
          <div
            style={{
              ...style.logoInnerContainer,
              backgroundColor: colorBgContainer,
            }}
          >
            <div
              style={{
                ...style.logoTitle,
                color: colorTextBase,
              }}
            >
              {"Restaurant Logo"}
            </div>
            <div style={{ ...style.logoDivider }}>
              <Divider
                style={{
                  ...style.logoDividerMargin,
                  backgroundColor: colorTextBase,
                }}
              />
            </div>
            {isImageUploading ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "16rem",
                }}
              >
                <Spin />
              </div>
            ) : (
              <Image
                width={"12vw"}
                preview={false}
                src={
                  itemFileUrl
                    ? process.env.NEXT_PUBLIC_IMAGES_URL + itemFileUrl
                    : restaurantData?.image &&
                      !restaurantData?.image.startsWith("http")
                    ? process.env.NEXT_PUBLIC_IMAGES_URL + restaurantData?.image
                    : "/assets/chef-restuarant.png"
                }
                alt="Restuarant logo"
                style={{ ...style.logoImage }}
              />
            )}
          </div>

          <div
            style={{
              color: colorTextDisabled,
              textAlign: "justify",
              marginTop: "0.8rem",
            }}
          >
            {
              "Please use a high resolution square image (1:1), minimum 150 x 150px"
            }
          </div>

          <Upload
            name="logo"
            customRequest={({ file }) => {
              handleFileUpload(file)
                .then(() => {})
                .catch((_error: any) => {});
            }}
            listType="picture"
            showUploadList={false}
            beforeUpload={(file) => {
              const isJpgOrPng =
                file.type === "image/jpeg" || file.type === "image/png";
              if (!isJpgOrPng) {
                message.error("You can only upload JPG/PNG file!");
              }
              return isJpgOrPng;
            }}
          >
            <Button
              style={{
                ...style.logoUpdateButton,
                color: colorTextBase,
                width: "20vw",
              }}
              icon={<IoCameraOutline />}
              block
              name="logo-update-button"
            >
              {"Update logo"}
            </Button>
          </Upload>
        </div>
        {/* Restuarant Information Profile */}
        <AccountInfo />
      </div>
    </Content>
  );
}

export default ProfilePage;
