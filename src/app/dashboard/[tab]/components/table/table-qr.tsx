import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

interface QRCodesPDFProps {
  table_number?: number;
  qr_code?: string;
}

const styles = StyleSheet.create({
  page: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: 20,
    borderRadius: 15,
  },
  qrColumn: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  qrContainer: {
    // backgroundColor: "#ffffff",
    // borderRadius: 15,
    // textAlign: "center",
    // display: "flex",
    // justifyContent: "center",
    // alignItems: "center",
    // fontSize: "12px",
    // fontWeight: "semibold",
  },
  qrCodeImage: {
    width: 140,
    height: 140,
  },
  text: {
    // fontSize: 28,
  },
});

function QRCodesPDF({ table_number, qr_code }: QRCodesPDFProps): JSX.Element {
  return (
    <Document>
      <Page style={styles.page} size={{ width: 240, height: 240 }}>
        <View style={styles.qrColumn}>
          <Text>SCAN FOR MENU</Text>
          <View style={styles.qrContainer}>
            <Image
              // source={{ uri: qr_code }}
              src={qr_code}
              style={styles.qrCodeImage}
            />
          </View>
          <Text style={styles.text}>TABLE {table_number}</Text>
        </View>
      </Page>
    </Document>
  );
}

export default QRCodesPDF;
