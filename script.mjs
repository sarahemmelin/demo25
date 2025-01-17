'use strict';

import express from 'express';
import HTTP_CODES from './utils/httpCodes.mjs';
//Bryter ned koden først for å forstå hva som skjer
const app = express(); // Oppretter en instans av Express
// const port  = (process.env.PORT) || 8000; // Setter porten for serveren
//Har hatt problemer med å få denne porten til å fungere, endrer til:
const port = (process.env.PORT) || 3000;


app.set('port', port); // Setter porten for serveren

app.use(express.static('public')); // Middleware for å servere statiske filer
app.use(express.json()); // Middleware for å lese JSON-data

// Rute: Root ("/") - Returnerer "GZ"
function getRoot (req, res, next) { // En funksjon som tar imot en forespørsel, og sender en respons. (Request, Response, Next (som er neste funksjon i rekken))    
    res.status(HTTP_CODES.SUCCESS.OK).send("GZ").end(); // Sender en respons med statuskoden 200 (OK) og teksten "GZ"
} //.end() // Avslutter responsen, men er ikke alltid nødvendig etter .send() fordi .send() gjør det samme. Blir det som semikolon?

app.get("/", getRoot); // Setter opp en rute på root ("/") som kjører funksjonen getRoot når den blir forespurt


//Simulering av en database
//DIKT
function getHaiku (req, res, next) {
    const haikuFrosk = `
        En gammel dam.
        En frosk hopper.
        Plask!
    `;

    res.status(HTTP_CODES.SUCCESS.OK).send(haikuFrosk).end();
};

app.get("/tmp/poem/haiku", getHaiku);

function getAlliteration (req, res, next) {
    const alliteration = `

        "To sit in solemn silence in a dull, dark dock,
        In a pestilential prison, with a lifelong lock,
        Awaiting the sensation of a short, sharp shock,
        From a cheap and chippy chopper on a big black block!"
        - The Mikado, Gilbert and Sullivan
        `;

    res.status(HTTP_CODES.SUCCESS.OK).send(alliteration).end();
};

app.get("/tmp/poem/alliteration", getAlliteration);

function getLimerick (req, res, next) {
    const limerick = `
        There once was a man from Peru,
        Who dreamed he was eating his shoe.
        He woke with a fright,
        In the middle of the night,
        To find that his dream had come true!
        `;

    res.status(HTTP_CODES.SUCCESS.OK).send(limerick).end();
};

app.get("/tmp/poem/limerick", getLimerick);

//QUOTES
const quotes = [
    "The only place success comes before work is in the dictionary.",
    "Life is what happens when you’re busy making other plans.",
    "Har du sett der du la den fra deg?",
    "Get busy living or get busy dying.",
    "You only live once, but if you do it right, once is enough."
];

function getQuote (req, res, next) {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.status(HTTP_CODES.SUCCESS.OK).send(randomQuote).end();
}

app.get("/tmp/quote", getQuote);


//SUM (Skal bruke POST) - Skal ta imot to tall og returnere summen av dem
app.post("/tmp/sum/:a/:b", (req, res, next) => { 
    const { a, b } = req.params;
    const numA = parseFloat(a);
    const numB = parseFloat(b);

    if (isNaN(numA) || isNaN(numB)) {
        return res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).send("Bad Request: Both parameters must be numbers.");
    }

    const sum = numA + numB;
    res.status(HTTP_CODES.SUCCESS.OK).send(`The sum of ${numA} and ${numB} is ${sum}`);
});

//Simuler en tilfeldig http-statuskode fra objektet HTTP_CODES i httpCodes.mjs for å kjøre tilfeldige values fra objekter som er importert inn i denne filen.
app.get("/tmp/random-status", (req, res, next) => {
    const allCodes = [
        ...Object.values(HTTP_CODES.SUCCESS),
        ...Object.values(HTTP_CODES.CLIENT_ERROR),
        ...Object.values(HTTP_CODES.SERVER_ERROR)
    ];
    const randomCode = allCodes[Math.floor(Math.random() * allCodes.length)];
    res.status(randomCode).send(`Response with random status code ${randomCode}`).end();
});

app.listen(app.get('port'), function () {
    console.log(`server is running on port ${app.get('port')}`);
}).on('error', (err) => {
    console.error('Failed to start server:', err);
});