import {
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";
import { useState } from "react";
const Main = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        <ListItem key={1} disablePadding>
          <ListItemButton>
            <ListItemIcon></ListItemIcon>
            <ListItemText primary={"ost"} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Paper
        elevation={3}
        square={false}
        sx={{
          minHeight: "80vh",
          minWidth: "80vw",
          display: "flex",
          background: "linear-gradient(135deg, #f5e1f7, #a3c6ff)",
        }}
      >
        <Box
          sx={{ display: "flex", "flex-direction": "column", flexBasis: "25%" }}
        >
          <Button sx={{ flexBasis: "10%" }} onClick={toggleDrawer(true)}>
            Open drawer
          </Button>
          <Drawer open={open} onClose={toggleDrawer(false)}>
            {DrawerList}
          </Drawer>

          <Box sx={{ flexBasis: "20%" }}>OST</Box>
          <Box sx={{ flexBasis: "70%" }}>hhh</Box>
        </Box>
        <Box
          sx={{
            p: 3,
          }}
          width="100%"
          borderRadius="10px"
        >
          <Box sx={{ display: "flex" }} height="80%">
            <Box sx={{ flexBasis: "50%" }}>image</Box>
            <Box sx={{ flexBasis: "50%" }}>list</Box>
          </Box>
          <Box>audio</Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Main;
