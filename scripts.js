// DOM Elements
const booksContainer = document.getElementById('booksContainer');
const addBookModal = document.getElementById('addBookModal');
const addBookBtn = document.getElementById('addBookBtn');
const cancelAddBook = document.getElementById('cancelAddBook');
const addBookForm = document.getElementById('addBookForm');
const bookDetailsModal = document.getElementById('bookDetailsModal');
const bookDetailsContent = document.getElementById('bookDetailsContent');
const closeBookDetails = document.getElementById('closeBookDetails');
const borrowReturnBtn = document.getElementById('borrowReturnBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const filterCategory = document.getElementById('filterCategory');
const filterStatus = document.getElementById('filterStatus');
const listViewBtn = document.getElementById('listViewBtn');
const gridViewBtn = document.getElementById('gridViewBtn');

// Display books
function displayBooks(booksToDisplay = books) {
    booksContainer.innerHTML = '';
    
    if (booksToDisplay.length === 0) {
        booksContainer.innerHTML = `
            <div class="col-span-full text-center p-8">
                <p class="text-xl text-gray-500">No books found matching your criteria.</p>
            </div>
        `;
        return;
    }
    
    booksToDisplay.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card bg-white rounded-lg shadow-md overflow-hidden';
        bookCard.innerHTML = `
            <img src="${book.coverImg}" alt="${book.title}" class="w-full h-64 object-cover">
            <div class="p-4">
                <h3 class="font-bold text-lg mb-1 truncate">${book.title}</h3>
                <p class="text-gray-600 mb-2">${book.author}</p>
                <div class="flex justify-between items-center">
                    <span class="text-sm ${book.status === 'Available' ? 'text-green-600' : 'text-yellow-600'}">
                        ${book.status}
                    </span>
                    <button class="view-details bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm" 
                        data-id="${book.id}">Details</button>
                </div>
            </div>
        `;
        booksContainer.appendChild(bookCard);
        
        // Add event listener to view details button
        const viewDetailsBtn = bookCard.querySelector('.view-details');
        viewDetailsBtn.addEventListener('click', () => showBookDetails(book.id));
    });
}

// Toggle grid/list view
function setGridView() {
    booksContainer.className = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6';
    gridViewBtn.className = 'bg-blue-500 text-white hover:bg-blue-600 px-3 py-1 rounded-r-lg';
    listViewBtn.className = 'bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-l-lg';
}

function setListView() {
    booksContainer.className = 'grid grid-cols-1 gap-4 mb-6';
    listViewBtn.className = 'bg-blue-500 text-white hover:bg-blue-600 px-3 py-1 rounded-l-lg';
    gridViewBtn.className = 'bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-r-lg';
    
    // Clear and redisplay books in list format
    booksContainer.innerHTML = '';
    
    const filteredBooks = filterBooks();
    
    if (filteredBooks.length === 0) {
        booksContainer.innerHTML = `
            <div class="text-center p-8">
                <p class="text-xl text-gray-500">No books found matching your criteria.</p>
            </div>
        `;
        return;
    }
    
    filteredBooks.forEach(book => {
        const bookRow = document.createElement('div');
        bookRow.className = 'book-card bg-white rounded-lg shadow-md p-4 flex';
        bookRow.innerHTML = `
            <img src="${book.coverImg}" alt="${book.title}" class="w-24 h-32 object-cover rounded mr-4">
            <div class="flex-grow">
                <div class="flex justify-between">
                    <h3 class="font-bold text-lg">${book.title}</h3>
                    <span class="px-2 py-1 rounded text-sm ${book.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                        ${book.status}
                    </span>
                </div>
                <p class="text-gray-600 mb-2">By ${book.author}</p>
                <p class="text-gray-500 text-sm mb-2">ISBN: ${book.isbn} • Category: ${book.category}</p>
                <div class="flex justify-end">
                    <button class="view-details bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm" 
                        data-id="${book.id}">View Details</button>
                </div>
            </div>
        `;
        booksContainer.appendChild(bookRow);
        
        // Add event listener to view details button
        const viewDetailsBtn = bookRow.querySelector('.view-details');
        viewDetailsBtn.addEventListener('click', () => showBookDetails(book.id));
    });
}

// Filter books based on search and filters
function filterBooks() {
    const searchTerm = searchInput.value.toLowerCase();
    const categoryFilter = filterCategory.value;
    const statusFilter = filterStatus.value;
    
    return books.filter(book => {
        const matchesSearch = 
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.isbn.includes(searchTerm);
            
        const matchesCategory = categoryFilter === '' || book.category === categoryFilter;
        const matchesStatus = statusFilter === '' || book.status === statusFilter;
        
        return matchesSearch && matchesCategory && matchesStatus;
    });
}

