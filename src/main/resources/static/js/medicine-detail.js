const API = "https://hfur-pharma-1.onrender.com/api";

const token = localStorage.getItem("token");

const medicineId = window.location.pathname.split("/").pop();

/* ===========================
   LOAD MEDICINE DETAILS
=========================== */

async function loadMedicine() {

    try {

        const response = await axios.get(

            API + "/public/medicines/" + medicineId

        );

        const medicine = response.data;

        document.getElementById("medicineImage").src = medicine.imageUrl;

        document.getElementById("medicineName").textContent = medicine.name || "Medicine";

        document.getElementById("medicineBrand").textContent = medicine.brand || "";

        document.getElementById("medicinePrice").textContent =
            "₹" + medicine.price;

        document.getElementById("medicineDescription").textContent =
            medicine.description || "Description not available.";

        document.getElementById("medicineStock").textContent =
            medicine.stock;

        renderCustomAttributes(medicine.customAttributes);

    }

    catch (error) {

        console.log(error);

    }

}

function renderCustomAttributes(rawAttributes) {
    const container = document.getElementById("medicineAttributes");
    let attributes = {};

    try {
        attributes = typeof rawAttributes === "string"
            ? JSON.parse(rawAttributes || "{}")
            : (rawAttributes || {});
    } catch {
        attributes = {};
    }

    const entries = Object.entries(attributes).filter(([key, value]) => key && value);
    container.innerHTML = "";

    entries.forEach(([key, value]) => {
        const item = document.createElement("div");
        item.className = "medicine-attribute";

        const label = document.createElement("small");
        label.textContent = key;

        const detail = document.createElement("strong");
        detail.textContent = value;

        item.append(label, detail);
        container.appendChild(item);
    });

    container.classList.toggle("d-none", entries.length === 0);
}

/* ===========================
   ADD TO CART
=========================== */

document.getElementById("addCartBtn")

    .addEventListener("click", async () => {

        if (!token) {

            alert("Please login first.");

            window.location.href="/login";

            return;

        }

        const role = localStorage.getItem("role");

        if(role !== "CUSTOMER"){

            alert("Only customers can add medicines to cart.");

            return;

        }

        try {

            const response = await axios.post(

                API +

                "/customer/cart/add?medicineId=" +

                medicineId +

                "&quantity=1",

                {},

                {

                    headers: {

                        Authorization: "Bearer " + token

                    }

                }

            );

            alert("Medicine added to cart successfully.");

        }

        catch (error) {

            console.log(error);

            alert("Unable to add medicine to cart.");

        }

    });

loadMedicine();
