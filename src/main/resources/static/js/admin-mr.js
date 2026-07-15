(() => {
    const API = "/api/admin/mr";
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "ADMIN") {
        window.location.href = "/login";
        return;
    }

    const headers = { Authorization: "Bearer " + token };
    const table = document.getElementById("mrTable");
    const form = document.getElementById("mrForm");
    const modalElement = document.getElementById("mrModal");

    function getErrorMessage(error, fallback) {
        const data = error?.response?.data;
        if (typeof data === "string" && data.trim()) return data;
        if (data?.message) return data.message;
        return fallback;
    }

    async function loadMRs() {
        table.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">Loading medical representatives...</td></tr>';

        try {
            const response = await axios.get(API, { headers });
            const representatives = Array.isArray(response.data) ? response.data : [];
            table.innerHTML = "";

            if (!representatives.length) {
                table.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">No medical representatives created yet.</td></tr>';
                return;
            }

            representatives.forEach(mr => {
                const row = document.createElement("tr");
                const values = [mr.name, mr.email, mr.area || "—"];

                values.forEach(value => {
                    const cell = document.createElement("td");
                    cell.textContent = value || "—";
                    row.appendChild(cell);
                });

                const statusCell = document.createElement("td");
                const status = document.createElement("span");
                status.className = "badge " + (mr.active ? "text-bg-success" : "text-bg-secondary");
                status.textContent = mr.active ? "Active" : "Inactive";
                statusCell.appendChild(status);

                const visitsCell = document.createElement("td");
                visitsCell.innerHTML = `<a href="/admin/visits/${Number(mr.id)}" class="btn btn-primary btn-sm"><i class="fa-solid fa-clipboard-list"></i> Visits</a>`;

                const trackingCell = document.createElement("td");
                trackingCell.innerHTML = `<a href="/admin/tracking/${Number(mr.id)}" class="btn btn-success btn-sm"><i class="fa-solid fa-location-dot"></i> Track</a>`;

                const manageCell = document.createElement("td");
                const statusButton = document.createElement("button");
                statusButton.type = "button";
                statusButton.className = "btn btn-sm " + (mr.active ? "btn-outline-danger" : "btn-outline-success");
                statusButton.textContent = mr.active ? "Deactivate" : "Activate";
                statusButton.addEventListener("click", () => updateStatus(mr.id, !mr.active, mr.name));
                manageCell.appendChild(statusButton);

                row.append(statusCell, visitsCell, trackingCell, manageCell);
                table.appendChild(row);
            });
        } catch (error) {
            console.error(error);
            table.innerHTML = '<tr><td colspan="7" class="text-center text-danger py-4">Unable to load medical representatives.</td></tr>';
        }
    }

    async function updateStatus(mrId, active, name) {
        const action = active ? "activate" : "deactivate";
        if (!confirm(`Do you want to ${action} ${name || "this MR"}?`)) return;

        try {
            await axios.patch(API + "/" + mrId + "/status?active=" + active, {}, { headers });
            await loadMRs();
        } catch (error) {
            console.error(error);
            alert(getErrorMessage(error, `Unable to ${action} MR.`));
        }
    }

    form.addEventListener("submit", async event => {
        event.preventDefault();
        const submitButton = form.querySelector("button");
        submitButton.disabled = true;
        submitButton.textContent = "Creating MR...";

        try {
            await axios.post(API + "/create", {
                name: document.getElementById("mrName").value.trim(),
                email: document.getElementById("mrEmail").value.trim(),
                password: document.getElementById("mrPassword").value,
                area: document.getElementById("mrArea").value.trim()
            }, { headers });

            bootstrap.Modal.getOrCreateInstance(modalElement).hide();
            form.reset();
            alert("MR created successfully.");
            await loadMRs();
        } catch (error) {
            console.error(error);
            alert(getErrorMessage(error, "Unable to create MR."));
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Create MR";
        }
    });

    loadMRs();
})();
