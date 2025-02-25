import { Flex, Group, ScrollArea, Stack, Switch, Title } from "@mantine/core";
import { IconSitemap, IconTable } from "@tabler/icons-react";
import { useState } from "react";
import TransactionsDataTable from "./TransactionsDataTable";
import TransactionGraphTable from "./TransactionGraphTable";

const DataTableComponent = () => {
  const [tableView, setTableView] = useState(true);

  return (
    <ScrollArea>
      <Stack gap={20}>
        <Group justify="space-between">
          <Title order={2}>Dashboard</Title>
          <Flex align="center" columnGap={10}>
            <IconSitemap size={20} />
            <Switch
              size="md"
              checked={tableView}
              onChange={(event) => {
                setTableView(event.currentTarget.checked);
              }}
            />
            <IconTable size={20} />
          </Flex>
        </Group>
        {tableView ? <TransactionsDataTable /> : <TransactionGraphTable />}
      </Stack>
    </ScrollArea>
  );
};

export default DataTableComponent;
