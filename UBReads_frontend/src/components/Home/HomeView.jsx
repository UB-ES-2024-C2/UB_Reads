import React from "react";

// Material UI
import { Box, Container } from "@mui/material"; // Layout
import { Stack, Typography } from "@mui/material";

export const HomeView = () => {
    return (
        // Main container
        <Container maxWidth="false" sx={{ height: '100%' }}>
            <Box sx={{ height: '33%' }}>
                <Typography variant="h2">Recomanacions</Typography>
                <Stack>

                </Stack>
            </Box>
            <Box sx={{ height: '33%' }}>
                <Typography variant="h2">Books afegits recentment</Typography>
                <Stack>

                </Stack>
            </Box>
            <Box sx={{ height: '33%' }}>
                <Typography variant="h2">Ultims seguits</Typography>
                <Stack>

                </Stack>
            </Box>
        </Container>
    );
};