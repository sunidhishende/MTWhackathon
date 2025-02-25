import { Group, ScrollArea, Stack, Title } from "@mantine/core";
import TransactionsDataTable from "./TransactionsDataTable";

const DataTableComponent = () => {
  return (
    <ScrollArea>
      <Stack gap={20}>
        <Group justify="space-between">
          <Title order={2}>Dashboard</Title>
        </Group>
        <TransactionsDataTable />
      </Stack>
    </ScrollArea>
  );
};

export default DataTableComponent;
