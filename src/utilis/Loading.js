import React from "react";
import { Spin } from "antd";

const Loading = () => {
  return (
    <div style={styles.container}>
      <Spin size="large" style={styles.spinner} />
      <p style={styles.text}>Loading, please wait...</p>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f4f4f4", // Light grey background
  },
  spinner: {
    fontSize: "50px", // Bigger spinner
    color: "#ff6600", // Orange color like your company theme
  },
  text: {
    marginTop: "20px",
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333",
  },
};

export default Loading;
