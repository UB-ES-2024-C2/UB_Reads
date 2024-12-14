import React from "react";
import { Container } from "@mui/system";
import FollowerService from "../../services/FollowerService.js";
import { UserCard } from "./UserCard.jsx";
import { FollowersBookList } from "./FollowersBookList.jsx";
import { Grid2 } from '@mui/material';
import LibraryService from "../../services/LibraryService.js";
import BookService from "../../services/BookService.js";

export const FollowersView = ({ query }) => {

    const [users, setUsers] = React.useState([]);
    const [usersBooks, setUsersBooks] = React.useState([]);
    const isFirstRender = React.useRef(true);


    React.useEffect(() => {
        // Avoid to call the function on the first render
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        } else if (query && query.trim() !== '') {
            followUser(query);
        }
    }, [query]);

    const fetchUsersFollowed = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const usersFollowed = await FollowerService.getUsersFollowed(token);
            setUsers(usersFollowed);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchUsersBooks = async () => {
        try {
            const libraries = await Promise.all(users.map(async user => await LibraryService.getBooksByUserId(user.id)));
            const books = await Promise.all(libraries.map(async library => await Promise.all(await library.map(async book => await BookService.getBookById(book.id_book)))));
            setUsersBooks(books);
        } catch (error) {
            console.error(error);
        }
    };

    React.useEffect(() => {
        fetchUsersFollowed();
    }, []);

    React.useEffect(() => {
        if (users.length > 0) {
            fetchUsersBooks();
        }
    }, [users]);

    const followUser = async (username) => {
        try {
            const token = localStorage.getItem('access_token');
            await FollowerService.followUserByUsername(token, username);
            setUsers([...users, username]);
        } catch (error) {
            alert(`Error al seguir al usuario: ${error.message}`);
        }
    };

    const unfollowUser = async (username) => {
        try {
            const token = localStorage.getItem('access_token');
            await FollowerService.unfollowUserByUsername(token, username);
            setUsers(users.filter(user => user.username !== username));
        } catch (error) {
            alert(`Error al dejar de seguir al usuario: ${error.message}`);
        }
    };

    return (
        /* Main container */
        <Container maxWidth="false" sx={{ paddingInline: '0 !important', height: '100dvh', overflow: 'auto', display: 'flex', flexDirection: 'column', paddingBottom: '5rem' }}>
            {users.map((user, index) => (
                <Grid2 key={index} container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Grid2 size={1} sx={{ border: '1px solid #000000', height: '100%' }}>
                        <UserCard user={user} unfollow={unfollowUser} />
                    </Grid2>
                    <Grid2 size={11} sx={{ border: '1px solid #000000', height: '100%' }}>
                        <FollowersBookList books={usersBooks[index]} />
                    </Grid2>
                </Grid2>
            ))}
        </Container>
    );
};