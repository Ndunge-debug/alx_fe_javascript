let quotes = [];

// Simulated server-side quotes
const mockServerQuotes = [
  { text: "Stay hungry, stay foolish.", category: "Inspiration" },
  { text: "If you want to lift yourself up, lift up someone else.", category: "Motivation" },
  { text: "The secret of getting ahead is getting started.", category: "Success" }
];

// Load from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "Success is not in what you have, but who you are.", category: "Success" },
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

// Show random quote based on current filter
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

// Add new quote
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

// Create form dynamically
function createAddQuoteForm() {
  const form = document.getElementById('formContainer');

  const title = document.createElement('h3');
  title.textContent = 'Add a New Quote';
  form.appendChild(title);

  const input1 = document.createElement('input');
  input1.id = 'newQuoteText';
  input1.placeholder = 'Enter a new quote';
  form.appendChild(input1);

  const input2 = document.createElement('input');
  input2.id = 'newQuoteCategory';
  input2.placeholder = 'Enter quote category';
  form.appendChild(input2);

  const button = document.createElement('button');
  button.textContent = 'Add Quote';
  button.addEventListener('click', addQuote);
  form.appendChild(button);
}

// Populate filter dropdown
function populateCategories() {
  const select = document.getElementById('categoryFilter');
  const current = select.value;

  select.innerHTML = '<option value="all">All Categories</option>';
  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });

  const saved = localStorage.getItem("selectedCategory");
  select.value = saved || current;
  filterQuotes();
}

// Filter quotes
function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedCategory", selected);
  showRandomQuote();
}

// Export quotes to JSON
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) throw new Error("Invalid file");
      quotes.push(...imported);
      saveQuotes();
      populateCategories();
      alert("Quotes imported successfully!");
    } catch {
      alert("Invalid JSON format.");
    }
  };
  reader.readAsText(event.target.files[0]);
}

// Show sync banner
function showSyncNotification(message = "Quotes synced with server!") {
  const banner = document.getElementById('syncNotice');
  banner.textContent = `🔄 ${message}`;
  banner.style.display = 'block';
  setTimeout(() => {
    banner.style.display = 'none';
  }, 3000);
}

// Sync with mock server
function syncWithServer() {
  let newQuotes = 0;

  mockServerQuotes.forEach(serverQuote => {
    const exists = quotes.some(local =>
      local.text === serverQuote.text && local.category === serverQuote.category
    );
    if (!exists) {
      quotes.push(serverQuote);
      newQuotes++;
    }
  });

  if (newQuotes > 0) {
    saveQuotes();
    populateCategories();
    showSyncNotification(`${newQuotes} new quote(s) added from server.`);
  }
}

// Run sync every 30s
setInterval(syncWithServer, 30000);

// Event listeners
newQuoteBtn.addEventListener('click', showRandomQuote);
document.getElementById('exportBtn').addEventListener('click', exportToJsonFile);
document.getElementById('importFile').addEventListener('change', importFromJsonFile);

// Init
loadQuotes();
createAddQuoteForm();
populateCategories();

// Restore last quote
const last = sessionStorage.getItem("lastQuote");
if (last) quoteDisplay.innerHTML = last;
