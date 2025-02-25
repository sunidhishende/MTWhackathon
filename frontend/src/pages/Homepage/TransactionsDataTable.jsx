import { Anchor, Center, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "mantine-datatable";

const PAGE_SIZE = 10;

const TransactionsDataTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://reqres.in/api/users?page=${page}&per_page=${PAGE_SIZE}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const json = await response.json();
        setData(json.data);
        setTotalRecords(json.total);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

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
          accessor: "first_name",
          title: "First Name",
          render: (record) => {
            return (
              <Anchor
                onClick={() => {
                  navigate(`/transaction/${record?.id}`);
                }}
              >
                {record?.first_name ?? "-"}
              </Anchor>
            );
          },
        },
        { accessor: "last_name", title: "Last Name" },
        { accessor: "email", title: "Email" },
      ]}
      records={data}
      totalRecords={totalRecords}
      recordsPerPage={PAGE_SIZE}
      page={page}
      onPageChange={setPage}
      highlightOnHover
      striped
      withTableBorder
    />
  );
};

export default TransactionsDataTable;
