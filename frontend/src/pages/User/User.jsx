import { Center, Group, ScrollArea, Stack, Text, Title } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

const User = () => {
  const { userId } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "http://192.168.50.171:8001/api/transaction/user",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: parseInt(userId) }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const json = await response.json();
        const rData = json?.map((d) => ({ id: uuidV4(), ...d }));
        setTransactions(rData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  return (
    <ScrollArea>
      <Stack gap={20}>
        <Group>
          <Title order={2}>User / #{userId}</Title>
        </Group>

        {error && (
          <Center>
            <Text color="red">Error: {error}</Text>
          </Center>
        )}

        <DataTable
          fetching={loading}
          columns={[
            {
              accessor: "id",
              title: "ID",
              hidden: true,
            },
            {
              accessor: "card",
              title: "Card",
            },
            {
              accessor: "date",
              title: "Date / Time",
              render: (record) => {
                return (
                  <Text>
                    {record?.transaction?.day}/{record?.transaction?.month}/
                    {record?.transaction?.year} - {record?.transaction?.time}
                  </Text>
                );
              },
            },
          ]}
          records={transactions}
          highlightOnHover
          striped
          withTableBorder
        />
      </Stack>
    </ScrollArea>
  );
};

export default User;
