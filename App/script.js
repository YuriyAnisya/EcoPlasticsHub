// Product data
const products = [
    { id: 1, name: "Reusable Bag", price: 1.99, category: "plasticProducts", image: "images/reusableBag.png", description: "A reusable shopping bag made from 100% recycled materials." },
    { id: 2, name: "Ocean Waste Shoes", price: 47.99, category: "plasticProducts", image: "images/oceanWasteShoes.png", description: "Stylish and durable shoes crafted from recycled ocean waste materials, promoting sustainability and cleaner oceans." },
    { id: 3, name: "PET Pellets", price: 17.49, category: "pellets", image: "images/pelletsPET.png", description: "High-quality PET Pellets for sustainable manufacturing." },
    { id: 4, name: "Ocean Waste Bottle", price: 23.49, category: "plasticProducts", image: "images/oceanBottle.png", description: "A reusable water bottle made from reclaimed ocean plastic, designed to reduce waste and support eco-friendly habits." },
    { id: 5, name: "Plant Pot", price: 7.49, category: "plasticProducts", image: "images/plantPot.png", description: "A versatile plant pot made from recycled materials, perfect for indoor or outdoor gardening while supporting sustainable living." },
    { id: 6, name: "Eco Container", price: 3.99, category: "containers", image: "images/ecoContainer.png", description: "An eco-friendly storage container for food or supplies." },
    { id: 7, name: "Mix Pellets", price: 13.49, category: "pellets", image: "images/pelletsMix.png", description: "High-quality Mix Pellets for sustainable manufacturing." },
    { id: 8, name: "ABS Pellets", price: 15.99, category: "pellets", image: "images/pelletsABS.png", description: "High-quality ABS Pellets for sustainable manufacturing." },
    { id: 9, name: "4 Trash Cans, 6.75 Gal", price: 19.99, category: "containers", image: "images/trashCan.png", description: "A set of 4 compact 6.75-gallon trash cans made from recycled plastics, ideal for sorting and managing waste at home or in the office." },
    { id: 10, name: "LDPE Pellets", price: 13.99, category: "pellets", image: "images/pelletsLDPE.png", description: "High-quality LDPE Pellets for sustainable manufacturing." },
];

let cart = [];
let filteredProducts = [...products]; // To store the currently filtered products
let wishlist = []; // Holds wishlist items

// Function to display products
function displayProducts(productList = products) {
    const productListElement = document.getElementById('product-list');
    productListElement.innerHTML = ''; // Clear product list

    productList.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        // Check if the product is in the wishlist
        const isInWishlist = wishlist.some(item => item.id === product.id);

        productCard.innerHTML = `
            <img 
                src="${isInWishlist ? 'images/wishlistA.png' : 'images/wishlist.png'}"
                alt="Wishlist Icon" 
                class="wishlist-icon" 
                onclick="toggleWishlist(${product.id}, this)"
            >
            <img 
                src="${product.image}" 
                alt="${product.name}" 
                onclick="showProductDetails(${product.id})"
            >
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
            <img 
                src="images/infoIcon.png" 
                alt="Info" 
                class="info-icon" 
                onclick="showProductDetails(${product.id})"
            >
        `;
        productListElement.appendChild(productCard);
    });

}

// Toggle product in and out of wishlist
function toggleWishlist(productId, iconElement) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const isInWishlist = wishlist.some(item => item.id === productId);
    if (isInWishlist) {
        // Remove from wishlist
        wishlist = wishlist.filter(item => item.id !== productId);
        iconElement.src = 'images/wishlist.png'; // Default icon
        alert(`${product.name} removed from your wishlist!`);
    } else {
        // Add to wishlist
        wishlist.push(product);
        iconElement.src = 'images/wishlistA.png'; // Active icon
        alert(`${product.name} added to your wishlist!`);
    }

    updateWishlist(); // Update wishlist modal
}

