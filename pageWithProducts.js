'use strict';

let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartDOM = document.querySelector('.cart');
const addToCartButtonsDOM = document.querySelectorAll('[data-action="ADD_TO_CART"]');

if (cart.length > 0) {
  cart.forEach(cartItem => {
    const product = cartItem;
    insertItemToDOM(product);
    countCartTotal();

    addToCartButtonsDOM.forEach(addToCartButtonDOM => {
      const productDOM = addToCartButtonDOM.parentNode;

      if (productDOM.querySelector('.product__name').innerText === product.name) {
        handleActionButtons(addToCartButtonDOM, product);
      }
    });
  });
}

addToCartButtonsDOM.forEach(addToCartButtonDOM => {
  addToCartButtonDOM.addEventListener('click', () => {
    const productDOM = addToCartButtonDOM.parentNode;
    const product = {
      image: productDOM.querySelector('.product__image').getAttribute('src'),
      name: productDOM.querySelector('.product__name').innerText,
      price: productDOM.querySelector('.product__price').innerText,
      quantity: 1
    };

    const isInCart = cart.filter(cartItem => cartItem.name === product.name).length > 0;

    if (!isInCart) {
      insertItemToDOM(product);
      cart.push(product);
      saveCart();
      handleActionButtons(addToCartButtonDOM, product);
    }
  });
});

function insertItemToDOM(product) {
  cartDOM.insertAdjacentHTML(
    'beforeend',
    `
    <div class="cart__item shadow">
      <img class="cart__item__image" src="${product.image}" alt="${product.name}">
      <h3 class="cart__item__name">${product.name}</h3>
      <h3 class="cart__item__price">${product.price}</h3>
      <button class="btn btn-dark shadow ${product.quantity === 1 ? ' btn--danger' : ''}" data-action="DECREASE_ITEM">&minus;</button>
      <h3 class="cart__item__quantity">${product.quantity}</h3>
      

      <button class="btn btn-dark shadow" data-action="INCREASE_ITEM">&plus;</button>
      <button class="btn btn-dark shadow" data-action="REMOVE_ITEM">&times;</button>
    </div>
  `
  
  );
  addCartFooter();
}

function handleActionButtons(addToCartButtonDOM, product) {
  addToCartButtonDOM.innerText = 'In Cart';
  addToCartButtonDOM.disabled = true;

  const cartItemsDOM = cartDOM.querySelectorAll('.cart__item');
  cartItemsDOM.forEach(cartItemDOM => {
    if (cartItemDOM.querySelector('.cart__item__name').innerText === product.name) {
      cartItemDOM.querySelector('[data-action="INCREASE_ITEM"]').addEventListener('click', () => increaseItem(product, cartItemDOM));
      cartItemDOM.querySelector('[data-action="DECREASE_ITEM"]').addEventListener('click', () => decreaseItem(product, cartItemDOM, addToCartButtonDOM));
      cartItemDOM.querySelector('[data-action="REMOVE_ITEM"]').addEventListener('click', () => removeItem(product, cartItemDOM, addToCartButtonDOM));
    }
  });
}

function increaseItem(product, cartItemDOM) {
  cart.forEach(cartItem => {
    if (cartItem.name === product.name) {
      cartItemDOM.querySelector('.cart__item__quantity').innerText = ++cartItem.quantity;
      cartItemDOM.querySelector('[data-action="DECREASE_ITEM"]').classList.remove('btn--danger');
      saveCart();
    }
  });
}

function decreaseItem(product, cartItemDOM, addToCartButtonDOM) {
  cart.forEach(cartItem => {
    if (cartItem.name === product.name) {
      if (cartItem.quantity > 1) {
        cartItemDOM.querySelector('.cart__item__quantity').innerText = --cartItem.quantity;
        saveCart();
      } else {
        removeItem(product, cartItemDOM, addToCartButtonDOM);
      }

      if (cartItem.quantity === 1) {
        cartItemDOM.querySelector('[data-action="DECREASE_ITEM"]').classList.add('btn--danger');
      }
    }
  });
}

function removeItem(product, cartItemDOM, addToCartButtonDOM) {
  cartItemDOM.classList.add('cart__item--removed');
  setTimeout(() => cartItemDOM.remove(), 250);
  cart = cart.filter(cartItem => cartItem.name !== product.name);
  saveCart();
  addToCartButtonDOM.innerText = 'Add To Cart';
  addToCartButtonDOM.disabled = false;

  if (cart.length < 1) {
    document.querySelector('.cart-footer').remove();
  }
}

function addCartFooter() {
  if (document.querySelector('.cart-footer') === null) {
    cartDOM.insertAdjacentHTML(
      'afterend',
      `
      <div class="cart-footer">
        <button class="btn  btn-dark shadow" data-action="CLEAR_CART">Clear Cart</button>
        <button class="btn btn--primary sad" style=" display: none;" data-action="CHECKOUT">Pay</button>
       <a href="otherPage.html" class="btn  btn-dark shadow" > CHECKOUT  </a>

      </div>
    `
    );

    document.querySelector('[data-action="CLEAR_CART"]').addEventListener('click', () => clearCart());
    document.querySelector('[data-action="CHECKOUT"]').addEventListener('click', () => checkout());
  }
}

function clearCart() {
  cartDOM.querySelectorAll('.cart__item').forEach(cartItemDOM => {
    cartItemDOM.classList.add('cart__item--removed');
    setTimeout(() => cartItemDOM.remove(), 250);
  });

  cart = [];
  localStorage.removeItem('cart');
  document.querySelector('.cart-footer').remove();

  addToCartButtonsDOM.forEach(addToCartButtonDOM => {
    addToCartButtonDOM.innerText = 'Add To Cart';
    addToCartButtonDOM.disabled = false;
  });
}

function checkout() {
  let ykformHTML = `
    <form id="ykform" action="https://formcarry.com/s/ciFdK-rIp01" method="post">
      <input type="hidden" name="cmd" value="_cart">
      <input type="hidden" name="upload" value="1">
      <input type="hidden" name="business" value="adrian@webdev.tube">
  `;

  cart.forEach((cartItem, index) => {
    ++index;
    ykformHTML += `
      <input type="hidden" name="item_name_${index}" value="${cartItem.name}">
      <input type="hidden" name="amount_${index}" value="${cartItem.price}">
      <input type="hidden" name="quantity_${index}" value="${cartItem.quantity}">
    `;
  });

  ykformHTML += `
      <input type="submit" value="Submit">
    </form>
    <div class="overlay"></div>
  `;

  document.querySelector('body').insertAdjacentHTML('beforeend', ykformHTML);
  document.getElementById('ykform').submit();
}

function countCartTotal() {
  let cartTotal = 0;
  cart.forEach(cartItem => (cartTotal += cartItem.quantity * cartItem.price));
  document.querySelector('[data-action="CHECKOUT"]').innerText = `Pay ₦${cartTotal}`;
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  countCartTotal();
};

var  cartIcon =  document.querySelector("#cart");
var  CloseCart =  document.querySelector("#cart-close");

var mad = document.querySelector(".mad");
var ok = document.querySelector(".ok")
var o = document.querySelector(".o")
cartIcon.onclick = () => {
  mad.classList.add("active");
  ok.classList.add("active");
  o.classList.add("active");
  
};

CloseCart.onclick = () => {
  mad.classList.remove("active");
  ok.classList.remove("active");
  o.classList.remove("active");  
};

var Details = document.querySelectorAll(".details");



function details(id){
  Details[id].classList.add("active");
};

function seeLess(id){
  Details[id].classList.remove("active");
};