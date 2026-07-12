(() => {

    const API = "http://localhost:8080/api/admin/medicines";

    const adminToken = localStorage.getItem("token");

    if (!adminToken) {
        window.location.href = "/login";
        return;
    }

    const table = document.getElementById("medicineTable");
    const form = document.getElementById("medicineForm");
    const search = document.getElementById("searchMedicine");

    // ============================
    // LOAD MEDICINES
    // ============================

    async function loadMedicines() {

        try {

            const response = await axios.get(API, {
                headers: {
                    Authorization: "Bearer " + adminToken
                }
            });

            displayMedicines(response.data);

        } catch (err) {
            console.error(err);
            alert("Unable to load medicines.");
        }

    }

    // ============================
    // DISPLAY TABLE
    // ============================

    function displayMedicines(medicines) {

        table.innerHTML = "";

        medicines.forEach(medicine => {

            table.innerHTML += `

<tr>

<td>

<img
src="${medicine.imageUrl || 'https://dummyimage.com/70x70/cccccc/000000&text=No+Image'}"
width="70"
height="70"
style="object-fit:cover;border-radius:8px;"
onerror="this.onerror=null;this.src='https://dummyimage.com/70x70/cccccc/000000&text=No+Image'">

</td>

<td>${medicine.name}</td>

<td>${medicine.brand}</td>

<td>₹${medicine.price}</td>

<td>${medicine.stock}</td>

<td>

<button
class="btn btn-warning btn-sm mb-1"
onclick="editMedicine(${medicine.id})">

Edit

</button>

<br>

<button
class="btn btn-info btn-sm mb-1"
onclick="addStock(${medicine.id})">

Stock

</button>

<br>

<button
class="btn btn-danger btn-sm"
onclick="deleteMedicine(${medicine.id})">

Delete

</button>

</td>

</tr>

`;

        });

    }

    // ============================
    // SAVE MEDICINE
    // ============================

    form.addEventListener("submit", async function (e) {

        e.preventDefault();

        try {

            let imageUrl = "";

            const imageFile = document.getElementById("image").files[0];

            // Upload image first
            if (imageFile) {

                const fd = new FormData();
                fd.append("file", imageFile);

                const uploadResponse = await axios.post(

                    API + "/upload",

                    fd,

                    {

                        headers: {

                            Authorization: "Bearer " + adminToken

                        }

                    }

                );

                imageUrl = uploadResponse.data;

                console.log("Cloudinary URL =", imageUrl);

            }

            const medicine = {

                name: document.getElementById("name").value.trim(),

                brand: document.getElementById("brand").value.trim(),

                price: Number(document.getElementById("price").value),

                stock: Number(document.getElementById("stock").value),

                description: document.getElementById("description").value.trim(),

                categoryId: Number(document.getElementById("category").value),

                imageUrl: imageUrl

            };

            console.log("Saving medicine:", medicine);

            await axios.post(

                API,

                medicine,

                {

                    headers: {

                        Authorization: "Bearer " + adminToken,

                        "Content-Type": "application/json"

                    }

                }

            );

            alert("Medicine Added Successfully");

            form.reset();

            bootstrap.Modal
                .getInstance(document.getElementById("medicineModal"))
                .hide();

            loadMedicines();

        }

        catch (err) {

            console.error(err);

            if (err.response) {

                console.log(err.response.data);

            }

            alert("Unable to save medicine.");

        }

    });

    // ============================
    // DELETE
    // ============================

    window.deleteMedicine = async function (id) {

        if (!confirm("Delete this medicine?")) return;

        try {

            await axios.delete(API + "/" + id, {

                headers: {

                    Authorization: "Bearer " + adminToken

                }

            });

            loadMedicines();

        }

        catch (err) {

            console.error(err);

        }

    };

    // ============================
    // ADD STOCK
    // ============================

    window.addStock = async function (id) {

        const quantity = prompt("Enter Quantity");

        if (!quantity) return;

        try {

            await axios.post(

                API + "/" + id + "/add-stock?quantity=" + quantity,

                {},

                {

                    headers: {

                        Authorization: "Bearer " + adminToken

                    }

                }

            );

            loadMedicines();

        }

        catch (err) {

            console.error(err);

        }

    };

    // ============================
    // EDIT
    // ============================

    window.editMedicine = function () {

        alert("Edit feature coming next.");

    };

    // ============================
    // SEARCH
    // ============================

    search.addEventListener("keyup", async function () {

        const keyword = this.value.toLowerCase();

        try {

            const response = await axios.get(API, {

                headers: {

                    Authorization: "Bearer " + adminToken

                }

            });

            const filtered = response.data.filter(m =>

                m.name.toLowerCase().includes(keyword) ||

                m.brand.toLowerCase().includes(keyword)

            );

            displayMedicines(filtered);

        }

        catch (err) {

            console.error(err);

        }

    });

    loadMedicines();

})();