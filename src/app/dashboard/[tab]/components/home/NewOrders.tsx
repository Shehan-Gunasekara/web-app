import { styles } from "@/styles/home/NewOrders";
import { FunctionComponent } from "react";
import { MdTableRestaurant } from "react-icons/md";
import { LuClock2 } from "react-icons/lu";
import { useThemeContext } from "../../../../providers/ThemeProvider"; // Import useThemeContext

interface MenuData {
  tableNumber: string;
  minutes: string;
}

interface MenuManagementProps {
  data: MenuData;
}

const MenuManagement: FunctionComponent<MenuManagementProps> = ({ data }) => {
  const { isDarkMode } = useThemeContext(); //isDarkMode state

  return (
    <div
      style={{
        //...styles.divStyle,
        //backgroundColor: isDarkMode ? "#202225" : "#EEEEEE",
        //margin: '1rem',
        //borderRadius: '10px',
        //padding: '1rem',
        //width: 'calc(25% - 2rem)',
        //display: 'flex',
        //flexDirection: 'row',
        alignItems: "center",
        //justifyContent: 'center',
      }}
    >
      <section
        style={{
          ...styles.sectionStyle,
          backgroundColor: isDarkMode ? "#6a83f4" : "#EEEEEE",
          color: isDarkMode ? "#fff" : "#000",
        }}
      >
        <div style={styles.hiddenDiv} />
        <div style={styles.icon}>
          <h1 style={styles.icon}>
            <MdTableRestaurant />
          </h1>
        </div>
        <div style={styles.flexRow}>
          <div style={styles.stretchDiv}>
            <p style={styles.margin0}>table</p>
            <p style={styles.fontSize15}>{data.tableNumber}</p>
          </div>
        </div>
        <div style={styles.relativeDiv} />
        <div style={styles.paddingDiv}>
          <div style={styles.relativeZ1}>
            <LuClock2 />
          </div>
        </div>
        <div style={styles.relativeZ2}>
          <b>{data.minutes} </b>
          <span style={styles.fontSize8}>mins</span>
        </div>
      </section>
    </div>
  );
};

export default MenuManagement;
