document.addEventListener("DOMContentLoaded", function () {
  var productsContainer = document.getElementById("products");
  var productListContainer = document.querySelector(".product-list");
  var costListContainer = document.querySelector(".product-list1");
  var totalContainer = document.querySelector(".total");
  var stockInfoContainer = document.getElementById("stock");
  var totalAmount = 0;

  // User can add the card product informations
  var products = [
    { name: "Coffee Tables", price: "₹ 4,000", stock: 10 },
    { name: "TV", price: "₹ 8,000", stock: 5 },
    { name: "AC", price: "₹ 10,000", stock: 8 },
    { name: "Bed", price: "₹ 70,000", stock: 7 },
    { name: "Fan", price: "₹ 13,000", stock: 12 },
    { name: "Cobord", price: "₹ 40,00,000", stock: 5 },
    { name: "Cooker", price: "₹ 2,500", stock: 20 },
    { name: "Dressing Table", price: "₹ 97,000", stock: 6 },
  ];

  function addToCart(productName, productPrice) {
    var productItem = document.createElement("div");
    productItem.classList.add("product-row"); // Add class to identify product row
    productItem.textContent = productName;

    productListContainer.appendChild(productItem);

    var costItem = document.createElement("div");

    var cleanedPrice = parseFloat(productPrice.replace(/[^\d.]/g, ""));
    costItem.textContent = "₹ " + cleanedPrice.toLocaleString();

    totalAmount += cleanedPrice;

    totalContainer.textContent = "₹ " + totalAmount.toLocaleString();

    costListContainer.appendChild(costItem);

    // Decrement stock count
    var product = products.find((item) => item.name === productName);
    if (product && product.stock > 0) {
      product.stock--;
      displayStock();
    } else {
      alert("Sorry, this item is out of stock!");
      // If stock is 0, do not proceed further
      productItem.remove();
      costItem.remove();
      totalAmount -= cleanedPrice;
      totalContainer.textContent = "₹ " + totalAmount.toLocaleString();
      return;
    }

    // Add delete icon
    var deleteIcon = document.createElement("span");
    deleteIcon.classList.add("material-symbols-outlined", "delete-icon");
    deleteIcon.textContent = "delete";
    deleteIcon.style.cursor = "pointer";
    deleteIcon.style.height = "22px";
    deleteIcon.style.width = "20px";

    productItem.appendChild(deleteIcon);
    // Add click event listener to delete icon
    deleteIcon.addEventListener("click", function () {
      removeFromCart(productName, cleanedPrice, productItem, costItem);
    });
  }

  function removeFromCart(productName, productPrice, productItem, costItem) {
    // Remove product row from cart
    productItem.remove();

    // Remove cost from total
    totalAmount -= productPrice;
    totalContainer.textContent = "₹ " + totalAmount.toLocaleString();

    // Increment stock count
    var product = products.find((item) => item.name === productName);
    if (product) {
      product.stock++;
      displayStock();
    }

    // Remove cost item from cost list
    costItem.remove();
  }

  // designation box stock item details
  function displayStock() {
    stockInfoContainer.innerHTML = ""; // Clear existing content

    products.forEach((product) => {
      var stockInfo = document.createElement("div");
      stockInfo.textContent =
        product.name + ": " + product.stock + " available";

      // when stock is less than 5 then (low-stoock) blink a red dot
      if (product.stock < 5) {
        stockInfo.classList.add("low-stock");
      }

      stockInfoContainer.appendChild(stockInfo);
    });
  }

  // Initial display of stock information
  displayStock();

  // HTML code for creating new product cards
  products.forEach((product) => {
    var productCard =
      '<div class="card">' +
      '<div class="product-name">' +
      '<div class="name">' +
      product.name +
      "</div>" +
      '<div class="price">' +
      product.price +
      "</div>" +
      "</div>" +
      "<div>" +
      '<div class="add_cart"> Add to Cart</div>' +
      "</div>" +
      "</div>";

    // Insert the product card HTML into the #products div
    productsContainer.insertAdjacentHTML("beforeend", productCard);
  });

  // Add event listener for "Add to Cart" buttons
  document.querySelectorAll(".add_cart").forEach(function (button) {
    button.addEventListener("click", function () {
      var productName =
        this.closest(".card").querySelector(".name").textContent;
      var productPrice =
        this.closest(".card").querySelector(".price").textContent;

      addToCart(productName, productPrice);
    });
  });

  // Function to filter products based on search input
  function filterProducts() {
    var searchBoxValue = document
      .getElementById("searchBox")
      .value.toLowerCase();

    document
      .querySelectorAll(".product-name")
      .forEach(function (productNameElement) {
        var productName = productNameElement.textContent.toLowerCase();
        var productCard = productNameElement.closest(".card");

        if (productName.includes(searchBoxValue)) {
          productCard.style.display = "flex";
        } else {
          productCard.style.display = "none";
        }
      });
  }

  document
    .getElementById("searchBox")
    .addEventListener("input", filterProducts);
});
