import {
  Box,
  Button,
  Card,
  CardMedia,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useState } from "react";
import useOstType from "../hooks/useOstType";
import { PUBLIC_URL_PREFIX } from "../constants/api";

const LeftSidePanel = () => {
  // drawer
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

  // ostTypeInfo
  const { data } = useOstType();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexBasis: "25%",
        height: "100%",
        borderRight: "3px solid #1b46e466",
      }}
    >
      {/* drawer */}
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
      <Button sx={{ flexBasis: "10%" }} onClick={toggleDrawer(true)}>
        Open drawer
      </Button>

      {/* Track Type Text*/}
      <Typography textAlign="center" sx={{ flexBasis: "20%", py: 1 }}>
        OST
      </Typography>

      {/* Track Type */}
      <Box
        sx={{
          overflowY: "auto",
        }}
      >
        <Box
          sx={{ display: "flex", flexDirection: "column", gap: 2, padding: 2 }}
        >
          {data?.map((ostType) => (
            <Card
              key={ostType.id}
              sx={{
                boxShadow: 1,
              }}
            >
              <CardMedia
                sx={{ width: 280, height: 280 }}
                image={PUBLIC_URL_PREFIX + ostType.image_path}
                title={ostType.name}
              />
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default LeftSidePanel;
