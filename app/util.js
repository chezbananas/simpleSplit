// Utility functions
export const calculateSum = (text) => {
  const numbers = text.split("+").map((num) => parseFloat(num) || 0);
  return numbers.reduce((a, b) => a + b, 0);
};

export const isValidInput = (text) => {
  const invalidPattern = /[^\d.+]|(\.\.+)|(^[+])|([+]{2,})/g;
  return !invalidPattern.test(text);
};

export const handleAddPerson = (people, setPeople, setNumPeople) => {
  setPeople([...people, { label: "", preTax: "" }]);
  setNumPeople((prevNumPeople) => prevNumPeople + 1);
};

export const handleRemovePerson = (
  index,
  people,
  setPeople,
  setNumPeople,
  setAmounts
) => {
  if (people.length > 1) {
    const updatedPeople = people.filter((_, i) => i !== index);
    setPeople(updatedPeople);
    setNumPeople(updatedPeople.length);

    // Update the amounts array to match the updated people array
    const updatedAmounts = updatedPeople.map((_, i) => ({
      amount: 0,
      percentage: 0,
    }));
    setAmounts(updatedAmounts);
  }
};

export const handleCalculate = (
  people,
  totalAmount,
  setWarningMessage,
  setErrorMessage,
  setAmounts
) => {
  let invalidInput = false;

  people.forEach((person) => {
    if (!isValidInput(person.preTax)) {
      invalidInput = true;
    }
  });

  if (!isValidInput(totalAmount)) {
    invalidInput = true;
  }

  if (invalidInput) {
    setErrorMessage("Invalid input detected. Please correct it.");
    return;
  } else {
    setErrorMessage("");
  }

  const totalPreTax = people.reduce(
    (sum, person) => sum + parseFloat(calculateSum(person.preTax) || 0),
    0
  );

  if (parseFloat(totalAmount) < totalPreTax) {
    setWarningMessage(
      "Warning: The total after tax/tip is less than the sum of pre-tax totals."
    );
  } else if (parseFloat(totalAmount) > 1.35 * totalPreTax) {
    setWarningMessage(
      "Warning: The tax and tip seem abnormally high (> 1.35 times the pre-tax total)."
    );
  } else {
    setWarningMessage("");
  }

  const amountsCalculated = people.map((person) => {
    const proportion =
      parseFloat(calculateSum(person.preTax) || 0) / totalPreTax;
    return {
      amount: proportion * parseFloat(totalAmount || 0),
      percentage: proportion * 100,
    };
  });
  setAmounts(amountsCalculated);
};

export const updatePerson = (index, field, value, people, setPeople) => {
  const updatedPeople = people.map((person, i) =>
    i === index ? { ...person, [field]: value } : person
  );
  setPeople(updatedPeople);
};

export const handlePreTaxInputChange = (index, text, people, setPeople) => {
  const formattedText = text.replace(/[^0-9.+]/g, "");
  updatePerson(index, "preTax", formattedText, people, setPeople);
};

export const handleTotalAmountChange = (text, setTotalAmount) => {
  const formattedText = text.replace(/[^0-9.]/g, "");
  setTotalAmount(formattedText);
};

export const handleClearAll = (
  setPeople,
  setNumPeople,
  setTotalAmount,
  setAmounts,
  setWarningMessage,
  setErrorMessage
) => {
  setPeople([{ label: "", preTax: "" }]);
  setNumPeople(1);
  setTotalAmount("");
  setAmounts([]);
  setWarningMessage("");
  setErrorMessage("");
};

export const handleClearAmounts = (
  setPeople,
  setAmounts,
  setWarningMessage
) => {
  setPeople((prevPeople) =>
    prevPeople.map((person) => ({ ...person, preTax: "" }))
  );
  setAmounts([]);
  setWarningMessage("");
};
