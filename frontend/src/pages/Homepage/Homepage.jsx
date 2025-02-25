import { Group, ScrollArea, Stack, Title } from "@mantine/core";
import AddTransactionModal from "./AddTransaction";
import Stats from "./Stats";
import TransactionsDataTable from "./TransactionsDataTable";

const DataTableComponent = () => {
  return (
    <ScrollArea>
      <Stack gap={20}>
        <Title order={2}>Dashboard</Title>
        <Stats />
        <Group justify="flex-end">
          <AddTransactionModal />
        </Group>
        <TransactionsDataTable />
      </Stack>
    </ScrollArea>
  );
};

export default DataTableComponent;
