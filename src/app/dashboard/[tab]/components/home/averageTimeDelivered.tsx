import { Layout, Typography } from "antd";
//import { MdTableRestaurant } from "react-icons/md";
import { styles } from "../../../../../styles/home/tableactivestyles";
import { useThemeContext } from "../../../../providers/ThemeProvider"; // Import the useThemeContext

const { Header } = Layout;
const { Paragraph } = Typography;

//const { Title, Paragraph } = Typography;
interface AverageTimeDeliveredProps {
  countAvg: number;
}

const AverageTimeDelivered: React.FC<AverageTimeDeliveredProps> = ({
  countAvg,
}) => {
  const { isDarkMode } = useThemeContext(); // Call the useThemeContext

  // Use isDarkMode to conditionally set the color
  const paragraphStyle1 = isDarkMode
    ? { ...styles.paragraphStyle1, color: "#FFFFFF" }
    : { ...styles.paragraphStyle1, color: "#000000" };
  const feedStyle = isDarkMode
    ? { ...styles.feedStyle, backgroundColor: "#17181a" }
    : { ...styles.feedStyle, backgroundColor: "#E4E4E4" };
  const divStyle4 = isDarkMode
    ? { ...styles.divStyle4, color: "#FFFFFF" }
    : { ...styles.divStyle4, color: "#000000" };

  return (
    <Header style={feedStyle}>
      <div style={styles.divStyle1}>
        {/* <Title level={1} style={styles.titleStyle}>
                    <MdTableRestaurant />
                </Title> */}
      </div>
      <div style={styles.divStyle2}>
        <div style={styles.divStyle3}>
          <Paragraph style={paragraphStyle1}>Average time</Paragraph>
          <Paragraph style={styles.paragraphStyle2}>delivered</Paragraph>
        </div>
        <div style={divStyle4}>
          <div style={{ display: "flex" }}>
            {countAvg} <p style={{ margin: "0px 0px 0px 5px" }}>min.</p>
          </div>
        </div>
      </div>
    </Header>
  );
};

export default AverageTimeDelivered;
