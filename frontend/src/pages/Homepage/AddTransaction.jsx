import { Button, Modal, Title, TextInput, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import classes from "./Transaction.module.css";

const AddTransactionModal = () => {
  const [
    addTransactionModalOpen,
    { open: openAddTransactionModal, close: closeAddTransactionModal },
  ] = useDisclosure(false);

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

  const handleSave = (values) => {
    console.log("VALUES", values);
    closeAddTransactionModal();
  };

  return (
    <>
      <Button onClick={openAddTransactionModal}>Add Transaction</Button>
      {addTransactionModalOpen && (
        <Modal
          opened={true}
          onClose={closeAddTransactionModal}
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
          </form>
        </Modal>
      )}
    </>
  );
};

export default AddTransactionModal;
