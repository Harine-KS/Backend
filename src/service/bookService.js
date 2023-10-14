const { Book } = require('../modals/booksSchema')

async function postbook(req, res) {
    try {
        const userId = req.token.userId;
        const { title, author, genre, publicationYear, ISBN } = req.body;
        const addbooks = new Book({ title, author, genre, publicationYear, ISBN, userId })
        const savedBook = await addbooks.save();
        res.status(200).json(savedBook);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });   
    }
}
async function getById(req, res) {
    try {
        let book = await Book.findById(req.params.id)
        if (book) {
            res.status(200).json(book);
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
async function getAllBooksById(req, res) {
    try {
        const author = await Book.find({ userId: req.token.userId })
        if (!author) {
            return res.status(404).json({ error: 'Author not found' });
        }
        res.status(200).json(author);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
async function getAllBooks(req, res) {
    try {
        let getAllBooks = await Book.find();
        if (getAllBooks) {
            res.status(200).json(getAllBooks);
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
async function updateById(req, res) {
    try {
        let updateBook = await Book.findById(req.params.id)
        if (updateBook) {
            const { title, author, genre, publicationYear, ISBN, description } = req.body;
            let update = await Book.findByIdAndUpdate(req.params.id, { title, author, genre, publicationYear, ISBN, description }, { new: true })
            res.status(200).json(update);
        }
    } catch (error) {
        return res.status(404).send('access denied');
    }
}
async function DeleteById(req, res) {
    try {
        let deleteBook = await Book.findById(req.params.id)
        if (deleteBook) {  
            let deleteBooks = await Book.findByIdAndRemove(req.params.id)
            if (deleteBooks) {
                res.status(200).json("Deleted Successfully");
            }
        }
    } catch (error) {
        res.status(201).json(error.message);
        
    }
}

module.exports = { postbook, getById, getAllBooks, updateById, DeleteById, getAllBooksById }