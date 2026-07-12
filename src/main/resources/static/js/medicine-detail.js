const API = "http://https://hfur-pharma-1.onrender.com/api";

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

        document.getElementById("medicineName").innerHTML = medicine.name;

        document.getElementById("medicineBrand").innerHTML = medicine.brand;

        document.getElementById("medicinePrice").innerHTML =
            "₹" + medicine.price;

        document.getElementById("medicineDescription").innerHTML =
            medicine.description;

        document.getElementById("medicineStock").innerHTML =
            medicine.stock;

    }

    catch (error) {

        console.log(error);

    }

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