(() => {
    const API = "/api/admin/medicines";
    const adminToken = localStorage.getItem("token");

    if (!adminToken) {
        window.location.href = "/login";
        return;
    }

    const headers = { Authorization: "Bearer " + adminToken };
    const table = document.getElementById("medicineTable");
    const form = document.getElementById("medicineForm");
    const search = document.getElementById("searchMedicine");
    const modalElement = document.getElementById("medicineModal");
    const modalTitle = document.getElementById("modalTitle");
    const saveButton = document.getElementById("saveMedicineButton");
    const categorySelect = document.getElementById("category");
    const attributesContainer = document.getElementById("customAttributes");

    let medicines = [];
    let currentImageUrl = "";

    const escapeHtml = (value) => String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

    function safeImageUrl(value) {
        const url = String(value ?? "").trim();
        if (url.startsWith("/") || /^https?:\/\//i.test(url)) {
            return escapeHtml(url);
        }
        return "https://dummyimage.com/70x70/edf4f0/0b3d2e&text=No+Image";
    }

    function getErrorMessage(error, fallback) {
        const data = error?.response?.data;
        if (typeof data === "string" && data.trim()) return data;
        if (data?.message) return data.message;
        return fallback;
    }

    async function loadCategories() {
        try {
            const response = await axios.get(API + "/categories", { headers });
            const categories = Array.isArray(response.data) ? response.data : [];

            categorySelect.innerHTML = '<option value="">Select category</option>' +
                categories.map(category =>
                    `<option value="${Number(category.id)}">${escapeHtml(category.name)}</option>`
                ).join("");
        } catch (error) {
            console.error("Unable to load categories", error);
            categorySelect.innerHTML = '<option value="">Categories unavailable</option>';
        }
    }

    async function loadMedicines() {
        table.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">Loading medicines...</td></tr>';

        try {
            const response = await axios.get(API, { headers });
            medicines = Array.isArray(response.data) ? response.data : [];
            displayMedicines(medicines);
        } catch (error) {
            console.error(error);
            table.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-danger">Unable to load medicines.</td></tr>';
        }
    }

    function displayMedicines(list) {
        if (!list.length) {
            table.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">No medicines found.</td></tr>';
            return;
        }

        table.innerHTML = list.map(medicine => {
            const stock = Number(medicine.stock) || 0;
            const stockClass = stock === 0 ? "stock-out" : stock <= 10 ? "stock-low" : "stock-ok";
            const description = String(medicine.description ?? "").trim();

            return `
                <tr>
                    <td>
                        <img src="${safeImageUrl(medicine.imageUrl)}"
                             width="70" height="70" alt="${escapeHtml(medicine.name)}"
                             onerror="this.onerror=null;this.src='https://dummyimage.com/70x70/edf4f0/0b3d2e&text=No+Image'">
                    </td>
                    <td><strong>${escapeHtml(medicine.name)}</strong></td>
                    <td>${escapeHtml(medicine.brand)}</td>
                    <td>₹${escapeHtml(medicine.price)}</td>
                    <td><span class="stock-badge ${stockClass}">${stock}</span></td>
                    <td class="description-cell" title="${escapeHtml(description)}">
                        ${escapeHtml(description || "No description")}
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button type="button" class="btn btn-warning btn-sm" onclick="editMedicine(${Number(medicine.id)})">
                                <i class="fa-solid fa-pen"></i> Edit
                            </button>
                            <button type="button" class="btn btn-info btn-sm" onclick="addStock(${Number(medicine.id)})">
                                <i class="fa-solid fa-boxes-stacked"></i> Stock
                            </button>
                            <button type="button" class="btn btn-danger btn-sm" onclick="deleteMedicine(${Number(medicine.id)})" aria-label="Delete ${escapeHtml(medicine.name)}">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>`;
        }).join("");
    }

    function parseAttributes(value) {
        if (!value) return {};
        if (typeof value === "object" && !Array.isArray(value)) return value;

        try {
            const parsed = JSON.parse(value);
            return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
        } catch {
            return {};
        }
    }

    function addAttributeRow(key = "", value = "") {
        const row = document.createElement("div");
        row.className = "attribute-row";
        row.innerHTML = `
            <input type="text" class="form-control attribute-key" placeholder="Attribute name" value="${escapeHtml(key)}">
            <input type="text" class="form-control attribute-value" placeholder="Attribute value" value="${escapeHtml(value)}">
            <button type="button" class="btn btn-outline-danger" aria-label="Remove attribute">
                <i class="fa-solid fa-xmark"></i>
            </button>`;

        row.querySelector("button").addEventListener("click", () => row.remove());
        attributesContainer.appendChild(row);
    }

    function collectAttributes() {
        const attributes = {};

        attributesContainer.querySelectorAll(".attribute-row").forEach(row => {
            const key = row.querySelector(".attribute-key").value.trim();
            const value = row.querySelector(".attribute-value").value.trim();
            if (key && value) attributes[key] = value;
        });

        return attributes;
    }

    function resetMedicineForm() {
        form.reset();
        document.getElementById("medicineId").value = "";
        currentImageUrl = "";
        attributesContainer.innerHTML = "";
        modalTitle.textContent = "Add Medicine";
        saveButton.textContent = "Save Medicine";
    }

    document.getElementById("addMedicineButton").addEventListener("click", resetMedicineForm);
    document.getElementById("addAttributeButton").addEventListener("click", () => addAttributeRow());
    modalElement.addEventListener("hidden.bs.modal", resetMedicineForm);

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const medicineId = document.getElementById("medicineId").value;
        const price = Number(document.getElementById("price").value);
        const stock = Number(document.getElementById("stock").value);

        if (price < 0 || !Number.isFinite(price) || stock < 0 || !Number.isInteger(stock)) {
            alert("Enter a valid non-negative price and whole-number stock quantity.");
            return;
        }

        saveButton.disabled = true;
        saveButton.textContent = medicineId ? "Updating..." : "Saving...";

        try {
            let imageUrl = currentImageUrl;
            const imageFile = document.getElementById("image").files[0];

            if (imageFile) {
                const uploadData = new FormData();
                uploadData.append("file", imageFile);
                const uploadResponse = await axios.post(API + "/upload", uploadData, { headers });
                imageUrl = uploadResponse.data;
            }

            const medicine = {
                name: document.getElementById("name").value.trim(),
                brand: document.getElementById("brand").value.trim(),
                price,
                stock,
                description: document.getElementById("description").value.trim(),
                customAttributes: JSON.stringify(collectAttributes()),
                categoryId: Number(categorySelect.value),
                imageUrl
            };

            const config = { headers: { ...headers, "Content-Type": "application/json" } };

            if (medicineId) {
                await axios.put(API + "/" + medicineId, medicine, config);
                alert("Medicine updated successfully.");
            } else {
                await axios.post(API, medicine, config);
                alert("Medicine added successfully.");
            }

            bootstrap.Modal.getOrCreateInstance(modalElement).hide();
            await loadMedicines();
        } catch (error) {
            console.error(error);
            alert(getErrorMessage(error, "Unable to save medicine."));
        } finally {
            saveButton.disabled = false;
            saveButton.textContent = medicineId ? "Update Medicine" : "Save Medicine";
        }
    });

    window.editMedicine = function (id) {
        const medicine = medicines.find(item => Number(item.id) === Number(id));
        if (!medicine) {
            alert("Medicine details could not be found. Refresh and try again.");
            return;
        }

        resetMedicineForm();
        document.getElementById("medicineId").value = medicine.id;
        document.getElementById("name").value = medicine.name ?? "";
        document.getElementById("brand").value = medicine.brand ?? "";
        document.getElementById("price").value = medicine.price ?? 0;
        document.getElementById("stock").value = medicine.stock ?? 0;
        document.getElementById("description").value = medicine.description ?? "";

        const categoryId = medicine.category?.id ?? "";
        if (categoryId && !categorySelect.querySelector(`option[value="${categoryId}"]`)) {
            const option = new Option(medicine.category?.name || `Category ${categoryId}`, categoryId);
            categorySelect.add(option);
        }
        categorySelect.value = categoryId;

        currentImageUrl = medicine.imageUrl ?? "";
        Object.entries(parseAttributes(medicine.customAttributes)).forEach(([key, value]) => {
            addAttributeRow(key, value);
        });

        modalTitle.textContent = "Edit Medicine";
        saveButton.textContent = "Update Medicine";
        bootstrap.Modal.getOrCreateInstance(modalElement).show();
    };

    window.addStock = async function (id) {
        const input = prompt("Enter the positive quantity to add to stock:");
        if (input === null) return;

        const quantity = Number(input);
        if (!Number.isInteger(quantity) || quantity <= 0) {
            alert("Stock quantity must be a whole number greater than zero.");
            return;
        }

        try {
            await axios.post(API + "/" + id + "/add-stock?quantity=" + encodeURIComponent(quantity), {}, { headers });
            await loadMedicines();
        } catch (error) {
            console.error(error);
            alert(getErrorMessage(error, "Unable to add stock."));
        }
    };

    window.deleteMedicine = async function (id) {
        const medicine = medicines.find(item => Number(item.id) === Number(id));
        if (!confirm(`Delete ${medicine?.name || "this medicine"}? This cannot be undone.`)) return;

        try {
            await axios.delete(API + "/" + id, { headers });
            await loadMedicines();
        } catch (error) {
            console.error(error);
            alert(getErrorMessage(error, "Unable to delete medicine."));
        }
    };

    search.addEventListener("input", function () {
        const keyword = this.value.trim().toLowerCase();
        const filtered = medicines.filter(medicine =>
            String(medicine.name ?? "").toLowerCase().includes(keyword) ||
            String(medicine.brand ?? "").toLowerCase().includes(keyword)
        );
        displayMedicines(filtered);
    });

    Promise.all([loadCategories(), loadMedicines()]);
})();
