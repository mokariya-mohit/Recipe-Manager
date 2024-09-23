const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err.name === 'ValidationError') {
        // Handle validation errors
        return res.status(400).json({ message: err.message });
    }

    if (err.name === 'CastError') {
        // Handle invalid ObjectId errors
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    if (err.code && err.code === 11000) {
        // Handle duplicate key errors
        return res.status(400).json({ message: 'Duplicate key error' });
    }

    // Handle general server errors
    res.status(500).json({ message: 'Server error' });
};

module.exports = errorHandler;
