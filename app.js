const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json());


// GET запрос для получения всех книг из бд
app.get('/books', (req, res) => {
    fs.readFile('books.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Ошибка сервера');
            return;
        }
        const books = JSON.parse(data);
        res.json(books);
    });
});

// GET запрос для получения книги по id
app.get('/books/:id', (req, res) => {
    const bookId = req.params.id;
    fs.readFile('books.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Ошибка сервера');
            return;
        }
        const books = JSON.parse(data);
        const book = books.find(b => b.id === bookId);
        if (!book) {
            res.status(404).send('Информация о книге не найдена');
            return;
        }
        res.json(book);
    });
});

// POST запрос для создания новой книги
app.post('/books', (req, res) => {
    const { id, title, author, year } = req.body;
    const post = {
        id,
        title,
        author,
        year
    };
    fs.readFile('books.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Ошибка сервера');
            return;
        }
        const books = JSON.parse(data);
        books.push(post);
        fs.writeFile('books.json', JSON.stringify(books), err => {
            if (err) {
                console.error(err);
                res.status(500).send('Ошибка сервера');
                return;
            }
            res.send('Новая книга успешно добавлена');
        });
    });
});

// PUT запрос для редактирования уже существующей книги по bookId
app.put('/books/:id', (req, res) => {
    const bookId = req.params.id;
    const updatedBook = req.body;
    fs.readFile('books.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Ошибка сервера');
            return;
        }
        const books = JSON.parse(data);
        const bookIndex = books.findIndex(b => b.id === bookId);
        if (bookIndex === -1) {
            res.status(404).send('Информация о книге не найдена');
            return;
        }
        books[bookIndex] = updatedBook;
        fs.writeFile('books.json', JSON.stringify(books), err => {
            if (err) {
                console.error(err);
                res.status(500).send('Ошибка сервера');
                return;
            }
            res.send('Информация о книге успешно обновлена');
        });
    });
});

// DELETE запрос для удаления книги по id
app.delete('/books/:id', (req, res) => {
    const bookId = req.params.id;
    fs.readFile('books.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Ошибка сервера');
            return;
        }
        const books = JSON.parse(data);
        const bookIndex = books.findIndex(b => b.id === bookId);
        if (bookIndex === -1) {
            res.status(404).send('Информация о книге не найдена');
            return;
        }
        books.splice(bookIndex, 1);
        fs.writeFile('books.json', JSON.stringify(books), err => {
            if (err) {
                console.error(err);
                res.status(500).send('Ошибка сервера');
                return;
            }
            res.send('Информация о книге успешно удалена');
        });
    });
});


app.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});