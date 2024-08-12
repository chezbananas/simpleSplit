import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  personContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "#1e1e1e",
    color: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  totalInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "#1e1e1e",
    color: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    borderRadius: 5,
    maxHeight: "5%",
  },
  warning: {
    color: "#ffcc00",
    fontSize: 16,
    marginVertical: 10,
  },
  error: {
    color: "#ff3333",
    fontSize: 16,
    marginVertical: 10,
  },
  result: {
    fontSize: 18,
    marginVertical: 5,
    color: "#fff",
  },
});

export default styles;
