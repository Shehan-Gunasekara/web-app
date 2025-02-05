import React, { useEffect, useRef, useState } from "react";
import {
  theme,
  Button,
  Col,
  Row,
  Divider,
  Form,
  Select,
  Checkbox,
  Flex,
  InputNumber,
  Modal,
  TimePicker,
  Spin,
} from "antd";
import type { CheckboxProps } from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_TAX_COLLECTIONS } from "@/lib/queries/profile";
import { useWindowWidth } from "@react-hook/window-size/throttled";
import { useThemeContext } from "@/app/providers/ThemeProvider";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { UPDATE_RESTAURANT } from "@/lib/mutations/restaurant";
import { GoCheckCircleFill } from "react-icons/go";
import style from "@/styles/settings/settings";
import getCurrency from "@/constants/currencies";
import getTimeZones from "@/constants/time-zones";
import getCountryCodes from "@/constants/country-codes";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useSettingsContext } from "@/app/providers/SettingsProvider";
import { capitalize } from "@/utils/lonovm";
// import SkeletonSelectSettings from "@/app/components/skeletons/settings/skeleton-select";

dayjs.extend(customParseFormat);

interface GeneralSettingsProps {
  generalSettingsData: any;
  generalSettingsDataLoading: boolean;
  generalSettingsDataRefetch: any;
}

