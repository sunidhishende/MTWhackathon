import {
  Group,
  ScrollArea,
  Stack,
  Title,
  Loader,
  Text,
  Center,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Transaction = () => {
  const { transactionId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://reqres.in/api/users/${transactionId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch transaction details");
        }
        const json = await response.json();
        setData(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [transactionId]);

  return (
    <ScrollArea>
      <Stack gap={20}>
        <Group>
          <Title order={2}>Transaction / #{transactionId}</Title>
        </Group>

        {loading && <Loader size="md" />}

        {error && (
          <Center>
            <Text color="red">Error: {error}</Text>
          </Center>
        )}

        {data && (
          <Stack>
            <Text>ID: {data.id}</Text>
            <Text>
              Name: {data.first_name} {data.last_name}
            </Text>
            <Text>Email: {data.email}</Text>
          </Stack>
        )}
      </Stack>
    </ScrollArea>
  );
};

export default Transaction;