// Show book details
function showBookDetails(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    bookDetailsContent.innerHTML = `
        <div class="flex">
            <img src="${book.coverImg}" alt="${book.title}" class="w-32 h-48 object-cover rounded mr-6">
            <div>
                <h2 class="text-2xl font-bold mb-2">${book.title}</h2>
                <p class="text-gray-700 mb-1"><span class="font-semibold">Author:</span> ${book.author}</p>
                <p class="text-gray-700 mb-1"><span class="font-semibold">ISBN:</span> ${book.isbn}</p>
                <p class="text-gray-700 mb-1"><span class="font-semibold">Category:</span> ${book.category}</p>
                <p class="text-gray-700 mb-1"><span class="font-semibold">Published Year:</span> ${book.publishedYear}</p>
                <p class="text-gray-700 mb-3">
                    <span class="font-semibold">Status:</span> 
                    <span class="${book.status === 'Available' ? 'text-green-600' : 'text-yellow-600'}">${book.status}</span>
                </p>
                ${book.status === 'Borrowed' ? 
                    `<div class="bg-yellow-50 border border-yellow-200 p-2 rounded">
                        <p class="text-gray-700 mb-1"><span class="font-semibold">Borrowed by:</span> ${book.borrower}</p>
                        <p class="text-gray-700"><span class="font-semibold">Due Date:</span> ${book.dueDate}</p>
                    </div>` 
                    : ''}
            </div>
        </div>
        <div class="mt-4">
            <h3 class="font-semibold text-lg mb-2">Description</h3>
            <p class="text-gray-700">${book.description}</p>
        </div>
    `;
    
    // Update borrow/return button
    borrowReturnBtn.textContent = book.status === 'Available' ? 'Borrow' : 'Return';
    borrowReturnBtn.className = book.status === 'Available' ? 
        'bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded' : 
        'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded';
    
    bookDetailsModal.classList.remove('hidden');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    displayBooks();
    
    // Add book button
    addBookBtn.addEventListener('click', () => {
        addBookModal.classList.remove('hidden');
    });
    
    // Cancel add book
    cancelAddBook.addEventListener('click', () => {
        addBookModal.classList.add('hidden');
        addBookForm.reset();
    });
    
    // Add book submission
    addBookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newBook = {
            id: books.length + 1,
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            isbn: document.getElementById('isbn').value,
            category: document.getElementById('category').value,
            status: 'Available',
            publishedYear: new Date().getFullYear(),
            description: "No description available.",
            coverImg: "/api/placeholder/150/220"
        };
        
        books.unshift(newBook);
        displayBooks();
        addBookModal.classList.add('hidden');
        addBookForm.reset();
    });
    
    // Close book details
    closeBookDetails.addEventListener('click', () => {
        bookDetailsModal.classList.add('hidden');
    });
    
    // Search functionality
    searchBtn.addEventListener('click', () => {
        const filteredBooks = filterBooks();
        displayBooks(filteredBooks);
    });
    
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            const filteredBooks = filterBooks();
            displayBooks(filteredBooks);
        }
    });
    
    // Filter change
    filterCategory.addEventListener('change', () => {
        const filteredBooks = filterBooks();
        displayBooks(filteredBooks);
    });
    
    filterStatus.addEventListener('change', () => {
        const filteredBooks = filterBooks();
        displayBooks(filteredBooks);
    });
    
    // View toggle
    listViewBtn.addEventListener('click', setListView);
    gridViewBtn.addEventListener('click', setGridView);
    
    // Borrow/Return functionality
    borrowReturnBtn.addEventListener('click', () => {
        const bookTitle = bookDetailsContent.querySelector('h2').textContent;
        const book = books.find(b => b.title === bookTitle);
        
        if (book) {
            if (book.status === 'Available') {
                book.status = 'Borrowed';
                book.borrower = 'Current User';
                
                const now = new Date();
                const dueDate = new Date();
                dueDate.setDate(now.getDate() + 14); // 2 weeks from now
                book.dueDate = dueDate.toISOString().split('T')[0];
            } else {
                book.status = 'Available';
                delete book.borrower;
                delete book.dueDate;
            }
            
            bookDetailsModal.classList.add('hidden');
            displayBooks(filterBooks());
        }
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === addBookModal) {
            addBookModal.classList.add('hidden');
            addBookForm.reset();
        }
        
        if (e.target === bookDetailsModal) {
            bookDetailsModal.classList.add('hidden');
        }
    });
});