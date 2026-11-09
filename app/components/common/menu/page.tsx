"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Box, Divider } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import LockIcon from '@mui/icons-material/Lock';
import HomeIcon from '@mui/icons-material/Home';
import dayjs from "dayjs";
import 'dayjs/locale/ja';
dayjs.locale('ja');

const Menu = () => {
  // Drawerの開閉状態だけ残す
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 今日の日付を取得
  const today = dayjs().format('YYYY年M月D日（dd）');

  // 時間を取得
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);



  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const iconMap: { [key: string]: React.ElementType } = {
    HomeIcon: HomeIcon,
    LocalLibraryIcon: LocalLibraryIcon,
    CropOriginalIcon: CropOriginalIcon,
    LockIcon: LockIcon,
  };

  const navLinks = [
    { label: "1", href: "/", icon: "HomeIcon" },
    { label: "2", href: "/", icon: "LocalLibraryIcon" },
    { label: "3", href: "/", icon: "CropOriginalIcon" },
    { label: "4", href: "/", icon: "LockIcon" },
  ];

  return (
    <>
      {/* --- ハンバーガーボタン --- */}
      <div>
        <IconButton onClick={toggleDrawer(true)} aria-label="menu">
          <MenuIcon className="text-[#5c988e]" />
        </IconButton>
      </div>

      {/* --- MUI Drawer (左から出現 ※コードではanchor="right"になっています) --- */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List className="pt-10">
            {navLinks.map((link, index) => {
              const IconTag = iconMap[link.icon];
              return (
                <div key={index}>
                  <ListItem disablePadding>
                    <Link href={link.href} className="w-full">
                      <ListItemButton
                        sx={{
                          py: 2,
                          px: 3,
                          transition: 'all 0.3s',
                          '&:hover': {
                            backgroundColor: 'rgba(99, 102, 241, 0.08)',
                            '& .MuiListItemText-root': {
                              transform: 'translateX(4px)',
                              transition: 'transform 0.3s',
                            }
                          }
                        }}
                      >
                        <IconTag sx={{ color: '#5c988e', mr: 2 }} />
                        <ListItemText primary={link.label} sx={{ color: '#5c988e' }} />
                      </ListItemButton>
                    </Link>
                  </ListItem>

                  {index < navLinks.length - 1 && (
                    <Divider variant="middle" component="li" sx={{ borderColor: 'rgba(99, 102, 241, 0.1)' }} />
                  )}
                </div>
              );
            })}
          </List>
        </Box>
        <div className="h-full flex justify-center items-end pb-8">
          <div className="text-[18px] text-[#5c988e]">
            <p className="flex justify-center text-[18px]">{today}</p>
            <p className="flex justify-center text-[24px]">
              {dayjs(time).format('HH:mm')}
            </p>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Menu;
