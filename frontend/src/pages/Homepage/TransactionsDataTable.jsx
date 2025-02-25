import { Anchor, Center, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "mantine-datatable";
import { v4 as uuidV4 } from "uuid";

const TransactionsDataTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "http://192.168.50.171:8001/api/transaction/all",
          {
            method: "POST",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const json = await response.json();
        const rData = json?.map((d) => ({ id: uuidV4(), ...d }));
        setData(rData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error)
    return (
      <Center>
        <Text color="red">Error: {error}</Text>
      </Center>
    );

  return (
    <DataTable
      fetching={loading}
      columns={[
        {
          accessor: "id",
          title: "ID",
          hidden: true,
        },
        {
          accessor: "user",
          title: "User",
          render: (record) => {
            return (
              <Anchor
                onClick={() => {
                  navigate(`/user/${record?.user}`);
                }}
              >
                {record?.user ?? "-"}
              </Anchor>
            );
          },
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
      records={data}
      highlightOnHover
      striped
      withTableBorder
    />
  );
};

export default TransactionsDataTable;