// Add event listeners for the arrows to scroll the slider-container:
document.getElementById('left-arrow').addEventListener('click', () => {
    const sliderContainer = document.getElementById('product-list');
    sliderContainer.scrollBy({
        left: -250, // Adjust scroll distance as needed
        behavior: 'smooth', // Enable smooth scrolling
    });
});

document.getElementById('right-arrow').addEventListener('click', () => {
    const sliderContainer = document.getElementById('product-list');
    sliderContainer.scrollBy({
        left: 250, // Adjust scroll distance as needed
        behavior: 'smooth', // Enable smooth scrolling
    });
});
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);

    if (!product) {
        alert("Product not found!");
        return;
    }

    // Populate modal content
    document.getElementById('modal-title').textContent = product.name;
    document.getElementById('modal-image').src = product.image;
    document.getElementById('modal-description').textContent = product.description;
    document.getElementById('modal-price').textContent = `Price: $${product.price.toFixed(2)}`;

    // Show the modal
    document.getElementById('product-modal').style.display = 'block';
}

// Function to open a modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "block";
}
// Function to close a modal
function closeModal(modalId) {
    if (modalId) {
        document.getElementById(modalId).style.display = "none";
    } else {
        // Default to close product modal if no ID is provided
        document.getElementById('product-modal').style.display = "none";
    }
}
// Event listeners for sidebar links
document.querySelector('.sidebar').addEventListener('click', (event) => {
    if (event.target.closest('a')) {
        const targetId = event.target.closest('a').getAttribute('data-target');
        if (targetId) {
            event.preventDefault();
            openModal(targetId);
        }
    }
});
// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const modals = document.querySelectorAll('.modal');
    const checkoutModal = document.getElementById('checkout-modal');

    if (event.target === checkoutModal) {
        checkoutModal.style.display = 'block';
    } else {
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

});

