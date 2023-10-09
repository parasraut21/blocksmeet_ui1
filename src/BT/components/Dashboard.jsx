import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, CssBaseline, IconButton, Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 240;

const Dashboard =() => {
    const [open, setOpen] = useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <div style={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleDrawerOpen}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="temporary"
                anchor="left"
                open={open}
                onClose={handleDrawerClose}
                style={{ width: drawerWidth }}
            >
                <List>
                    {['Dashboard', 'Profile', 'Settings', 'Help'].map((text) => (
                        <ListItem button key={text} onClick={handleDrawerClose}>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            <main style={{ flexGrow: 1, padding: '80px 20px' }}>
                <Container>
                    <Typography variant="h4">Welcome to the Dashboard!</Typography>
                    <Typography variant="body1" style={{ marginTop: '20px' }}>
                        Here, you can add more detailed dashboard contents.
                    </Typography>
                </Container>
            </main>
        </div>
    );
}

export default Dashboard;
