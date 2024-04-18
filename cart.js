document.addEventListener("DOMContentLoaded", function () {
  var productsContainer = document.getElementById("products");
  var tableBody = document.querySelector(".table-container .body");
  var totalPriceDisplay = document.querySelector(".total");

  var products = [
    { name: "AC", price: 10000, stock: 7 },
    { name: "Bed", price: 70000, stock: 9 },
    { name: "Fan", price: 13000, stock: 10 },
    { name: "Cobord", price: 4000000, stock: 12 },
    { name: "Micro Oven", price: 40000, stock: 8 },
    { name: "Fridge", price: 50000, stock: 5 },
    { name: "Coffee Tables", price: 4000, stock: 10 },
    { name: "TV", price: 8000, stock: 6 },
  ];

  function generateProductCard(product) {
    var stockClass = product.stock < 5 ? "blink-red" : "";
    var buttonText = product.stock > 0 ? "Add to Cart" : "Out of Stock";
    var buttonStyle =
      product.stock > 0
        ? "background-color: #ffff; color: #3458D0;"
        : "background-color: #fafafa; color: red;";
    return `<div class="card">
                    <div class="product-name">
                        <div class="name" data-name="${
                          product.name
                        }">${product.name}</div>
                        <div class="price">₹ ${product.price.toLocaleString()}</div>
                        <div class="stock-info ${stockClass}">Stock only <span class="num">${product.stock}</span> items</div>
                    </div>
                    <div>
                        <div class="add_cart" style="${buttonStyle}">${buttonText}</div>
                    </div>
                </div>`;
  }

  products.forEach(function (product) {
    var productCard = generateProductCard(product);
    productsContainer.insertAdjacentHTML("beforeend", productCard);
  });

  var totalPrice = 0;

  productsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("add_cart")) {
      var productCard = event.target.closest(".card");
      var productName = productCard.querySelector(
        ".product-name .name"
      ).textContent;
      var productPrice = parseInt(
        productCard
          .querySelector(".product-name .price")
          .textContent.replace(/[^0-9]/g, "")
      );
      var productIndex = Array.from(
        productsContainer.querySelectorAll(".card")
      ).indexOf(productCard);

      if (products[productIndex].stock > 0) {
        products[productIndex].stock--; // Decrementing the stock
        updateStock(productCard, products[productIndex].stock); // Update the displayed stock
        updateCart(productName, productPrice); // Add the product to the cart
        totalPrice += productPrice;
        totalPriceDisplay.textContent = "₹ " + totalPrice.toLocaleString();
        if (products[productIndex].stock === 0) {
          event.target.textContent = "Out of Stock";
          event.target.style.backgroundColor = "#D2D2D2";
          event.target.style.color = "red";
          event.target.style.cursor = "not-allowed";
        } else {
          event.target.textContent = "Add to Cart";
          event.target.style.backgroundColor = "#ffff";
          event.target.style.color = "#3458D0";
          event.target.style.cursor = "pointer";
        }
      }
    }
  });

  tableBody.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-icon")) {
      var row = event.target.closest(".row");
      var productName = row.querySelector(".item-name").textContent;
      var productPrice = parseInt(
        row.querySelector(".item-price").textContent.replace(/[^0-9]/g, "")
      );
      var productIndex = products.findIndex(
        (product) => product.name === productName
      );

      products[productIndex].stock++; // Incrementing the stock
      updateStock(
        productsContainer.querySelector(`.card:nth-child(${productIndex + 1})`),
        products[productIndex].stock
      ); // Update the displayed stock
      tableBody.removeChild(row); // Remove the row from the cart
      totalPrice -= productPrice;
      totalPriceDisplay.textContent = "₹ " + totalPrice.toLocaleString();

      // Change "Out of Stock" back to "Add to Cart" if stock is available
      if (products[productIndex].stock === 1) {
        var addButton = productsContainer.querySelector(
          `.card:nth-child(${productIndex + 1}) .add_cart`
        );
        addButton.textContent = "Add to Cart";
        addButton.style.backgroundColor = "#ffff";
        addButton.style.color = "#3458D0";
        addButton.style.cursor = "pointer";
      }
    }
  });

  function updateStock(card, stock) {
    card.querySelector(".stock-info .num").textContent = stock;
    if (stock < 5) {
      card.querySelector(".stock-info").classList.add("blink-red");
    } else {
      card.querySelector(".stock-info").classList.remove("blink-red");
    }
  }

  function updateCart(productName, productPrice) {
    var newRow = document.createElement("div");
    newRow.classList.add("row");
    newRow.innerHTML = `
            <div class="item-name">${productName}</div>
            <div class="item-price">${productPrice.toLocaleString()}</div>`;

    var deleteIcon = document.createElement("span");
    deleteIcon.classList.add("material-symbols-outlined", "delete-icon");
    newRow.querySelector(".item-price").appendChild(deleteIcon);
    deleteIcon.textContent = "delete";
    deleteIcon.style.cursor = "pointer";
    deleteIcon.style.color = "gray";
    deleteIcon.style.fontSize = "16px";

    deleteIcon.addEventListener("mouseover", function () {
      deleteIcon.style.color = "black";
      deleteIcon.style.fontSize = "18px";
    });

    deleteIcon.addEventListener("mouseout", function () {
      deleteIcon.style.color = "gray";
      deleteIcon.style.fontSize = "16px";
    });

    tableBody.appendChild(newRow);
  }
  function displayFilteredProducts(query) {
    productsContainer.innerHTML = "";
    var filteredProducts = products.filter(function (product) {
      return product.name.toLowerCase().includes(query.toLowerCase());
    });
    if (filteredProducts.length > 0) {
      filteredProducts.forEach(function (product) {
        var productCard = generateProductCard(product);
        productsContainer.insertAdjacentHTML("beforeend", productCard);
      });
    } else {
      productsContainer.innerHTML =
        "<p>Oops! This Product is not available</p>";
    }
  }

  displayFilteredProducts("");

  searchBox.addEventListener("input", function () {
    displayFilteredProducts(searchBox.value);
  });

  // Adding hover effect for add to cart buttons
  productsContainer.addEventListener("mouseover", function (event) {
    if (event.target.classList.contains("add_cart")) {
      if (event.target.textContent === "Add to Cart") {
        event.target.style.backgroundColor = "#3458D0";
        event.target.style.color = "#ffff";
      } else if (event.target.textContent === "Out of Stock") {
        event.target.style.backgroundColor = "red";
        event.target.style.color = "#ffff";
      }
    }
  });

  productsContainer.addEventListener("mouseout", function (event) {
    if (event.target.classList.contains("add_cart")) {
      if (event.target.textContent === "Add to Cart") {
        event.target.style.backgroundColor = "#ffff";
        event.target.style.color = "#3458D0";
      } else if (event.target.textContent === "Out of Stock") {
        event.target.style.backgroundColor = "#D2D2D2";
        event.target.style.color = "red";
      }
    }
  });
});
