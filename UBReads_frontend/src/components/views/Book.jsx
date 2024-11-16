import './book.css';
import React from 'react';

// Material UI imports
import StarIcon from '@mui/icons-material/Star'; // Icons
import { green, blue, yellow } from '@mui/material/colors'; // Colors
import { Typography, Button, Rating, Box } from '@mui/material'; // Components

export const Book = ({bookId}) => {

    const [value, setValue] = React.useState(0);
    const [hover, setHover] = React.useState(-1);

    const dummyBooks = [
        {
            id: 1,
            title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
            author: 'Robert C. Martin',
            rating: 0,
            sinopsis: "Fins i tot el codi incorrecte pot funcionar. Però si el codi no està  net, pot posar de genolls a una organització de desenvolupament. Cada  any, es perden innombrables hores i recursos importants a causa d'un  codi mal escrit. Però no té per què ser així. El destacat expert en  programari Robert C. Martin presenta un paradigma revolucionari amb Clean Code: A Handbook of Agile Programari Craftsmanship.",
            img: 'https://m.media-amazon.com/images/I/51E2055ZGUL._AC_UF894,1000_QL80_.jpg'
        },
    ]

    const labels = {
        0: "0",
        0.5: "0.5",
        1: "1",
        1.5: "1.5",
        2: "2",
        2.5: "2.5",
        3: "3",
        3.5: "3.5",
        4: "4",
        4.5: "4.5",
        5: "5",
      };

    const fetchData = (id) => {
        return dummyBooks.find(book => book.id === id)
    }

    function getLabelText(value) {
        return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
      }

    const book = fetchData(bookId);

    return (
        <div id="book-container">
            <div id="cover-container">
                <img src={book.img}/>
            </div>
            <div id="data-container">
            <Typography variant="h2" component="h1" sx={{ color: blue[800], fontWeight: 'bold' }}>{ book.title }</Typography>
                <div id="subtitle-container">
                    <Typography variant="h6" component="h2" sx={{ color: blue[800] }}>{ book.author }</Typography>
                    <div id="rating-container">
                        <Rating
                            name="hover-feedback"
                            size="large"
                            value={value}
                            precision={0.5}
                            getLabelText={getLabelText}
                            onChange={(event, newValue) => {
                            setValue(newValue);
                            }}
                            onChangeActive={(event, newHover) => {
                            setHover(newHover);
                            }}
                            emptyIcon={<StarIcon  fontSize='inherit'/>}
                        />
                        {value !== null && (
                            <Box sx={{ ml: '1rem' }}>{labels[hover !== -1 ? hover : value]}</Box>
                        )}
                    </div>
                </div>
                <Button
                        variant="contained"
                        sx={{
                            bgcolor: green['A700'],
                            marginInline: '1rem',
                            paddingInline: '3rem',
                            textTransform: 'capitalize',
                            fontSize: '1.2rem',
                            paddingBlock:'0.3rem',
                            borderRadius: '0.5rem'
                        }}
                        >
                            Afegir
                        </Button>
                <div id="content-container">
                    <Typography variant="body1" component="p">{ book.sinopsis }</Typography>
                    <Typography variant="body1" component="span">Llegir més</Typography>
                </div>
            </div>
        </div>
    );
}