// Function to filter products by category
function filterProducts(category) {
    if (category === 'all') {
        filteredProducts = [...products]; // Reset to all products
    } else {
        filteredProducts = products.filter(product => product.category === category);
    }
    displayProducts(filteredProducts);
}
// Event listener for search functionality
document.getElementById('search-bar').addEventListener('input', function (event) {
    const searchText = event.target.value.toLowerCase();
    const searchResults = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchText)
    );
    displayProducts(searchResults);
});

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity++; // Increase quantity if the item is already in the cart
    } else {
        cart.push({ ...product, quantity: 1 }); // Add new item to the cart
    }
    updateCart(); // Update cart UI and total
}
// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId); // Remove item by ID
    updateCart(); // Update UI
}
// Update cart UI and calculate total
function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    cartItemsContainer.innerHTML = ''; // Clear cart items

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-content">
                <span>${item.name} ($${item.price.toFixed(2)})</span>
            </div>
            <div class="cart-controls">
                <button onclick="changeQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
                <img src="images/removeB.png" alt="Remove" class="remove-icon" onclick="removeFromCart(${item.id})">
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    cartTotalElement.textContent = total.toFixed(2); // Update total price

    // Scroll to the bottom of the cart
    cartItemsContainer.scrollTop = cartItemsContainer.scrollHeight;
}
// Change item quantity
function changeQuantity(productId, delta) {
    const cartItem = cart.find(item => item.id === productId);
    if (!cartItem) return;

    cartItem.quantity += delta;

    if (cartItem.quantity <= 0) {
        removeFromCart(productId); // Remove item if quantity is zero or negative
    } else {
        updateCart(); // Update UI if quantity is valid
    }
}
// Checkout functionality
document.getElementById('checkout-button').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty! Please add items to checkout.');
        return;
    }

    // Generate receipt
    const receiptText = generateReceipt();

    document.getElementById('modal-receipt').textContent = receiptText;
    document.getElementById('checkout-modal').style.display = 'block';
    cart = []; // Clear the cart after checkout
    updateCart(); // Update UI
});
// Function to generate receipt text
function generateReceipt() {
    let receipt = "EcoPlastics Hub - Receipt\n";
    receipt += "--------------------------------------\n";
    receipt += `Date: ${new Date().toLocaleString()}\n\n`;
    receipt += "Items Purchased:\n";

    let total = 0;
    cart.forEach((item, index) => {
        receipt += `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`;
        total += item.price * item.quantity;
    });

    receipt += "\n--------------------------------------\n";
    receipt += `Total: $${total.toFixed(2)}\n\n`;
    receipt += "Thank you for shopping with us!\n";

    return receipt;
}
// Function to close the checkout modal
function closeCheckoutModal() {
    document.getElementById('checkout-modal').style.display = 'none';
}
// Function to download the receipt
function downloadReceipt() {
    const receiptText = document.getElementById('modal-receipt').textContent;
    const blob = new Blob([receiptText], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "receipt.txt";
    link.click();
}

// Add product to wishlist
function addToWishlist(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Check if the product is already in the wishlist
    if (wishlist.some(item => item.id === productId)) {
        alert(`${product.name} is already in your wishlist!`);
        return;
    }

    wishlist.push(product);
    updateWishlist(); // Update the wishlist modal
    alert(`${product.name} added to your wishlist!`);
}
// Remove product from wishlist
function removeFromWishlist(productId) {
    wishlist = wishlist.filter(item => item.id !== productId);

    // Update the product card icon in the main product list
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const productIdInCard = parseInt(card.querySelector('.wishlist-icon').getAttribute('onclick').match(/\d+/)[0], 10);
        if (productIdInCard === productId) {
            const iconElement = card.querySelector('.wishlist-icon');
            iconElement.src = 'images/wishlist.png'; // Default icon
        }
    });

    updateWishlist(); // Update wishlist modal
}
function updateWishlist() {
    const wishlistContainer = document.getElementById('wishlist-items');
    wishlistContainer.innerHTML = ''; // Clear previous items

    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = '<p>Your wishlist is empty!</p>';
        return;
    }

    wishlist.forEach(item => {
        const wishlistItem = document.createElement('div');
        wishlistItem.className = 'wishlist-item-card';
        wishlistItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="wishlist-item-image">
            <div class="wishlist-item-details">
                <h3>${item.name}</h3>
                <p>Price: $${item.price.toFixed(2)}</p>
                <button onclick="removeFromWishlist(${item.id})" class="wishlist-remove-btn">Remove</button>
            </div>
        `;
        wishlistContainer.appendChild(wishlistItem);
    });
}

// Analytics Modal
document.querySelector('[data-target="analytics-modal"]').addEventListener('click', function () {
    openAnalyticsModal();
});
function openAnalyticsModal() {
    const analyticsModal = document.getElementById('analytics-modal');
    analyticsModal.style.display = 'block';
    renderAnalyticsChart();
    renderAnalyticsPieChart();
}
function renderAnalyticsChart() {
    const ctx = document.getElementById('analytics-chart').getContext('2d');
    new Chart(ctx, {
        type: 'bar', // Use a bar chart
        data: {
            labels: ['1960', '1970', '1980', '1990', '2000', '2005', '2010', '2015', '2017', '2018'],
            datasets: [
                {
                    label: 'Recycling',
                    data: [5.61, 8.02, 14.52, 29.04, 53.01, 59.24, 65.26, 67.56, 66.98, 69.09],
                    backgroundColor: 'rgba(0, 6, 142, 0.8)', // bars
                    borderColor: 'rgba(0, 6, 142, 1)', // border
                    borderWidth: 1,
                },
                {
                    label: 'Composting',
                    data: [0, 0, 0, 4.2, 16.45, 20.55, 20.17, 23.39, 26.99, 24.89],
                    backgroundColor: 'rgba(166, 100, 0, 0.8)',
                    borderColor: 'rgba(166, 100, 0, 1)',
                    borderWidth: 1,
                },
                {
                    label: 'Combustion with Energy Recovery',
                    data: [0, 0.45, 2.76, 29.76, 33.73, 31.65, 29.31, 33.55, 34.22, 34.55],
                    backgroundColor: 'rgba(33, 150, 243, 0.7)',
                    borderColor: 'rgba(33, 150, 243, 1)',
                    borderWidth: 1,
                },
                {
                    label: 'Landfill',
                    data: [82.51, 112.59, 134.36, 145.27, 140.26, 142.29, 136.31, 137.61, 140.47, 146.12],
                    backgroundColor: 'rgba(162, 162, 162, 0.8)',
                    borderColor: 'rgba(162, 162, 162, 1)',
                    borderWidth: 1,
                },
                {
                    label: 'Other Food Management',
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 17.71],
                    backgroundColor: 'rgba(69, 69, 69, 0.8)',
                    borderColor: 'rgba(69, 69, 69, 1)',
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.dataset.label}: ${context.raw} Million Tons`;
                        },
                    },
                },
                title: {
                    display: true,
                    text: 'Municipal Solid Waste Management: 1960-2018',
                    font: {
                        size: 18,
                        weight: 'bold'
                    }
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Million Tons',
                    },
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year',
                    },
                },
            },
        },
    });
}
function renderAnalyticsPieChart() {
    const ctx = document.getElementById('analytics-chart-pie').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [
                'Paper and Paperboard',
                'Metals',
                'Rubber, Leather, and Textiles',
                'Plastics',
                'Glass',
                'Wood',
                'Other'
            ],
            datasets: [
                {
                    data: [66.54, 12.62, 6.05, 4.47, 4.43, 4.49, 1.40], // Data percentages from screenshot
                    backgroundColor: [
                        '#4CAF50', // Green (Paper)
                        '#FF5722', // Orange (Metals)
                        '#FFC107', // Yellow (Rubber, Leather, Textiles)
                        '#03A9F4', // Blue (Plastics)
                        '#9C27B0', // Purple (Glass)
                        '#8BC34A', // Light Green (Wood)
                        '#795548' // Brown (Other)
                    ],
                    borderWidth: 1,
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right', // Legend on the right side
                    labels: {
                        font: {
                            size: 12
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Total MSW Recycling by Material, 2018',
                    font: {
                        size: 18,
                        weight: 'bold'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return `${label}: ${value}%`;
                        }
                    }
                }
            }
        }
    });
}

