document.addEventListener("DOMContentLoaded", () => {  
    loadBooks();  
    document.getElementById("saveBook").addEventListener("click", saveBook); 
    document.getElementById("searchBar").addEventListener("input", searchBooks);
    
    //Reset modal when closed
    const bookModal = document.getElementById("bookModal");  
    bookModal.addEventListener('hidden.bs.modal', clearModal);
});  

let books = [];  

function loadBooks() {  
    const storedBooks = JSON.parse(localStorage.getItem('books')) || [];  
    books = storedBooks;  

    displayBooks(books, 'all-books');  
    displayBooks(books.filter(book => book.favorite), 'favorites');  
    displayBooks(books.filter(book => book.status === 'Unread'), 'unread');  
    displayBooks(books.filter(book => book.status === 'Read'), 'read');  
}  

function displayBooks(books, tab) {  
    const grid = document.getElementById(tab + 'Grid');  
    grid.innerHTML = ''; // Clear previous content  

    // Add heading for the section  
    const heading = document.createElement('h4');  
    heading.className = 'mb-4';  
    heading.textContent = `${tab.charAt(0).toUpperCase() + tab.slice(1)} Books`;  
    grid.appendChild(heading);  

    if (books.length === 0) {  
        const noBooksMessage = document.createElement('p');  
        noBooksMessage.className = 'text-muted';  
        noBooksMessage.textContent = 'No books available.';  
        grid.appendChild(noBooksMessage);  
        return;  
    }  

    books.forEach(book => {  
        const card = document.createElement('div');  
        card.classList.add('col-md-4', 'mb-4');  
        card.innerHTML = `  
            <div class="card">  
                <img src="${book.image}" class="card-img-top" alt="${book.title}">  
                <div class="card-body">  
                    <h5 class="card-title">${book.title}</h5>  
                    <p class="card-text">Author: ${book.author}</p>  
                    <p class="card-text">Status: ${book.status}</p>  
                    <div class="btn-group-vertical">  
                        <button class="btn btn-warning favorite-btn" onclick="toggleFavorite('${book.id}')">  
                            ${book.favorite ? '★' : '☆'}  
                        </button>  
                        <button class="btn btn-primary edit-btn" onclick="editBook('${book.id}')">Edit</button>  
                        <button class="btn btn-danger delete-btn" onclick="deleteBook('${book.id}')">Delete</button>  
                    </div>  
                </div>  
            </div>  
        `;  
        grid.appendChild(card);  
    });  
}  

function saveBook() {  
    const id = document.getElementById("bookId").value;  
    const title = document.getElementById("bookTitle").value.trim();  
    const author = document.getElementById("bookAuthor").value.trim();  
    const genre = document.getElementById("bookGenre").value.trim();  
    const status = document.getElementById("bookStatus").value;  
    const imageInput = document.getElementById("bookImage").files[0];  

    if (!title || !author || !genre || !status) {  
        alert('Please fill in all required fields!');  
        return;  
    }  

    const reader = new FileReader();  
    reader.onloadend = function() {  
        const imageBase64 = reader.result;  

        const book = {  
            id: id || generateId(),  
            title,  
            author,  
            genre,  
            status,  
            favorite: false,  
            image: imageBase64 
        };  

        if (id) {  
            const index = books.findIndex(b => b.id === id);  
            books[index] = book;  
        } else {  
            books.push(book);  
        }  

        localStorage.setItem('books', JSON.stringify(books));  
        loadBooks();  
        clearModal();  
    };  
    reader.readAsDataURL(imageInput);  
}  

function editBook(id) {  
    const book = books.find(b => b.id === id);  
    if (book) {  
        document.getElementById("bookId").value = book.id;  
        document.getElementById("bookTitle").value = book.title;  
        document.getElementById("bookAuthor").value = book.author;  
        document.getElementById("bookGenre").value = book.genre;  
        document.getElementById("bookStatus").value = book.status;  
        document.getElementById("modalLabel").innerText = "Edit Book";  
        const bookModal = new bootstrap.Modal(document.getElementById("bookModal"));  
        bookModal.show();  
    }  
}  

function deleteBook(id) {  
    if (confirm("Are you sure you want to delete this book?")) {  
        books = books.filter(b => b.id !== id);  
        localStorage.setItem('books', JSON.stringify(books));  
        loadBooks();  
    }  
}  

function toggleFavorite(id) {  
    const book = books.find(b => b.id === id);  
    if (book) {  
        book.favorite = !book.favorite;  
        localStorage.setItem('books', JSON.stringify(books));  
        loadBooks();  
    }  
}  

function searchBooks() {  
    const query = document.getElementById("searchBar").value.toLowerCase();  
    const filteredBooks = books.filter(book =>   
        book.title.toLowerCase().includes(query) ||   
        book.author.toLowerCase().includes(query)  
    );  
    displayBooks(filteredBooks, 'all-books');  // Update all-books tab  
}  

function clearModal() {  
    document.getElementById("bookForm").reset();  
    document.getElementById("bookId").value = '';  
    document.getElementById("modalLabel").innerText = "Add Book";  
}  

function generateId() {  
    return Date.now().toString(36) + Math.random().toString(36).substring(2);  
}  


// Hiding and showing the sidebar.  
function showSidebar(){  
    const sidebar = document.querySelector('.sidebar')  
    sidebar.style.display='flex'  
}  

function hideSidebar(){  
    const sidebar = document.querySelector('.sidebar')  
    sidebar.style.display='none'  
}  

