import React from "react";
import { Button, Modal, Title, TextInput, Group, Text, Box } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import classes from "./Transaction.module.css";

const AddTransactionModal = () => {
  const [fraud, setFraud] = React.useState({
    is_fraud: false,
    confidence: 0,
  });
  const [
    addTransactionModalOpen,
    { open: openAddTransactionModal, close: closeAddTransactionModal },
  ] = useDisclosure(false);

  const closeModal = () => {
    closeAddTransactionModal();
    setFraud({
      is_fraud: false,
      confidence: 0,
    });
  }

  const form = useForm({
    initialValues: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
    },
    validate: {
      cardNumber: (value) =>
        /^[0-9]{16}$/.test(value) ? null : "Invalid card number",
      expiryDate: (value) =>
        /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(value)
          ? null
          : "Invalid expiry date (MM/YY)",
      cvv: (value) => (/^[0-9]{3,4}$/.test(value) ? null : "Invalid CVV"),
      cardholderName: (value) => (value ? null : "Name is required"),
    },
  });

  const handleSave = async (values) => {
    const res = await fetch("http://localhost:8001/api/detection/inference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          "year": 2002,
          "month": 1,
          "day": 1,
          "mcc": 5411,
          "time_of_day": "6:30",
          "city": 0,
          "Use_chip_labeled": 1,
          "amount": 250.75,
          "has_error": 0,
          "irs_reportable_labeled": 0,
          "irs_description_labeled": 2,
          "user_id": 0,
          "card_id": 1,
      }
      ),
    });

    const res_obj = await res.json();
    console.log(res_obj);
    if (res_obj["status"] === "success") {
      setFraud({
        is_fraud: res_obj["data"]["is_fraud"],
        confidence: res_obj["data"]["confidence"],
      });
    } else {
      console.error("Error in API call");
      // closeAddTransactionModal();
    }

  };

  return (
    <>
      <Button onClick={openAddTransactionModal}>Add Transaction</Button>
      {addTransactionModalOpen && (
        <Modal
          opened={true}
          onClose={closeModal}
          title={<Title order={5}>Add Transaction</Title>}
          centered
        >
          <form onSubmit={form.onSubmit(handleSave)}>
            <TextInput
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              maxLength={16}
              classNames={{
                input: classes.search_box,
              }}
              {...form.getInputProps("cardNumber")}
            />
            <Group grow my={10}>
              <TextInput
                label="Expiry Date"
                placeholder="MM/YY"
                maxLength={5}
                classNames={{
                  input: classes.search_box,
                }}
                {...form.getInputProps("expiryDate")}
              />
              <TextInput
                label="CVV"
                placeholder="123"
                maxLength={4}
                classNames={{
                  input: classes.search_box,
                }}
                {...form.getInputProps("cvv")}
              />
            </Group>
            <TextInput
              label="Cardholder Name"
              placeholder="John Doe"
              classNames={{
                input: classes.search_box,
              }}
              {...form.getInputProps("cardholderName")}
            />
            <Group position="right" mt="md">
              <Button type="submit">Submit</Button>
            </Group>
            {/* Show if transaction is detected fraud */}
            {fraud.is_fraud && (
              <Box>
                <Text size="lg" weight={700} color="red">
                  Fraud Detected!
                </Text>
                <Text size="sm">
                  Confidence: {fraud.confidence.toFixed(2) * 100}%
                </Text>
              </Box>
            )}
          </form>
        </Modal>
      )}
    </>
  );
};

export default AddTransactionModal;
