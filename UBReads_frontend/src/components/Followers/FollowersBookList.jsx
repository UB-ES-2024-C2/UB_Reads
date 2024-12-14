import React from "react";
import { Stack, Box, Typography } from "@mui/material"; // Layout
import { blue } from "@mui/material/colors"; // Colors

export const FollowersBookList = () => {

    const mockupData = [
        { id: 1, title: "To Kill a Mockingbird", cover_url: "https://picsum.photos/200/300" },
        { id: 2, title: "1984", cover_url: "https://picsum.photos/200/300" },
        { id: 3, title: "The Great Gatsby", cover_url: "https://picsum.photos/200/300" },
        { id: 4, title: "The Catcher in the Rye", cover_url: "https://picsum.photos/200/300" },
        { id: 5, title: "The Hobbit", cover_url: "https://picsum.photos/200/300" },
        { id: 6, title: "Fahrenheit 451", cover_url: "https://picsum.photos/200/300" },
        { id: 7, title: "Pride and Prejudice", cover_url: "https://picsum.photos/200/300" },
        { id: 8, title: "The Lord of the Rings", cover_url: "https://picsum.photos/200/300" },
        { id: 9, title: "Harry Potter and the Sorcerer's Stone", cover_url: "https://picsum.photos/200/300" },
        { id: 10, title: "The Chronicles of Narnia", cover_url: "https://picsum.photos/200/300" },
        { id: 11, title: "Moby Dick", cover_url: "https://picsum.photos/200/300" },
        { id: 12, title: "War and Peace", cover_url: "https://picsum.photos/200/300" },
        { id: 13, title: "Crime and Punishment", cover_url: "https://picsum.photos/200/300" },
        { id: 14, title: "The Odyssey", cover_url: "https://picsum.photos/200/300" },
        { id: 15, title: "The Iliad", cover_url: "https://picsum.photos/200/300" },
        { id: 16, title: "Jane Eyre", cover_url: "https://picsum.photos/200/300" },
        { id: 17, title: "Brave New World", cover_url: "https://picsum.photos/200/300" },
        { id: 18, title: "Wuthering Heights", cover_url: "https://picsum.photos/200/300" },
        { id: 19, title: "The Divine Comedy", cover_url: "https://picsum.photos/200/300" },
        { id: 20, title: "The Brothers Karamazov", cover_url: "https://picsum.photos/200/300" },
        { id: 21, title: "Anna Karenina", cover_url: "https://picsum.photos/200/300" },
        { id: 22, title: "Don Quixote", cover_url: "https://picsum.photos/200/300" },
        { id: 23, title: "The Picture of Dorian Gray", cover_url: "https://picsum.photos/200/300" },
        { id: 24, title: "Les Misérables", cover_url: "https://picsum.photos/200/300" },
        { id: 25, title: "The Count of Monte Cristo", cover_url: "https://picsum.photos/200/300" },
        { id: 26, title: "Dracula", cover_url: "https://picsum.photos/200/300" },
        { id: 27, title: "Frankenstein", cover_url: "https://picsum.photos/200/300" },
        { id: 28, title: "The Grapes of Wrath", cover_url: "https://picsum.photos/200/300" },
        { id: 29, title: "The Old Man and the Sea", cover_url: "https://picsum.photos/200/300" },
        { id: 30, title: "One Hundred Years of Solitude", cover_url: "https://picsum.photos/200/300" },
        { id: 31, title: "The Sound and the Fury", cover_url: "https://picsum.photos/200/300" },
        { id: 32, title: "The Metamorphosis", cover_url: "https://picsum.photos/200/300" },
    ];

    return (
        <Stack direction="row" sx={{ padding: '1.5rem', overflowX: 'auto', whiteSpace: 'nowrap'}}>
            {mockupData.map((book) => (
                <Box key={book.id} sx={{ height: '14rem', textAlign: 'center', minWidth: '10rem', padding: '1rem' }}>
                    <img src={book.cover_url} alt={book.title} style={{ borderRadius: '1rem', width: 'auto', height: '65%', objectFit: 'cover' }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '35%' }}>
                        <Typography variant="h6" sx={{ marginBottom: 0, marginTop: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal', '&:hover': { cursor: 'pointer', color: blue[800]}  }}>{book.title}</Typography>
                    </Box>
                </Box>
            ))}
        </Stack>
    );
};
