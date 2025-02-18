import  HTTP_CODES  from '../utils/httpCodes.mjs';

//================================ Deck of cards =====================================
let deckIdCounter = 0; 
const decks = {}; 

const NewDeckOfCards = {
    deckId: 0,
    cards: [
        { suit: "hearts", value: "2" },
        { suit: "hearts", value: "3" },
        { suit: "hearts", value: "4" },
        { suit: "hearts", value: "5" },
        { suit: "hearts", value: "6" },
        { suit: "hearts", value: "7" },
        { suit: "hearts", value: "8" },
        { suit: "hearts", value: "9" },
        { suit: "hearts", value: "10" },
        { suit: "hearts", value: "J" },
        { suit: "hearts", value: "Q" },
        { suit: "hearts", value: "K" },
        { suit: "hearts", value: "A" },
        { suit: "diamonds", value: "2" },
        { suit: "diamonds", value: "3" },
        { suit: "diamonds", value: "4" },
        { suit: "diamonds", value: "5" },
        { suit: "diamonds", value: "6" },
        { suit: "diamonds", value: "7" },
        { suit: "diamonds", value: "8" },
        { suit: "diamonds", value: "9" },
        { suit: "diamonds", value: "10" },
        { suit: "diamonds", value: "J" },
        { suit: "diamonds", value: "Q" },
        { suit: "diamonds", value: "K" },
        { suit: "diamonds", value: "A" },
        { suit: "clubs", value: "2" },
        { suit: "clubs", value: "3" },
        { suit: "clubs", value: "4" },
        { suit: "clubs", value: "5" },
        { suit: "clubs", value: "6" },
        { suit: "clubs", value: "7" },
        { suit: "clubs", value: "8" },
        { suit: "clubs", value: "9" },
        { suit: "clubs", value: "10" },
        { suit: "clubs", value: "J" },
        { suit: "clubs", value: "Q" },
        { suit: "clubs", value: "K" },
        { suit: "clubs", value: "A" },
        { suit: "spades", value: "2" },
        { suit: "spades", value: "3" },
        { suit: "spades", value: "4" },
        { suit: "spades", value: "5" },
        { suit: "spades", value: "6" },
        { suit: "spades", value: "7" },
        { suit: "spades", value: "8" },
        { suit: "spades", value: "9" },
        { suit: "spades", value: "10" },
        { suit: "spades", value: "J" },
        { suit: "spades", value: "Q" },
        { suit: "spades", value: "K" },
        { suit: "spades", value: "A" },
    ],
    discardPile: [], 
};

//Fisher-Yates shuffle
function shuffle(array){
    for (let i = array.length -1; i > 0; i--){
        const j = Math.floor(Math.random() * (i+1));
        [array[i], array[j]] = [array[j], array[i]];

    }
    return array;
}

//Lager en ny kortstokk med POST
export function createDeck (req, res, next) {
    deckIdCounter++;
    const deckId = deckIdCounter;
    const newDeck = { ...NewDeckOfCards, deckId};
    decks[deckId] = newDeck;

    res.status(HTTP_CODES.SUCCESS.CREATED).send(newDeck);
}

// Stokker kortstokken med PATCH (Shuffle)
export function shuffleDeck (req, res, next) {
    const { deckId } = req.params;
    const deck = decks[deckId]; // Finn kortstokken basert på deckId
    if (!deck){
        return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send("Deck not found");
    }

    deck.cards = shuffle(deck.cards);
    res.status(HTTP_CODES.SUCCESS.OK).send(deck);
}

// Returnerer hele kortstokken med GET (View) 
// (minus kort som allerede er trukket - kommer senere)
export function getDeck (req, res, next) {
    const { deckId } = req.params;
    const deck = decks[deckId];
    if (!deck){
        return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send("Deck not found");
    }
    res.status(HTTP_CODES.SUCCESS.OK).send(deck);
}

//Se alle kortstokkene (så man kan se at de er stokket)
export function getAllDecks (req, res, next) {
    res.status(HTTP_CODES.SUCCESS.OK).send(decks);
}

export function reshuffleDeck(req, res, next) {
    const { deckId } = req.params;
    const deck = decks[deckId];

    if (!deck) {
        return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send("Deck not found");
    }

    deck.cards = [...deck.cards, ...deck.discardPile];
    deck.discardPile = [];

    deck.cards = shuffle(deck.cards);

    res.status(HTTP_CODES.SUCCESS.OK).send({
        message: "Deck reshuffled with discard pile",
        deck
    });
}

export function drawCard(req, res, next) {
    const { deckId } = req.params;
    const deck = decks[deckId];

    if (deck.cards.length === 0) {
        return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send("Deck not found");
    }

    if (deck.cards.length === 0) {
        return res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).send("No more cards in the deck");
    }

    const card = deck.cards.pop();
    deck.discardPile.push(card);
    
    res.status(HTTP_CODES.SUCCESS.OK).send(card);
}