const API = "https://hfur-pharma-1.onrender.com/api/public/medicines";

const container = document.getElementById("medicineContainer");
const search = document.getElementById("searchMedicine");

let medicines = [];

console.log("medicines.js Loaded");

// ==========================
// LOAD MEDICINES
// ==========================
async function loadMedicines() {

    try {

        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <h5>Loading medicines...</h5>
            </div>
        `;

        const response = await axios.get(API);

        console.log("API Response:", response.data);

        if (Array.isArray(response.data)) {

            medicines = response.data;

        } else if (response.data.content) {

            medicines = response.data.content;

        } else {

            medicines = [];

        }

        renderMedicines(medicines);

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    Failed to load medicines.
                </div>
            </div>
        `;

    }

}

// ==========================
// RENDER MEDICINES
// ==========================
function renderMedicines(list) {

    container.innerHTML = "";

    if (!Array.isArray(list) || list.length === 0) {

        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <h3>No Medicines Found</h3>
            </div>
        `;

        return;

    }

    let html = "";

    list.forEach(medicine => {

        html += `
        <div class="col-lg-3 col-md-4 col-sm-6">

            <div class="card medicine-card h-100 shadow-sm">

                <img
                    class="medicine-image"
                    src="${medicine.imageUrl || 'https://dummyimage.com/300x300/cccccc/000000&text=No+Image'}"
                    alt="${medicine.name}"
                    onerror="this.src='https://dummyimage.com/300x300/cccccc/000000&text=No+Image'">

                <div class="card-body d-flex flex-column">

                    <h5 class="card-title">
                        ${medicine.name}
                    </h5>

                    <p class="text-muted mb-2">
                        ${medicine.brand || "Unknown Brand"}
                    </p>

                    <p class="price">
                        ₹${medicine.price}
                    </p>

                    <p class="stock">
                        Stock : ${medicine.stock}
                    </p>

                    <a
                        href="/medicine/${medicine.id}"
                        class="btn btn-success btn-view mt-auto">

                        View Details

                    </a>

                </div>

            </div>

        </div>
        `;

    });

    container.innerHTML = html;

}

// ==========================
// SEARCH
// ==========================
search.addEventListener("keyup", function () {

    const keyword = this.value.trim().toLowerCase();

    if (keyword === "") {

        renderMedicines(medicines);

        return;

    }

    const filtered = medicines.filter(medicine => {

        return (medicine.name || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (medicine.brand || "")
                .toLowerCase()
                .includes(keyword);

    });

    renderMedicines(filtered);

});

// ==========================
loadMedicines();