import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./styles";
import {
  updatePerson,
  handleAddPerson,
  handleRemovePerson,
  handleCalculate,
  handlePreTaxInputChange,
  handleTotalAmountChange,
  handleClearAll,
  handleClearAmounts,
} from "./util";

const App = () => {
  const [numPeople, setNumPeople] = useState(1);
  const [people, setPeople] = useState([{ label: "", preTax: "" }]);
  const [totalAmount, setTotalAmount] = useState("");
  const [amounts, setAmounts] = useState([]);
  const [warningMessage, setWarningMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [preTaxTotal, setPreTaxTotal] = useState(0); // State to store pre-tax total

  useEffect(() => {
    const loadPeopleNames = async () => {
      try {
        const storedPeople = await AsyncStorage.getItem("peopleNames");
        if (storedPeople) {
          const parsedPeople = JSON.parse(storedPeople);
          setPeople(parsedPeople.map((label) => ({ label, preTax: "" })));
          setNumPeople(parsedPeople.length);
        }
      } catch (error) {
        console.error("Failed to load names from AsyncStorage", error);
      }
    };

    loadPeopleNames();
  }, []);

  useEffect(() => {
    const savePeopleNames = async () => {
      try {
        const names = people.map((person) => person.label);
        await AsyncStorage.setItem("peopleNames", JSON.stringify(names));
      } catch (error) {
        console.error("Failed to save names to AsyncStorage", error);
      }
    };

    savePeopleNames();
  }, [people]);

  const removePersonAtIndex = (index) => {
    handleRemovePerson(index, people, setPeople, setNumPeople, setAmounts);
  };

  const calculatePreTaxTotal = () => {
    const total = people.reduce(
      (sum, person) => sum + parseFloat(person.preTax) || 0,
      0
    );
    setPreTaxTotal(total);
  };

  useEffect(() => {
    calculatePreTaxTotal();
  }, [people]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>💸Simple Check Splitter💸</Text>
      <View style={styles.row}>
        <Button
          title="Add Person"
          onPress={() => handleAddPerson(people, setPeople, setNumPeople)}
        />
        <Button
          title="Remove Person"
          onPress={() =>
            handleRemovePerson(numPeople, people, setPeople, setNumPeople)
          }
          disabled={numPeople <= 1}
        />
      </View>
      <View style={styles.buttonRow}>
        <Button
          title="Clear All"
          onPress={() =>
            handleClearAll(
              setPeople,
              setNumPeople,
              setTotalAmount,
              setAmounts,
              setWarningMessage,
              setErrorMessage
            )
          }
        />
        <Button
          title="Clear Amounts"
          onPress={() =>
            handleClearAmounts(setPeople, setAmounts, setWarningMessage)
          }
        />
      </View>
      <FlatList
        data={people}
        renderItem={({ item, index }) => (
          <View style={styles.personContainer}>
            <TextInput
              style={styles.input}
              placeholder={`Person ${index + 1} Name`}
              placeholderTextColor="#888"
              value={item.label}
              onChangeText={(text) =>
                updatePerson(index, "label", text, people, setPeople)
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Pre-tax Amount"
              placeholderTextColor="#888"
              keyboardType="decimal-pad" // Allow decimal input
              value={item.preTax}
              onChangeText={(text) =>
                handlePreTaxInputChange(index, text, people, setPeople)
              }
              onSubmitEditing={() =>
                handleCalculate(
                  people,
                  totalAmount,
                  setWarningMessage,
                  setErrorMessage,
                  setAmounts
                )
              }
            />
            <TouchableOpacity
              style={[
                styles.removeButton,
                numPeople <= 1 && styles.disabledButton,
              ]}
              onPress={() => removePersonAtIndex(index)}
              disabled={numPeople <= 1}
            >
              <Text style={styles.removeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(_, index) => index.toString()}
      />
      <TextInput
        style={styles.totalInput}
        placeholder="Total After Tax/Tip"
        placeholderTextColor="#888"
        keyboardType="decimal-pad"
        value={String(totalAmount)}
        onChangeText={(text) => handleTotalAmountChange(text, setTotalAmount)}
        onSubmitEditing={() =>
          handleCalculate(
            people,
            totalAmount,
            setWarningMessage,
            setErrorMessage,
            setAmounts
          )
        }
      />
      <Button
        title="Calculate"
        onPress={() =>
          handleCalculate(
            people,
            totalAmount,
            setWarningMessage,
            setErrorMessage,
            setAmounts
          )
        }
      />
      {warningMessage ? (
        <Text style={styles.warning}>{warningMessage}</Text>
      ) : null}
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <Text style={styles.preTaxTotal}>
        Pre-Tax Total: ${preTaxTotal.toFixed(2)}
      </Text>
      <FlatList
        data={amounts}
        renderItem={({ item, index }) => (
          <Text key={index} style={styles.result}>
            {people[index].label || `Person ${index + 1}`}: $
            {item.amount.toFixed(2)} ({item.percentage.toFixed(2)}%)
          </Text>
        )}
        keyExtractor={(_, index) => index.toString()}
      />
    </SafeAreaView>
  );
};

export default App;
