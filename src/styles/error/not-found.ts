const style = {
  container: {
    display: "flex",
    margin: "auto",
  },

  columnCenter: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column" as "column",
  },

  rightContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    minHeight: "100vh",
    flexDirection: "column" as "column",
  },

  heading: {
    fontWeight: 600,
    fontSize: 32,
    textAlign: "center" as "center",
  },

  text: {
    marginTop: -10,
    fontWeight: 300,
    fontSize: 16,
    textAlign: "center" as "center",
  },

  button: {
    fontWeight: 600,
    fontSize: 16,
    cursor: "pointer",
    marginTop: 15,
    height: 50,
    padding: "0 20px",
  },
};

export default style;
