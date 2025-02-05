import { FunctionComponent } from "react";
import { BiMessageAltDots } from "react-icons/bi";
import { FaRegStar } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { styles } from "../../../../../styles/home/Feedstyle";
import { useThemeContext } from "../../../../providers/ThemeProvider"; // Import the useThemeContext

interface Feedback {
  count: number;
  title: string;
  message: string;
  author: string;
  stars: number;
}

interface FeedProps {
  feedback: Feedback;
}

const Feed: FunctionComponent<FeedProps> = ({ feedback }) => {
  const { isDarkMode } = useThemeContext(); // Call the useThemeContext
  const feedStyle = isDarkMode
    ? { ...styles.feedStyle, backgroundColor: "#2f3135" }
    : { ...styles.feedStyle, backgroundColor: "#FFFFFF" };
  const innerDivStyle = isDarkMode
    ? { ...styles.innerDivStyle, color: "#FFFFFF" }
    : { ...styles.innerDivStyle, color: "#000000" };
  const feedbackStyle = isDarkMode
    ? { ...styles.feedbackStyle, color: "#FFFFFF" }
    : { ...styles.feedbackStyle, color: "#000000" };
  const viewAllStyle = isDarkMode
    ? { ...styles.viewAllStyle, color: "#FFFFFF" }
    : { ...styles.viewAllStyle, color: "#000000" };

  return (
    <div style={feedStyle}>
      <div style={innerDivStyle}>
        <div style={{ position: "relative", zIndex: "1" }}>
          Customers Feedback
        </div>
        <div style={styles.notificationStyle}>
          <div style={styles.notificationNumberStyle}>
            <span>{feedback.count}</span>
          </div>
        </div>
      </div>
      <div style={feedbackStyle}>
        <h3 style={styles.feedbackTitleStyle}>
          <BiMessageAltDots />
        </h3>
        <div style={styles.feedbackContentStyle}>
          <div style={styles.feedbackTextStyle}>
            <div style={{ flex: "1", position: "relative", zIndex: "1" }}>
              <p style={{ margin: "2px" }}>
                <b>{feedback.title}</b>
              </p>
              <p style={{ margin: "2px" }}>{feedback.message}</p>
              <p style={{ margin: "2px" }}>
                <b>- {feedback.author}</b>
              </p>
            </div>
          </div>
          <div style={styles.starRatingStyle}>
            {Array(feedback.stars).fill(<FaRegStar />)}
          </div>
        </div>
      </div>
      <div style={viewAllStyle}>
        <div style={styles.borderStyle} />
        <div style={styles.viewAllContentStyle}>
          <div style={styles.viewAllTextStyle}>
            <div style={{ position: "relative", zIndex: "1" }}>
              view all notifications
            </div>
            <div style={styles.viewAllIconStyle}>
              <FaArrowRight />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
