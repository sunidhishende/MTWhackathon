import { Box, Text } from "@mantine/core";
import { Handle, Position } from "reactflow";

// eslint-disable-next-line react/prop-types
const UserNode = ({ data }) => {
  return (
    <Box
      pos="relative"
      w={100}
      h={100}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <Text size="xs" fw={800} ta="center" c="white" pb={2} pt={3}>
          User
        </Text>
        <Text
          size={"lg"}
          fw={800}
          ta="center"
          c="white"
          p={16}
          bg="rgba(0, 0, 0, 0.5)"
          style={{ whiteSpace: "nowrap" }}
        >
          {data?.label}
        </Text>
        <Handle
          type="source"
          position={Position.Bottom}
          id="a"
          style={{
            top: "25%",
            zIndex: -1,
          }}
        />
      </Box>
    </Box>
  );
};

export default UserNode;
