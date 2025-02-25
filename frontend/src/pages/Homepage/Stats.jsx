import { Box, Group, Paper, Skeleton, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { IconCreditCardPay, IconUser, IconExchange } from "@tabler/icons-react";
import classes from "./Stats.module.css";

const Stats = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "http://192.168.50.171:8001/api/transaction/total",
          {
            method: "POST",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const json = await response.json();
        const rData = {};
        json?.forEach((d) => {
          const keys = Object.keys(d?.[0] ?? {});
          keys.forEach((key) => {
            rData[key] = d?.[0]?.[key];
          });
        });
        setData(rData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) return null;

  return (
    <Group justify="center" gap={32}>
      <Paper withBorder p="md" radius="md">
        <Group>
          <IconUser />
          <Stack style={{ flex: 1 }}>
            <Text size="xs" c="dimmed" className={classes.title}>
              Users
            </Text>

            <Box>
              {loading ? (
                <Skeleton
                  height={22}
                  width={150}
                  className={classes.valueSpinner}
                />
              ) : (
                <Text className={classes.value}>{data?.user ?? "-"}</Text>
              )}
            </Box>
          </Stack>
        </Group>
      </Paper>
      <Paper withBorder p="md" radius="md">
        <Group>
          <IconCreditCardPay />
          <Stack style={{ flex: 1 }}>
            <Text size="xs" c="dimmed" className={classes.title}>
              Transactions
            </Text>

            <Box>
              {loading ? (
                <Skeleton
                  height={22}
                  width={150}
                  className={classes.valueSpinner}
                />
              ) : (
                <Text className={classes.value}>
                  {data?.transaction ?? "-"}
                </Text>
              )}
            </Box>
          </Stack>
        </Group>
      </Paper>
      <Paper withBorder p="md" radius="md">
        <Group>
          <IconExchange />
          <Stack style={{ flex: 1 }}>
            <Text size="xs" c="dimmed" className={classes.title}>
              Merchants
            </Text>

            <Box>
              {loading ? (
                <Skeleton
                  height={22}
                  width={150}
                  className={classes.valueSpinner}
                />
              ) : (
                <Text className={classes.value}>{data?.merchant ?? "-"}</Text>
              )}
            </Box>
          </Stack>
        </Group>
      </Paper>
    </Group>
  );
};

export default Stats;