// To toggle the accordion
document.querySelectorAll('.accordion-button').forEach(button => {
    button.addEventListener('click', () => {
        const content = button.nextElementSibling;
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
    });
});


// Appointments Modal
document.querySelector('[data-target="appointments-modal"]').addEventListener('click', function () {
    openAppointmentsModal();
});
function openAppointmentsModal() {
    const appointmentsModal = document.getElementById('appointments-modal');
    const appointmentsList = document.getElementById('appointments-list');
    const noAppointmentsMessage = document.getElementById('no-appointments-message');
    const scheduleButton = document.getElementById('schedule-appointment-button');

    // Clear previous content
    appointmentsList.innerHTML = '';

    // Retrieve appointments from local storage
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];

    if (appointments.length > 0) {
        noAppointmentsMessage.style.display = 'none';
        scheduleButton.style.display = 'none';

        appointments.forEach((appointment, index) => {
            const appointmentItem = document.createElement('div');
            appointmentItem.className = 'appointment-item';

            // Location Name at the Top
            const locationName = document.createElement('h3');
            locationName.textContent = appointment.location;
            locationName.className = 'appointment-location';

            // Image for Location
            const locationImage = document.createElement('img');
            locationImage.className = 'appointment-image';
            if (appointment.location === 'Titan Junk Removal') {
                locationImage.src = 'images/locationOne.png';
            } else if (appointment.location === 'Our Planet Recycling S.F.') {
                locationImage.src = 'images/locationTwo.png';
            } else if (appointment.location === 'Sunset Recycling Center') {
                locationImage.src = 'images/locationThree.png';
            } else {
                locationImage.src = 'images/logo.png'; // Default image
            }
            locationImage.alt = `${appointment.location} Image`;

            // Date and Time Details
            const appointmentDetails = document.createElement('div');
            appointmentDetails.className = 'appointment-details';
            appointmentDetails.innerHTML = `
                <p><strong>Date:</strong> ${appointment.date}</p>
                <p><strong>Time:</strong> ${appointment.time}</p>
            `;

            // Remove Button
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Cancel';
            removeButton.className = 'remove-button';
            removeButton.onclick = () => removeAppointment(index);

            // Append elements to the appointment item
            appointmentItem.appendChild(locationName); // Location name at the top
            appointmentItem.appendChild(locationImage);
            appointmentItem.appendChild(appointmentDetails);
            appointmentItem.appendChild(removeButton);

            // Add appointment item to the list
            appointmentsList.appendChild(appointmentItem);
        });
    } else {
        noAppointmentsMessage.style.display = 'block';
        scheduleButton.style.display = 'block';
    }

    appointmentsModal.style.display = 'block';
}
function navigateToRecycling() {
    closeModal('appointments-modal');
    document.getElementById('location-dropdown').scrollIntoView({ behavior: 'smooth' });
}
function removeAppointment(index) {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];

    // Remove the specific appointment
    appointments.splice(index, 1);

    // Save updated list back to local storage
    localStorage.setItem('appointments', JSON.stringify(appointments));

    // Refresh the modal content
    openAppointmentsModal();
}

