import './book.css';
import React from 'react';
import BookService from '../../services/BookService.js';

// Material UI imports
import StarIcon from '@mui/icons-material/Star'; // Icons
import { green, blue } from '@mui/material/colors'; // Colors
import { Typography, Button, Rating, Box } from '@mui/material'; // Components

export const Book = ({id}) => {

    const dummyBooks = [
        {
            id: 1,
            title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
            author: 'Robert C. Martin',
            averageRating: 3.5,
            desciption: "Fins i tot el codi dolent pot funcionar. Però si el codi no està net, pot posar de genolls una organització de desenvolupament. Cada any es perden innombrables hores i recursos significatius a causa d'un codi mal escrit. Però no ha de ser així. Robert C. Martin, expert en software, presenta un paradigma revolucionari amb Clean Code: A Handbook of Agile Software Craftsmanship. Martin s'ha associat amb els seus col·legues d'Object Mentor per destil·lar la seva millor pràctica àgil de la neteja de codi sobre la marxa en un llibre que inculcarà dins de vostè els valors d'un artesà de programari i fer-li un millor programador però només si treballa en ell. Quin tipus de treball faràs? Vostè estarà llegint codi - un munt de codi. I se't desafiarà a pensar en el que està bé sobre aquest codi, i el que està malament amb ell. I el que és més important, se't desafiarà a reavaluar els teus valors professionals i el teu compromís amb el teu ofici. El codi net es divideix en tres parts. El primer descriu els principis, patrons i pràctiques d'escriure codi net. La segona part consta de diversos casos d'estudi de complexitat creixent. Cada cas d'estudi és un exercici de neteja de codi - de transformar una base de codi que té alguns problemes en un que és sòlid i eficient. La tercera part és la recompensa: un únic capítol que conté una llista d'heurístiques i \"malalties\" reunides mentre es crea el cas d'estudi. El resultat és una base de coneixement que descriu la manera en què pensem quan escrivim, llegim i netegem el codi. Els lectors s'allunyaran de la comprensió d'aquest llibre: - Com distingir la diferència entre codi bo i codi dolent - Com escriure un bon codi i com transformar el codi dolent en un bon codi- Com crear bons noms, bones funcions, bons objectes i bones classes - Com formatar codi per a la màxima llegibilitat - Com implementar la gestió completa d'errors sense enfosquir la lògica del codi - Com unificar test i practicar el desenvolupament basat en proves Aquest llibre és imprescindible per a qualsevol desenvolupador, enginyer de programari, gestor de projectes, cap d'equip o analista de sistemes amb interès a produir millor codi.",
            cover: 'https://m.media-amazon.com/images/I/51E2055ZGUL._AC_UF894,1000_QL80_.jpg'
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

    const [rating, setRating] = React.useState(null);
    const [bookItem, setBookItem] = React.useState({});
    const [readMorePressed, setReadMorePressed] = React.useState(false);

    const getLabelText = (value) => {
        return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
    }

    const showMore = () => {
        if (readMorePressed) {
            document.querySelector('#content-container p').style.maxHeight = '2lh';
            document.querySelector('#content-container span').innerHTML = 'Llegir més';
        } else {
            document.querySelector('#content-container p').style.maxHeight = 'none';
            document.querySelector('#content-container span').innerHTML = 'Llegir menys';
        }
        setReadMorePressed(!readMorePressed);
    }

    React.useEffect(() => {
        BookService.getGoogleBookById(id).then((response) => {
            const usefulData = {
                title: response.data.volumeInfo.title,
                author: response.data.volumeInfo.authors[0],
                averageRating: response.data.volumeInfo.averageRating,
                desciption: response.data.volumeInfo.description,
                cover: response.data.volumeInfo.imageLinks.large
            }
            setBookItem(usefulData);
            setRating(bookItem.averageRating)
        })
    }, [id]);

    console.log(bookItem);

    return (
        <div id="book-container">
            <div id="cover-container">
                <img src={bookItem.cover}/>
            </div>
            <div id="data-container">
                <Typography variant="h2" component="h1" sx={{ color: blue[800], fontWeight: 'bold' }}>{ bookItem.title }</Typography>
                <Typography variant="h6" component="h2" sx={{ color: blue[800], fontSize: '1.5rem' }}>{ bookItem.author }</Typography>
                <div id="rating-container">
                    <Rating readOnly
                        name="hover-feedback"
                        size="large"
                        value={rating}
                        precision={0.5}
                        getLabelText={getLabelText}
                        sx={{ display: 'flex', alignContent: 'center' }}
                        emptyIcon={<StarIcon  fontSize='inherit'/>}
                    />
                    {rating !== null && (
                        <Box sx={{ ml: '1rem' }}>{ rating }</Box>
                    )}
                </div>
                <Button
                        variant="contained"
                        sx={{
                            bgcolor: green['A700'],
                            paddingInline: '3rem',
                            textTransform: 'capitalize',
                            fontSize: '1.2rem',
                            borderRadius: '0.5rem'
                        }}
                        >
                            Afegir
                        </Button>
                {bookItem.desciption !== undefined && (
                    <div id="content-container">
                        <Typography variant="h5" component="p" sx={{ maxHeight: '2lh', overflow: 'hidden' }}>{ bookItem.desciption }</Typography>
                        <Typography variant="h5" component="span" sx={{ fontWeight: 'bold', color: blue[800], cursor: 'pointer' }} onClick={showMore}>Llegir més</Typography>
                    </div>
                )}
            </div>
        </div>
    );
}