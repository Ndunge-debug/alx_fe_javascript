let quotes = [];

// Simulated server-side quotes
const mockServerQuotes = [
  { text: "Stay hungry, stay foolish.", category: "Inspiration" },
  { text: "If you want to lift yourself up, lift up someone else.", category: "Motivation" },
  { text: "The secret of getting ahead is getting started.", category: "Success" }
];

// Load quotes from localStorage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "Success is not in what you have, but who you are.", category: "Success" }
    ];
    saveQuotes();
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Save last shown quote to sessionStorage
function saveLastQuote(quoteHTML) {
  sessionStorage.setItem("lastQuote", quoteHTML);
}

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const categoryFilter = document.getElementById('categoryFilter');

// Show a random quote
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  const filtered = selectedCategory === 'all'
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

  if (filtered.length === 0) {
    quoteDisplay.innerHTML = "<em>No quotes available for this category.</em>";
    return;
  }

  const random = filtered[Math.floor(Math.random() * filtered.length)];
  const quoteHTML = `<p>"${random.text}"</p><small>— ${random.category}</small>`;
  quoteDisplay.innerHTML = quoteHTML;
  saveLastQuote(quoteHTML);
}

// Add a new quote
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();
  if (!text || !category) {
    alert("Please fill in both fields.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();

  document.getElementById('newQuoteText').value = "";
  document.getElementById('newQuoteCategory').value = "";

  alert("Quote added successfully!");
}

// Create the add quote form
function createAddQuoteForm() {
  const form = document.getElementById('formContainer');

  const title = document.createElement('h3');
  title.textContent = 'Add a New Quote';
  form.appendChild(title);

  const input1 = document.createElement('input');
  input1.id
