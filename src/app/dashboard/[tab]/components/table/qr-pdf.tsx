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
  qrDetails: {
    table_number: number;
    qr_code: string;
  }[];
}

const styles = StyleSheet.create({
  page: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    padding: 10,
  },
  qrColumn: {
    width: "30%",
    textAlign: "left",
    marginBottom: "10px",
  },
  qrContainer: {
    // backgroundColor:"#2f3135",
    backgroundColor: "#FFFFFF",
    borderRadius: "10px",
    textAlign: "center",
    color: "black",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "12px",
    fontWeight: "semibold",
    marginBottom: "10px",
  },
  table: {
    fontSize: "12px",
    marginBottom: "10px",
  },
  title: {
    // fontSize: 28,
    // marginBottom:"10px"
  },
  qrCodeImage: {
    width: 120,
    height: 120,
    borderRadius: "10px",
  },
  qrCard: {
    border: "1px solid #000000",
    borderRadius: "10px",
    paddingTop: "10px",
  },
});

function QRCodesPDF({ qrDetails }: QRCodesPDFProps): JSX.Element {
  const sortedQrDetails = qrDetails
    .slice()
    .filter((qr) => qr.table_number !== null)
    .sort((a, b) => a.table_number - b.table_number);
  function chunkArray<T>(arr: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );
  }
  const qrChunks = chunkArray(sortedQrDetails, 12); // Split qrDetails into chunks of 12

  return (
    <Document>
      {qrChunks.map((qrChunk, chunkIndex) => (
        <Page key={chunkIndex} style={styles.page}>
          {qrChunk.map((table, index) => (
            <View key={index} style={styles.qrColumn}>
              {/* <Text style={styles.table}>Table {table.table_number}</Text> */}
              <View style={styles.qrCard}>
                <View style={styles.qrContainer}>
                  <Text style={styles.title}>SCAN FOR MENU</Text>
                  <Image src={table.qr_code} style={styles.qrCodeImage} />
                  <Text style={styles.title}>TABLE {table.table_number}</Text>
                </View>
              </View>
            </View>
          ))}
        </Page>
      ))}
    </Document>
  );
}

export default QRCodesPDF;
