import { Container } from "@mantine/core";
import { Route, Routes } from "react-router-dom";
import Transaction from "./Transaction/Transaction";
import Homepage from "./Homepage/Homepage";
import User from "./User/User";

const Dashboard = () => {
  return (
    <Container
      fluid
      p={30}
      style={{
        transition: "margin-left 400ms ease-in-out",
      }}
    >
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/transaction/:transactionId" element={<Transaction />} />
        <Route path="/user/:userId" element={<User />} />
      </Routes>
    </Container>
  );
};

export default Dashboard;
