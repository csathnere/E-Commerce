document.addEventListener('DOMContentLoaded', () => {
    const vegetablesContainer = document.getElementById('vegetables-container');

    fetch('assets/data/data.json')
        .then(response => response.json())
        .then(vegetables => {
            // vegetable data and create HTML elements
            vegetables.forEach(vegetable => {
                const vegetableElement = document.createElement('div');
                vegetableElement.classList.add('col-sm-3');
                vegetableElement.classList.add('vegetableElement');
                vegetableElement.innerHTML = ` <div class="product">                  
                    <img class="shop-item-image" src="assets/data/products/${vegetable.img_src}" alt="${vegetable.name}" style="max-width: 200px;"/>
                    <p class="shop-item-title">${vegetable.name} ${vegetable.quantity}</p>
                    <p class="shop-item-price"><b>MRP:</b> ₹${vegetable.price.toFixed(2)}</p>
                    <p>Discount: ${vegetable.discount * 100}%</p> </div>
                    <button class='btn btn-primary shop-item-button'>Add to Cart</button>
                `;           
                vegetablesContainer.appendChild(vegetableElement);

                // dkfk?
                var addToCartButtons = document.getElementsByClassName('shop-item-button')
                for (var i = 0; i < addToCartButtons.length; i++) {
                var button = addToCartButtons[i]
                button.addEventListener('click', addToCartClicked)
    }




            });
        })
        .catch(error => console.error('Error fetching vegetable data:', error));
});



function toggleVisibility() {
    // Get the reference to the element
    var elementToToggle = document.getElementById('cartItem');

    // Toggle the 'hidden' class using classList
    elementToToggle.classList.toggle('hidden');
  }



  // djkfj


  if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    var removeCartItemButtons = document.getElementsByClassName('btn-danger')
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}

function purchaseClicked() {
    alert('Thank you for your purchase')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
    }
    updateCartTotal()
}

function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}


function addToCartClicked(event) {
  var button = event.target;
  var shopItem = button.parentElement;
  var title = shopItem.querySelector('.shop-item-title').innerText;
  var price = shopItem.querySelector('.shop-item-price').innerText;
  var imageSrc = shopItem.querySelector('.shop-item-image').src;

  addItemToCart(title, price, imageSrc)
  updateCartTotal()
  
  console.log("Title:", title);
  console.log("Price:", price);
  console.log("Image Source:", imageSrc);
}


// Save cart items to local storage
function saveCartToLocalStorage() {
    var cartItems = document.getElementsByClassName('cart-items')[0];
    var cartRows = cartItems.getElementsByClassName('cart-row');

    // Create an array to store the cart items
    var cart = [];

    // Iterate through each cart row and extract information
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i];
        var title = cartRow.getElementsByClassName('cart-item-title')[0].innerText;
        var price = cartRow.getElementsByClassName('cart-price')[0].innerText;
        var imageSrc = cartRow.getElementsByClassName('cart-item-image')[0].src;
        var quantity = cartRow.getElementsByClassName('cart-quantity-input')[0].value;

        // Add the item to the cart array
        cart.push({
            title: title,
            price: price,
            imageSrc: imageSrc,
            quantity: quantity
        });
    }

    // Save the cart array to local storage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Fetch cart items from local storage
function fetchCartFromLocalStorage() {
    var cartItems = document.getElementsByClassName('cart-items')[0];

    // Check if there are items in local storage
    if (localStorage.getItem('cart')) {
        // Parse the stored JSON string and retrieve the cart array
        var cart = JSON.parse(localStorage.getItem('cart'));

        // Iterate through the cart array and add items to the cart
        cart.forEach(function (item) {
            addItemToCart(item.title, item.price, item.imageSrc, item.quantity);
        });
    }
}

// Add item to cart with an optional quantity parameter
function addItemToCart(title, price, imageSrc, quantity = 1) {
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('This item is already added to the cart')
            return
        }
    }
    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="${quantity}">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)

    // Save the updated cart to local storage
    saveCartToLocalStorage();
}

// Call fetchCartFromLocalStorage when your page loads
fetchCartFromLocalStorage();
var totalCartItems=0
// Your existing code for updateCartTotal remains the same
function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    totalCartItems=cartRows.length 
    document.getElementById("current_cart_value").innerHTML= totalCartItems  
    for (var i = 0; i < cartRows.length; i++) {        
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        var quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = '₹' + total
}

