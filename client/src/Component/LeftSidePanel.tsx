import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import useOstType from "../hooks/useOstType";
import { PUBLIC_URL_PREFIX } from "../constants/api";
import { useAudioPlayerStore } from "../store/audioPlayerStore";
import MenuIcon from "@mui/icons-material/Menu";

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

  const setCurrentType = useAudioPlayerStore((s) => s.setCurrentType);

  // ostTypeInfo
  const { data } = useOstType();

  useEffect(() => {
    if (data) setCurrentType(data[0]);
  }, [data, setCurrentType]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexBasis: "25%",
        height: "100%",
      }}
    >
      {/* drawer */}
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          flexBasis: "10%",
        }}
      >
        <IconButton sx={{ p: 2 }} onClick={toggleDrawer(true)}>
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Track Type Text*/}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexBasis: "20%",
          py: 1,
        }}
      ></Box>

      {/* Track Type */}
      <Box
        sx={{
          overflowY: "auto",
        }}
      >
        <Typography sx={{ fontSize: 14, px: 2 }}>OST Tracks</Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 3,
            px: 2,
            py: 1,
          }}
        >
          {data?.map((ostType) => (
            <Card
              key={ostType.id}
              sx={{
                boxShadow: 1,
                ":hover": {
                  boxShadow: 20,
                },
              }}
            >
              <CardActionArea onClick={() => setCurrentType(ostType)}>
                <CardMedia
                  sx={{ width: 200, height: 200 }}
                  image={PUBLIC_URL_PREFIX + ostType.image_path}
                  title={ostType.name}
                />
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default LeftSidePanel;