// Open Wishlist Modal
document.querySelector('[data-target="wishlist-modal"]').addEventListener('click', () => {
    document.getElementById('wishlist-modal').style.display = 'block';
    updateWishlist(); // Populate the modal
});
// Close Wishlist Modal
function closeWishlistModal() {
    document.getElementById('wishlist-modal').style.display = 'none';
}

// Open and close settings modal
function openSettingsModal() {
    document.getElementById('settings-modal').style.display = 'block';
}
function closeSettingsModal() {
    document.getElementById('settings-modal').style.display = 'none';
}
// Set theme and save to localStorage
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}
// Apply saved theme on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
});

// Function to handle pickup scheduling  
document.getElementById('pickup-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const location = document.getElementById('location-dropdown').value;
    const date = document.getElementById('pickup-date').value;
    const time = document.getElementById('pickup-time').value;

    if (!location || !date || !time) {
        alert('Please fill in all fields!');
        return;
    }

    // Save appointment to local storage
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    appointments.push({ location, date, time });
    localStorage.setItem('appointments', JSON.stringify(appointments));

    alert('Appointment scheduled successfully!');
    document.getElementById('pickup-form').reset();
});
// Display drop-off locations  
function displayDropOffLocations() {
    const locationList = document.getElementById('drop-off-locations');
    dropOffLocations.forEach(location => {
        const listItem = document.createElement('li');
        listItem.textContent = `${location.name} - ${location.address}`;
        locationList.appendChild(listItem);
    });
}
// Initialize the map
document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map-container').setView([37.7464, -122.4358], 13); // Center map on a sample location

    // Add a tile layer (e.g., OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add markers for recycling centers
    const recyclingCenters = [
        { name: "Our Planet Recycling S.F.", coords: [37.7398, -122.4069] },
        { name: "Sunset Recycling Center", coords: [37.7298, -122.3988] },
        { name: "Titan Junk Removal", coords: [37.7429, -122.4762] },
    ];

    recyclingCenters.forEach(center => {
        L.marker(center.coords)
            .addTo(map)
            .bindPopup(`<b>${center.name}</b>`)
    });
});

// Initialize recycling assistance  
document.addEventListener('DOMContentLoaded', displayDropOffLocations);

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
});