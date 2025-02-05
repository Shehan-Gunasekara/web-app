function getTimeZones() {
  const timeZones = [
    { value: "-12:00", label: "(GMT-12:00) International Date Line West" },
    { value: "-11:30", label: "(GMT-11:30) Midway Island, Samoa" },
    { value: "-11:00", label: "(GMT-11:00) Midway Island, Samoa" },
    {
      value: "-10:30",
      label: "(GMT-10:30) Hawaii-Aleutian Standard Time (HAST)",
    },
    {
      value: "-10:00",
      label: "(GMT-10:00) Hawaii-Aleutian Standard Time (HAST)",
    },
    { value: "-09:30", label: "(GMT-09:30) Marquesas Islands" },
    { value: "-09:00", label: "(GMT-09:00) Alaska Time" },
    { value: "-08:30", label: "(GMT-08:30) Pitcairn Standard Time" },
    { value: "-08:00", label: "(GMT-08:00) Pacific Time (US & Canada)" },
    { value: "-07:30", label: "(GMT-07:30) Mountain Time (US & Canada)" },
    { value: "-07:00", label: "(GMT-07:00) Mountain Time (US & Canada)" },
    { value: "-06:30", label: "(GMT-06:30) Central Time (US & Canada)" },
    { value: "-06:00", label: "(GMT-06:00) Central Time (US & Canada)" },
    { value: "-05:30", label: "(GMT-05:30) Eastern Time (US & Canada)" },
    { value: "-05:00", label: "(GMT-05:00) Eastern Time (US & Canada)" },
    { value: "-04:30", label: "(GMT-04:30) Venezuela Time" },
    { value: "-04:00", label: "(GMT-04:00) Atlantic Time (Canada)" },
    { value: "-03:30", label: "(GMT-03:30) Newfoundland Standard Time" },
    { value: "-03:00", label: "(GMT-03:00) Brasilia Time" },
    { value: "-02:30", label: "(GMT-02:30) Newfoundland Standard Time" },
    { value: "-02:00", label: "(GMT-02:00) Fernando de Noronha Time" },
    { value: "-01:00", label: "(GMT-01:00) Azores Time" },
    { value: "+00:00", label: "(GMT) Greenwich Mean Time" },
    { value: "+01:00", label: "(GMT+01:00) Central European Time" },
    { value: "+01:30", label: "(GMT+01:30) Central European Time" },
    { value: "+02:00", label: "(GMT+02:00) Eastern European Time" },
    { value: "+02:30", label: "(GMT+02:30) Eastern European Time" },
    { value: "+03:00", label: "(GMT+03:00) Moscow Standard Time" },
    { value: "+03:30", label: "(GMT+03:30) Iran Standard Time" },
    { value: "+04:00", label: "(GMT+04:00) Gulf Standard Time" },
    { value: "+04:30", label: "(GMT+04:30) Afghanistan Time" },
    { value: "+05:00", label: "(GMT+05:00) Pakistan Standard Time" },
    { value: "+05:30", label: "(GMT+05:30) Indian Standard Time" },
    { value: "+05:45", label: "(GMT+05:45) Nepal Time" },
    { value: "+06:00", label: "(GMT+06:00) Bangladesh Standard Time" },
    { value: "+06:30", label: "(GMT+06:30) Cocos Islands Time" },
    { value: "+07:00", label: "(GMT+07:00) Indochina Time" },
    { value: "+07:30", label: "(GMT+07:30) Myanmar Standard Time" },
    { value: "+08:00", label: "(GMT+08:00) China Standard Time" },
    { value: "+08:30", label: "(GMT+08:30) North Korea Standard Time" },
    {
      value: "+08:45",
      label: "(GMT+08:45) Southeastern Western Australia Standard Time",
    },
    { value: "+09:00", label: "(GMT+09:00) Japan Standard Time" },
    {
      value: "+09:30",
      label: "(GMT+09:30) Australian Central Standard Time",
    },
    {
      value: "+10:00",
      label: "(GMT+10:00) Australian Eastern Standard Time",
    },
    { value: "+10:30", label: "(GMT+10:30) Lord Howe Standard Time" },
    { value: "+11:00", label: "(GMT+11:00) Solomon Islands Time" },
    { value: "+11:30", label: "(GMT+11:30) Norfolk Island Time" },
    { value: "+12:00", label: "(GMT+12:00) New Zealand Standard Time" },
    { value: "+12:45", label: "(GMT+12:45) Chatham Standard Time" },
    { value: "+13:00", label: "(GMT+13:00) Tonga Time" },
    { value: "+14:00", label: "(GMT+14:00) Line Islands Time" },
  ];
  return timeZones;
}

export default getTimeZones;
