const style = {
  container: {
    padding: "0 1rem",
  },

  rowRow: {
    padding: "0 1rem",
  },

  rowTwoHeading: {
    fontSize: 18,
    fontWeight: 500,
    marginTop: -5,
    marginBottom: 20,
  },

  rowThreeHeading: {
    fontSize: 18,
    fontWeight: 500,
  },

  overviewContainer: {
    width: "fit-content",
    height: 50,
    display: "flex",
    flexDirection: "row" as "row",
    alignItems: "flex-end",
    justifyContent: "center",
    fontSize: 32,
    paddingRight: 70,
  },
  overviewIconContainer: {
    flex: "1",
    display: "flex",
    flexDirection: "row" as "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 4,
  },
  overviewIcon: {
    margin: "0",
    position: "relative" as "relative",
    fontWeight: "400",
  },
  generalIcon: {
    marginTop: -25,
    position: "relative" as "relative",
    fontWeight: "400",
    fontSize: 32,
    paddingRight: "1rem",
  },
  overviewTextContainer: {
    height: "40px",
    width: 100,
    paddingLeft: 5,
  },
  overviewText: {
    width: "60%",
    marginLeft: 10,
    marginTop: 0,
    fontSize: "14px",
    fontWeight: 300,
  },

  overviewNumber: {
    fontWeight: 300,
  },

  overviewDot: {
    height: "8px",
    width: "8px",
    position: "relative" as "relative",
    marginLeft: "0.5rem",
    marginTop: "0.25rem",
    borderRadius: "50%",
  },

  overviewDotContainer: {
    alignSelf: "stretch",
    flex: "1",
    display: "flex",
    flexDirection: "row" as "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },

  generalContainerOuter: {
    display: "flex",
    alignItems: "center",
  },
  generalContainer: {
    padding: "0 1rem",
  },

  generalDate: {
    marginLeft: "auto",
    width: "50%",
  },
  generalDateContainer: {
    borderRadius: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "5px 10px",
    fontSize: 12,
  },

  generalCardTopic: {
    fontSize: 16,
    fontWeight: 300,
    width: "80%",
    marginBottom: 5,
  },

  generalEmptyDiv: {
    marginTop: 20,
  },

  generalContent: {
    display: "flex",
    alignItems: "center",
  },

  generalNumber: {
    fontSize: 28,
    fontWeight: 300,
    margin: 0,
  },

  generalPercentage: {
    fontSize: 14,
    fontWeight: 400,
    margin: 0,
  },

  selectMonthContainer: {
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "50%",
    height: "2.5rem",
    padding: 10,
  },

  datePickerIcon: {
    margin: 0,
    fontSize: 22,
    cursor: "pointer",
  },
};

export default style;