function GeneralSettings({
  generalSettingsData,
  generalSettingsDataLoading,
  generalSettingsDataRefetch,
}: GeneralSettingsProps) {
  const {
    token: {
      colorBgBase,
      geekblue3,
      colorTextDisabled,
      colorTextBase,
      colorTextLightSolid,
      geekblue7,
      geekblue5,
      geekblue4,
      colorBgContainerDisabled,
    },
  } = theme.useToken();

  const { sidebarCollapsed } = useThemeContext();

  const [form] = Form.useForm();
  const [rows, setRows] = useState<any[]>([
    {
      selectedDays: [],
      openTime: "08:00",
      closeTime: "18:00",
      isFullDay: false,
    },
  ]);

  const countryOptions = getCountryCodes();
  const currencyOptions = getCurrency();
  const timeZoneOptions = getTimeZones();

  const [valueTax, setValueTax] = useState(1);
  // const [isFullDay, setIsFullDay] = useState(false);
  const [isAddTaxManually, setIsAddTaxManually] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTabs, setSelectedTabs] = useState<string[]>([]);
  const [isFormChanged, setIsFormChanged] = useState(false);
  // const [selectedOpenTime, setSelectedOpenTime] = useState("");
  // const [selectedCloseTime, setSelectedCloseTime] = useState("");
  const [currency, setCurrency] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [taxPercentage, setTaxPercentage] = useState(0);
  const [filteredStates, setFilteredStates] = useState<any[]>([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const { setGMT } = useSettingsContext();

  // const selectedOpenTimeRef = useRef(selectedOpenTime);
  // const selectedCloseTimeRef = useRef(selectedCloseTime);
  const selectedTabsRef = useRef(selectedTabs);
  // const isFullDayRef = useRef(isFullDay);
  const currencyRef = useRef(currency);
  const timeZoneRef = useRef(timeZone);
  const countryRef = useRef(country);
  const stateRef = useRef(state);
  const taxPercentageRef = useRef(taxPercentage);
  const taxAddedManuallyRef = useRef(isAddTaxManually);

  const revertFormatTime = (formattedTime: string, timeZOne: string) => {
    const [hours, minutes] = formattedTime.split(":").map(Number);

    const [timeZoneHours, timeZoneMinutes] = timeZOne.split(":").map(Number);

    let finalHours = hours - timeZoneHours;
    let finalMinutes = minutes - timeZoneMinutes;

    if (finalMinutes < 0) {
      finalMinutes += 60;
      finalHours--;
    } else if (finalMinutes >= 60) {
      finalMinutes -= 60;
      finalHours++;
    }

    finalHours = (24 + finalHours) % 24;

    const originalTime = `${finalHours < 10 ? "0" : ""}${finalHours}:${
      finalMinutes < 10 ? "0" : ""
    }${finalMinutes}`;

    return originalTime;
  };

  const groupSavedHours = (savedHours: any, timeZOne: string) => {
    const groupedHours: any = {};
    savedHours.forEach((savedHour: any) => {
      const { day, start_time, end_time } = savedHour;
      const startTime = revertFormatTime(start_time, timeZOne);
      const endTime = revertFormatTime(end_time, timeZOne);
      const key = `${startTime}-${endTime}`; // Use start and end times as key
      if (!groupedHours[key]) {
        const is_full_day = startTime == "00:00" && endTime == "00:00";
        groupedHours[key] = {
          selectedDays: [day],
          openTime: startTime,
          closeTime: endTime,
          isFullDay: is_full_day,
        };
      } else {
        groupedHours[key].selectedDays.push(day);
      }
    });
    return Object.values(groupedHours);
  };
  const handleAddRow = () => {
    if (rows.length < 3) {
      setRows([
        ...rows,
        {
          selectedDays: [],
          openTime: "08:00",
          closeTime: "18:00",
          isFullDay: false,
        },
      ]);
    }
  };

  const handleDeleteRow = (index: number) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };

  useEffect(() => {
    if (generalSettingsData) {
      if (
        generalSettingsData.getRestaurant.business_hours &&
        generalSettingsData.getRestaurant.business_hours.length > 0
      ) {
        setSelectedTabs(
          generalSettingsData.getRestaurant.business_hours.map(
            (hour: { day: string }) => hour.day
          )
        );

        selectedTabsRef.current =
          generalSettingsData.getRestaurant.business_hours.map(
            (hour: { day: string }) => hour.day
          );

        const savedBusinessHours = groupSavedHours(
          generalSettingsData.getRestaurant.business_hours,
          generalSettingsData.getRestaurant.time_zone
        );
        setRows(savedBusinessHours);

        // const originalOpenTime = revertFormatTime(
        //   generalSettingsData.getRestaurant.business_hours[0].start_time,
        //   generalSettingsData.getRestaurant.time_zone
        // );
        // const originalCloseTime = revertFormatTime(
        //   generalSettingsData.getRestaurant.business_hours[0].end_time,
        //   generalSettingsData.getRestaurant.time_zone
        // );

        // setSelectedOpenTime(originalOpenTime);
        // setSelectedCloseTime(originalCloseTime);

        // selectedOpenTimeRef.current = originalOpenTime;
        // selectedCloseTimeRef.current = originalCloseTime;

        // if (originalOpenTime === "00:00" && originalCloseTime === "00:00") {
        //   setIsFullDay(true);
        //   isFullDayRef.current = true;
        // }
      }
      setCurrency(generalSettingsData.getRestaurant.currency);
      setIsAddTaxManually(
        generalSettingsData.getRestaurant.tax_is_set_manually
      );
      setTimeZone(generalSettingsData.getRestaurant.time_zone);
      setCountry(generalSettingsData.getRestaurant.country);
      setState(generalSettingsData.getRestaurant.state);
      setTaxPercentage(generalSettingsData.getRestaurant.tax_value);
      setValueTax(generalSettingsData.getRestaurant.tax_inclueded ? 2 : 1);

      currencyRef.current = generalSettingsData.getRestaurant.currency;
      timeZoneRef.current = generalSettingsData.getRestaurant.time_zone;
      countryRef.current = generalSettingsData.getRestaurant.country;
      stateRef.current = generalSettingsData.getRestaurant.state;
      taxPercentageRef.current = generalSettingsData.getRestaurant.tax_value;
      taxAddedManuallyRef.current =
        generalSettingsData.getRestaurant.tax_is_set_manually;

      // This is needed to fill the inputs with current value
      form.setFieldsValue({
        currency: currencyRef.current,
        timeZone: timeZoneRef.current,
        country: countryRef.current,
        state: stateRef.current,
        taxPercentage: taxPercentageRef.current,
      });
    }
  }, [generalSettingsData]);

  const deviceWidth = useWindowWidth();
  const { lg } = useBreakpoint();

  const [updateRestuatant] = useMutation(UPDATE_RESTAURANT);
  const { data: taxData } = useQuery<any>(GET_ALL_TAX_COLLECTIONS);

  const taxResponse = taxData && taxData.getAllTaxCollections;

  const taxDataArray =
    taxResponse &&
    taxResponse.map((tax: any) => {
      return {
        country: tax.country,
        value: tax.state,
        label: tax.state,
        tax: tax.tax,
      };
    });

  const onChangeOpenTime = (time: Dayjs, rowIndex: number) => {
    if (time) {
      setIsFormChanged(true);
      const updatedRows = [...rows];
      updatedRows[rowIndex].openTime = time.format("HH:mm");
      setRows(updatedRows);
      // setIsFormChanged(true);
      // const time24HoursFormat = time.format("HH:mm");
      // setSelectedOpenTime(time24HoursFormat);
    }
  };

  const onChangeCloseTime = (time: Dayjs, rowIndex: number) => {
    if (time) {
      setIsFormChanged(true);
      const updatedRows = [...rows];
      updatedRows[rowIndex].closeTime = time.format("HH:mm");
      setRows(updatedRows);
      // setIsFormChanged(true);
      // const time24HoursFormat = time.format("HH:mm");
      // setSelectedCloseTime(time24HoursFormat);
    }
  };

  const onChangeCheckbox: CheckboxProps["onChange"] = (e: any) => {
    setIsFormChanged(true);
    setIsAddTaxManually(e.target.checked);

    if (e.target.checked === false) {
      const entry = taxDataArray.find(
        (item: any) => item.value === state.toLowerCase()
      );
      form.setFieldsValue({
        taxPercentage: entry?.tax || 0,
      });
    }
  };

  const onChangeCheckboxHours = (e: any, rowIndex: number) => {
    setIsFormChanged(true);
    const updatedRows = [...rows];
    if (e.target.checked == true) {
      updatedRows[rowIndex].isFullDay = true;
      updatedRows[rowIndex].openTime = "00:00";
      updatedRows[rowIndex].closeTime = "00:00";
      setRows(updatedRows);
    } else {
      updatedRows[rowIndex].isFullDay = false;
      setRows(updatedRows);
    }
  };

  const onChangeTimeZone = async (value: string) => {
    setTimeZone(value);
  };

  const onChangeCountry = (value: string) => {
    setCountry(value);
    setState("Select a state");

    if (form) {
      form.setFieldsValue({
        state: "Select a category",
      });
    }
  };

  const onChangeCurrency = (value: string) => {
    setCurrency(value);
  };

  // This captures and updates the country and states once taxResponse data updated
  useEffect(() => {
    if (country && taxResponse) {
      const taxRes =
        taxResponse &&
        taxResponse.map((tax: any) => {
          return {
            country: tax.country,
            value: tax.state,
            label: capitalize(tax.state),
            tax: tax.tax,
          };
        });

      const filteredStateList = taxRes.filter(
        (item: any) => item.country === country
      );
      setFilteredStates(filteredStateList);
    }
  }, [country, taxResponse]);

  const handleTabClick = (tab: any, rowIndex: number) => {
    setIsFormChanged(true);
    const updatedRows = rows.map((row, index) => {
      if (index === rowIndex) {
        return {
          ...row,
          selectedDays: row.selectedDays.includes(tab)
            ? row.selectedDays.filter((day: any) => day !== tab)
            : [...row.selectedDays, tab],
        };
      } else if (row.selectedDays.includes(tab)) {
        return {
          ...row,
          selectedDays: row.selectedDays.filter((day: any) => day !== tab),
        };
      }
      return row;
    });
    setRows(updatedRows);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const [timeZoneHours, timeZoneMinutes] = timeZone.split(":").map(Number);

    let finalHours = hours + timeZoneHours;
    let finalMinutes = minutes + timeZoneMinutes;

    if (finalMinutes >= 60) {
      finalMinutes -= 60;
      finalHours++;
    } else if (finalMinutes < 0) {
      finalMinutes += 60;
      finalHours--;
    }

    finalHours = (24 + finalHours) % 24;

    const formattedTime = `${finalHours < 10 ? "0" : ""}${finalHours}:${
      finalMinutes < 10 ? "0" : ""
    }${finalMinutes}`;

    return formattedTime;
  };

  const updateRestuatantData = async () => {
    setIsLoading(true);
    const data = form.getFieldsValue();
    console.log("form data----------", data);
    setGMT(data.timeZone);

    const savedBusinessHours = rows.reduce((acc, row) => {
      if (
        row.selectedDays.length > 0 &&
        ((row.openTime && row.closeTime) || row.isFullDay)
      ) {
        const startTime = formatTime(row.isFullDay ? "00:00" : row.openTime);
        const endTime = formatTime(row.isFullDay ? "00:00" : row.closeTime);
        row.selectedDays.forEach((day: any) => {
          const existingEntryIndex = acc.findIndex(
            (entry: any) =>
              entry.day === day &&
              entry.start_time === startTime &&
              entry.end_time === endTime
          );
          if (existingEntryIndex !== -1) {
            acc[existingEntryIndex].day = day;
          } else {
            acc.push({ day, start_time: startTime, end_time: endTime });
          }
        });
      }
      return acc;
    }, []);
    const finalBusinessHours = savedBusinessHours.slice(0, 7);

    try {
      form.validateFields().then(async () => {
        const restaurant_id =
          localStorage.getItem("lono_restaurant_id") &&
          parseInt(localStorage.getItem("lono_restaurant_id")!);
        const response = await updateRestuatant({
          variables: {
            input: {
              id: restaurant_id,
              business_hours: finalBusinessHours,
              time_zone: data.timeZone,
              currency: data.currency,
              country: data.country,
              state: data.state,
              tax_value: parseFloat(data.taxPercentage) || taxPercentage,
              tax_is_set_manually: isAddTaxManually,
              // tax_inclueded: valueTax === 2 ? true : false,
            },
          },
        });
        if (response) {
          console.log("Restaurant settings has been updated!");
          setIsLoading(false);
          setIsModalOpen(true);
          setIsUpdated(!isUpdated);
        }
      });
    } catch (_error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generalSettingsDataRefetch();
  }, [isUpdated]);

  useEffect(() => {
    if (
      isAddTaxManually === taxAddedManuallyRef.current &&
      taxPercentage === taxPercentageRef.current &&
      currency === currencyRef.current &&
      timeZone === timeZoneRef.current &&
      country === countryRef.current &&
      state === stateRef.current
    ) {
      setIsFormChanged(false);
    } else {
      setIsFormChanged(true);
    }
  }, [
    isAddTaxManually,
    currency,
    timeZone,
    country,
    state,
    taxPercentage,
    valueTax,
  ]);

  // useEffect(() => {
  //   setIsFormChanged(true);
  // }, [valueTax, isFullDay, isAddTaxManually, selectedTabs]);

  const renderTab = (
    tab: any,
    label: string,
    isSelected: any,
    rowIndex: number
  ) => {
    return (
      <Button
        key={tab}
        style={{
          color: colorTextBase,
          // background: "rgba(78, 82, 90, 1)",
          background: isSelected ? geekblue4 : "rgba(78, 82, 90, 1)",
          borderRadius: 10,
          height: deviceWidth > 1100 ? "70%" : "60%",
          // height: deviceWidth > 1100 ? "70%" : isSmallScreen ? "30%" : "60%",
          // aspectRatio: 1,
          fontSize: 16,
          fontWeight: 700,
          // minWidth: xl ? "90px" : lg ? "70px" : "65px",
        }}
        onClick={() => handleTabClick(tab, rowIndex)}
      >
        <div
          style={{
            // margin: 0,
            // marginLeft: deviceWidth > 1100 ? 0 : -3,
            textAlign: "center",
            alignSelf: "center",
          }}
        >
          {label}
        </div>
      </Button>
    );
  };

  return (
    <Col style={{ height: "100%" }}>
      <Form
        form={form}
        name="generalSettingsForm"
        layout="vertical"
        autoComplete="off"
        initialValues={{}}
      >
        {/** Business hours */}
        <Row style={style.containerRow}>
          <Row justify="space-between" align="middle" style={style.topRow}>
            <div style={style.topRowText}>Business Hours</div>
            <Button
              style={{
                background: geekblue3,
                ...style.topRowButton,
              }}
              onClick={handleAddRow}
              disabled={rows.length >= 3}
            >
              Add
            </Button>
          </Row>
          <Divider style={{ marginBottom: 0, paddingBottom: 12 }} />
          {/** Business days */}
          {rows.map((row, rowIndex) => (
            <Row
              key={rowIndex}
              style={{
                width: "100%",
                background: geekblue5,
                borderRadius: 15,
                padding: lg ? "0 1rem" : "0 0.75rem",
              }}
              align={"middle"}
              justify={"space-between"}
            >
              <Col
                md={
                  sidebarCollapsed
                    ? deviceWidth > 850
                      ? 12
                      : 24
                    : deviceWidth > 970
                    ? 12
                    : 24
                }
                lg={12}
                style={{
                  width: sidebarCollapsed && "100%",
                  height: "60px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: sidebarCollapsed
                    ? deviceWidth > 850
                      ? "flex-start"
                      : "space-between"
                    : deviceWidth > 970
                    ? "flex-start"
                    : "space-between",

                  padding: sidebarCollapsed
                    ? deviceWidth > 850
                      ? "0"
                      : "0 4rem"
                    : deviceWidth > 970
                    ? "0"
                    : "0 4rem",

                  gap: 10,
                  // border: "1px solid #f0f0f0",
                }}
              >
                {[0, 1, 2, 3, 4, 5, 6].map((index) =>
                  renderTab(
                    dayjs().day(index).format("ddd").toLowerCase(),
                    dayjs().day(index).format("ddd")[0],
                    row.selectedDays.includes(
                      dayjs().day(index).format("ddd").toLowerCase()
                    ),
                    rowIndex
                  )
                )}
                {/* {renderTab("sun", "S", selectedTabs.includes("sun"), rowIndex)}
                {renderTab("mon", "M", selectedTabs.includes("mon"), rowIndex)}
                {renderTab("tue", "T", selectedTabs.includes("tue"), rowIndex)}
                {renderTab("wed", "W", selectedTabs.includes("wed"), rowIndex)}
                {renderTab("thu", "T", selectedTabs.includes("thu"), rowIndex)}
                {renderTab("fri", "F", selectedTabs.includes("fri"), rowIndex)}
                {renderTab("sat", "S", selectedTabs.includes("sat"), rowIndex)} */}
              </Col>

              <Col
                style={{
                  height: "60px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: "auto",
                }}
              >
                <div>
                  {!generalSettingsDataLoading && (
                    <Checkbox
                      checked={row.isFullDay}
                      onChange={(e: any) => onChangeCheckboxHours(e, rowIndex)}
                    >
                      24 Hours
                    </Checkbox>
                  )}
                </div>
              </Col>

              <Col
                style={{
                  marginLeft: "auto",
                  padding: sidebarCollapsed
                    ? deviceWidth > 850
                      ? "0"
                      : "0 4rem"
                    : deviceWidth > 970
                    ? "0"
                    : "0 4rem",
                }}
              >
                <Row>
                  <Form.Item
                    name={"openTime" + rowIndex} //separates rows, this form value is never used
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Please enter the restaurant name",
                    //   },
                    // ]}
                    style={{
                      height: "1rem",
                      // marginTop: "0.3rem",
                    }}
                  >
                    {!generalSettingsDataLoading && row.openTime && (
                      <TimePicker
                        // value={dayjs(row.openTime, "h:mm")}
                        onChange={(time: any) =>
                          onChangeOpenTime(time, rowIndex)
                        }
                        changeOnScroll
                        allowClear={false}
                        needConfirm={false}
                        use12Hours
                        showNow={false}
                        minuteStep={5}
                        suffixIcon={null}
                        defaultValue={dayjs(row.openTime, "h:mm")}
                        // defaultValue={dayjs(selectedOpenTime, "h:mm")}
                        format="h:mm A"
                        // value={dayjs("12.12", "h:mm")}
                        // onSelect={(value) => {
                        //   const timeString = dayjs(value).format("HH:mm");
                        //   setSelectedOpenTime(timeString);
                        // }}
                        style={{
                          background: row.isFullDay
                            ? colorBgContainerDisabled
                            : colorBgBase,
                          ...style.topInput,
                          border: "none",
                        }}
                        disabled={row.isFullDay}
                      />
                    )}
                  </Form.Item>
                  <p
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      margin: "0 10px",
                      fontWeight: 500,
                      color: colorTextDisabled,
                    }}
                  >
                    TO
                  </p>
                  <Form.Item
                    name={"closeTime" + rowIndex} //separates rows, this form value is never used
                    style={{
                      height: "1rem",
                      // marginTop: "0.3rem",
                    }}
                  >
                    {!generalSettingsDataLoading && row.closeTime && (
                      <TimePicker
                        // value={dayjs(row.closeTime, "h:mm")}
                        onChange={(time: any) =>
                          onChangeCloseTime(time, rowIndex)
                        }
                        changeOnScroll
                        allowClear={false}
                        needConfirm={false}
                        use12Hours
                        showNow={false}
                        minuteStep={5}
                        suffixIcon={null}
                        defaultValue={dayjs(row.closeTime, "h:mm")}
                        format="h:mm A"
                        style={{
                          background: row.isFullDay
                            ? colorBgContainerDisabled
                            : colorBgBase,
                          ...style.topInput,
                          border: "none",
                        }}
                        disabled={row.isFullDay}
                      />
                    )}
                  </Form.Item>
                  {rows.length > 1 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        style={{
                          backgroundColor: "transparent",
                          margin: 0,
                          paddingLeft: 16,
                        }}
                        onClick={() => handleDeleteRow(rowIndex)}
                      >
                        <RiDeleteBin6Fill size={16} />
                      </Button>
                    </div>
                  )}
                </Row>
              </Col>
            </Row>
          ))}
        </Row>

        {/** Currency & Time Zone */}
        <Row style={style.containerRowTwo}>
          <Row justify="space-between" align="middle" style={style.topRowTwo}>
            <div style={style.topRowText}>Currency & Time Zone</div>
          </Row>
          <Divider />
          <Row justify="space-between" align="middle" style={style.insideRow}>
            {/** select currency */}
            <Col md={12} lg={12} xl={12}>
              <div style={style.colInside}>
                <Form.Item
                  name="currency"
                  label={"Currency"}

                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Please select the currency",
                  //   },
                  // ]}
                >
                  {!generalSettingsDataLoading && currencyOptions && (
                    <Select
                      // defaultValue={currency || "Select the currency"}
                      // value={currency || "Select the currency"}
                      style={style.select}
                      // allowClear={true}
                      showSearch={true}
                      filterOption={(
                        input: string,
                        option?: { value: string; label: string }
                      ) => (option ? option.label.indexOf(input) >= 0 : false)}
                      options={currencyOptions.map((option) => ({
                        value: option.value,
                        label: option.label,
                      }))}
                      onChange={onChangeCurrency}
                    />
                  )}
                </Form.Item>
              </div>
            </Col>

            {/** time zone */}
            <Col
              md={12}
              lg={12}
              xl={12}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <div style={style.colInside}>
                <Form.Item
                  name="timeZone"
                  label={"Time zone"}
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Please enter the time zone",
                  //   },
                  // ]}
                  // style={{ ...style.countryItem }}
                >
                  {!generalSettingsDataLoading && timeZoneOptions && (
                    <Select
                      defaultValue={timeZone || "Select the time zone"}
                      style={style.select}
                      // allowClear={true}
                      showSearch={true}
                      filterOption={(
                        input: string,
                        option?: { value: string; label: string }
                      ) => (option ? option.label.indexOf(input) >= 0 : false)}
                      options={timeZoneOptions.map((option) => ({
                        value: option.value,
                        label: option.label,
                      }))}
                      onChange={onChangeTimeZone}
                    />
                  )}
                </Form.Item>
              </div>
            </Col>
          </Row>
        </Row>

        {/** Tax Settings */}
        <Row style={{ marginBottom: "3rem" }}>
          <Row justify="space-between" align="middle" style={style.topRowTwo}>
            <div style={style.topRowText}>Tax Settings</div>
          </Row>
          <Divider />
          <Row justify="space-between" align="top" style={style.insideRow}>
            {/** tax bool */}

            {/** country */}
            <Col md={12} lg={12} xl={12} style={{}}>
              <div style={style.colInside}>
                <Form.Item
                  name="country"
                  label={
                    <p
                      style={{
                        margin: 0,
                        color: isAddTaxManually ? "#595A5D" : "",
                      }}
                    >
                      Country
                    </p>
                  }

                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Please select the country",
                  //   },
                  // ]}
                >
                  {!generalSettingsDataLoading && countryOptions && (
                    <Select
                      defaultValue={country || "Select the country"}
                      style={style.select}
                      // allowClear={true}
                      showSearch={true}
                      className="select-tax"
                      disabled={isAddTaxManually}
                      // disabled={valueTax === 2 || isAddTaxManually}
                      filterOption={(
                        input: string,
                        option?: { value: string; label: string }
                      ) => (option ? option.label.indexOf(input) >= 0 : false)}
                      options={countryOptions.map((option) => ({
                        value: option.value,
                        label: option.label,
                      }))}
                      onChange={onChangeCountry}
                    />
                  )}
                </Form.Item>

                <Form.Item
                  name="state"
                  label={
                    <p
                      style={{
                        margin: 0,
                        color: isAddTaxManually ? "#595A5D" : "",
                      }}
                    >
                      State
                    </p>
                  }
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Please enter the state",
                  //   },
                  // ]}
                  // style={{ ...style.countryItem }}
                >
                  {!generalSettingsDataLoading && filteredStates && (
                    <Select
                      defaultValue={state || "Select the state"}
                      style={style.select}
                      // allowClear={true}
                      showSearch={true}
                      className="select-tax"
                      disabled={isAddTaxManually}
                      //disabled={valueTax === 2 || isAddTaxManually}
                      onChange={(value: React.SetStateAction<string>) => {
                        const selectedTax = taxDataArray.find(
                          (tax: any) => tax.value === value
                        );
                        form.setFieldsValue({
                          taxPercentage: selectedTax.tax.toString(),
                        });
                        setTaxPercentage(selectedTax.tax.toString());
                        setState(value);
                      }}
                      options={
                        filteredStates &&
                        filteredStates.map((option: any) => ({
                          value: option.value,
                          label: option.label,
                          tax: option.tax,
                        }))
                      }

                      // options={
                      //   taxDataArray
                      //     ? taxDataArray.map((option: any) => ({
                      //         value: option.value.toLowerCase(),
                      //         label: option.label,
                      //       }))
                      //     : [{ value: "Alberta", label: "Alberta", tax: 5 }]
                      // }
                    />
                  )}
                </Form.Item>

                <Row justify={"space-between"} align={"top"}>
                  {!generalSettingsDataLoading && (
                    <Flex gap={30} align={"top"}>
                      <Col>
                        <Form.Item
                          name="taxPercentage"
                          label={
                            <p
                              style={{
                                margin: 0,
                                color: isAddTaxManually ? "#595A5D" : "",
                              }}
                            >
                              Sales/gst/hst
                            </p>
                          }
                          rules={[
                            {
                              pattern: /^[0-9]+(?:\.[0-9]+)?$/,
                              message: "Only numbers are allowed!",
                            },
                          ]}
                          style={{
                            height: "1rem",
                            marginTop: "0.38rem",
                          }}
                        >
                          <InputNumber
                            defaultValue={taxPercentage || 0}
                            // value={taxPercentage || 0}
                            min={0}
                            max={100}
                            formatter={(value: any) => `${value}%`}
                            disabled={!isAddTaxManually}
                            //disabled={valueTax === 2 || !isAddTaxManually}
                            style={{
                              // height: "2.5rem",
                              background: !isAddTaxManually
                                ? "#2F3135"
                                : colorBgBase,
                              // background:
                              //   valueTax === 2 || !isAddTaxManually
                              //     ? colorBgContainerDisabled
                              //     : colorBgBase,
                              border: !isAddTaxManually ? "" : "none",
                              width: "6rem",
                            }}
                            onChange={() => {
                              setIsFormChanged(true);
                            }}
                            // parser={(value) => value!.replace('%', '')}
                          />
                        </Form.Item>
                      </Col>

                      <Col style={{ marginTop: "3rem" }}>
                        {!generalSettingsDataLoading && (
                          <Checkbox
                            onChange={onChangeCheckbox}
                            checked={isAddTaxManually}
                            // disabled={valueTax === 2}
                          >
                            Set Manually
                          </Checkbox>
                        )}
                      </Col>
                    </Flex>
                  )}
                </Row>
              </div>
            </Col>
          </Row>
        </Row>
        <Divider />
        {/** Buttons */}
        <Row justify={"end"}>
          <Flex
            gap={20}
            style={{
              width: "50%",
            }}
            justify={"end"}
          >
            <Button
              style={{
                background: !isFormChanged
                  ? colorBgContainerDisabled
                  : "transparent",
                color: colorTextBase,
                border: `2px solid ${geekblue7}`,
                ...style.buttons,
              }}
              disabled={isLoading || !isFormChanged}
              name="discard-btn"
            >
              Discard
            </Button>
            <Button
              style={{
                background: !isFormChanged ? colorTextDisabled : colorTextBase,
                color: colorTextLightSolid,
                ...style.buttons,
              }}
              disabled={isLoading || !isFormChanged}
              onClick={updateRestuatantData}
              name="apply-btn"
            >
              {isLoading ? (
                <div>
                  Apply
                  <Spin style={{ marginLeft: "0.5rem" }} />
                </div>
              ) : (
                "Apply"
              )}
            </Button>
          </Flex>
        </Row>
      </Form>
      <Modal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        centered
        footer={null}
        width={"fit-content"}
        closable={false}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1.5rem 4rem",
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 600, marginRight: 10 }}>
            Changes Applied!
          </div>
          <GoCheckCircleFill fontSize={30} />
        </div>
      </Modal>
    </Col>
  );
}

export default GeneralSettings;
