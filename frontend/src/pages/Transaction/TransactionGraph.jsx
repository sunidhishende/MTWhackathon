import { Paper } from "@mantine/core";
import ReactFlow, { Background } from "reactflow";
import "reactflow/dist/style.css";
import { nodesTypes } from "./ReactFlowGraph/helper";

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
  },
];

const transactions = [
  {
    id: 1,
    userId: 1,
    name: "Amazon Purchase",
    amount: 49.99,
    date: "2024-02-20",
    type: "Debit",
  },
  {
    id: 2,
    userId: 1,
    name: "G Pay Transfer",
    amount: 150.0,
    date: "2024-02-21",
    type: "Credit",
  },
  {
    id: 3,
    userId: 1,
    name: "Uber Ride",
    amount: 18.75,
    date: "2024-02-22",
    type: "Debit",
  },
  {
    id: 4,
    userId: 1,
    name: "PayPal Refund",
    amount: 75.5,
    date: "2024-02-23",
    type: "Credit",
  },
  {
    id: 5,
    userId: 1,
    name: "Netflix Subscription",
    amount: 15.99,
    date: "2024-02-24",
    type: "Debit",
  },
];

const TransactionGraph = () => {
  // Create user node
  const nodes = [
    {
      id: `user-${users[0].id}`,
      type: "customUserNode",
      position: { x: 250, y: 50 },
      data: { label: users[0].name },
    },
    ...transactions.map((tx, index) => ({
      id: `tx-${tx.id}`,
      type: "customTransactionNode",
      position: { x: 100 * index, y: 200 },
      data: { label: `${tx.name} ($${tx.amount})` },
    })),
  ];

  // Create edges connecting transactions to user
  const edges = transactions.map((tx) => ({
    id: `edge-${tx.id}`,
    source: `user-${tx.userId}`,
    target: `tx-${tx.id}`,
  }));

  return (
    <Paper w={"100%"} h={650} withBorder>
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodesTypes}>
        <Background />
      </ReactFlow>
    </Paper>
  );
};

export default TransactionGraph;
