const API = "/api/customer";

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "/login";
}

const cartContainer = document.getElementById("cartContainer");
const totalElement = document.getElementById("cartTotal");
const placeOrderBtn = document.getElementById("placeOrderBtn");

let total = 0;

/* ===========================
   SESSION EXPIRY HANDLER
   Returns true if the error was an expired/invalid session
   (401) and has already redirected the user to login.
=========================== */

function handleSessionExpiry(error) {

    if (error.response && error.response.status === 401) {

        localStorage.removeItem("token");

        alert("Your session has expired. Please login again.");

        window.location.href = "/login";

        return true;

    }

    return false;

}

/* ===========================
   LOAD CART
=========================== */

async function loadCart() {

    try {

        const response = await axios.get(

            API + "/cart",

            {
                headers: {
                    Authorization: "Bearer " + token
                }
            }

        );

        renderCart(response.data);

    }

    catch (error) {

        console.error(error);

        if (handleSessionExpiry(error)) return;

        alert("Unable to load cart.");

    }

}

/* ===========================
   RENDER CART
=========================== */

function renderCart(items) {

    cartContainer.innerHTML = "";

    total = 0;

    if (items.length === 0) {

        cartContainer.innerHTML = `

            <div class="text-center mt-5">

                <h3>Your cart is empty</h3>

                <a href="/medicines"
                   class="btn btn-success mt-3">

                    Browse Medicines

                </a>

            </div>

        `;

        totalElement.innerHTML = "0";

        return;

    }

    items.forEach(item => {

        const subtotal = item.quantity * item.medicine.price;

        total += subtotal;

        cartContainer.innerHTML += `

        <div class="cart-item">

            <div class="cart-left">

                <img src="${item.medicine.imageUrl}">

                <div class="cart-info">

                    <h5>${item.medicine.name}</h5>

                    <p>${item.medicine.brand}</p>

                    <strong>₹${item.medicine.price}</strong>

                </div>

            </div>

            <div class="quantity-box">

                <button
                    class="btn btn-outline-secondary"
                    onclick="changeQuantity(${item.id},${item.quantity-1})">

                    -

                </button>

                <span>${item.quantity}</span>

                <button
                    class="btn btn-outline-secondary"
                    onclick="changeQuantity(${item.id},${item.quantity+1})">

                    +

                </button>

            </div>

            <h5>

                ₹${subtotal}

            </h5>

            <i

                class="fa-solid fa-trash remove-btn"

                onclick="removeItem(${item.medicine.id})">

            </i>

        </div>

        `;

    });

    totalElement.innerHTML = total.toFixed(2);

}

/* ===========================
   UPDATE QUANTITY
=========================== */

async function changeQuantity(cartId, quantity) {

    if (quantity <= 0) {

        return;

    }

    try {

        await axios.put(

            API + "/cart/" + cartId + "?quantity=" + quantity,

            {},

            {

                headers: {

                    Authorization: "Bearer " + token

                }

            }

        );

        loadCart();

    }

    catch (error) {

        console.error(error);

        if (handleSessionExpiry(error)) return;

    }

}

/* ===========================
   REMOVE ITEM
=========================== */

async function removeItem(medicineId) {

    try {

        await axios.delete(

            API + "/cart/remove?medicineId=" + medicineId,

            {

                headers: {

                    Authorization: "Bearer " + token

                }

            }

        );

        loadCart();

    }

    catch (error) {

        console.error(error);

        if (handleSessionExpiry(error)) return;

    }

}

/* ===========================
   PLACE ORDER
=========================== */

placeOrderBtn.addEventListener("click", async () => {

    // ✅ Open the tab SYNCHRONOUSLY, immediately on the click, while the
    // browser still counts this as "user initiated". Doing window.open()
    // AFTER an `await axios.post(...)` loses that permission in most
    // browsers, so instead of quietly opening a new tab, the browser
    // blocks the popup and redirects the CURRENT tab to the WhatsApp URL
    // instead — which is why placing an order was kicking you out of
    // the page. We open a blank tab now and point it at the real URL
    // once the order response comes back.
    const whatsappTab = window.open("", "_blank");

    try {

        const response = await axios.post(

            API + "/orders/place",

            {},

            {

                headers: {

                    Authorization: "Bearer " + token

                }

            }

        );

        alert(response.data.message);

        // Opens WhatsApp (web or app) in the tab we already opened, with
        // the order details pre-filled to Hfur Pharma's number. The
        // customer still needs to tap Send inside WhatsApp themselves —
        // a free wa.me link cannot auto-send silently.
        if (response.data.whatsappUrl && whatsappTab) {
            whatsappTab.location.href = response.data.whatsappUrl;
        } else if (whatsappTab) {
            whatsappTab.close();
        }

        loadCart();

    }

    catch (error) {

        console.error(error);

        // Close the blank tab we pre-opened since there's no order to show.
        if (whatsappTab) whatsappTab.close();

        if (handleSessionExpiry(error)) return;

        alert("Unable to place order.");

    }

});

/* ===========================
   START
=========================== */

loadCart();