require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
// const booksData = require('./data/books.json');
// Подключение модели книги
const Book = require('./models/Book');

const app = express();
app.use(cors());
app.use(express.json());

const getRandomBook = (books) => {
  const randomIndex = Math.floor(Math.random() * books.length);
  const randomBook = books[randomIndex];
  return randomBook;
};

// Маршрут для получения рандомной книги
app.get('/books/random', async (req, res) => {
  try {
    const books = await Book.find(); // Получаем все книги из базы данных
    res.json(getRandomBook(books)); // рандомную книгу получаем
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка получения книги' });
  }
});
// Маршрут для добавления книги
// Create a new book
app.post('/books', async (req, res) => {
  const book = new Book(req.body);
  try {
    await book.save();
    res.status(201).send(book);
  } catch (err) {
    res.status(400).send(err);
  }
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Что-то пошло не так!');
});
//тест
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'API is working!' });
});

// Подключение к MongoDB
const mongoURL = process.env.MONGO_URL;
mongoose
  .connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Успешное подключение к MongoDB'))
  .catch((error) => console.error('Ошибка подключения к MongoDB:', error));
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Сервер запущен на ${port} порту`);
});
