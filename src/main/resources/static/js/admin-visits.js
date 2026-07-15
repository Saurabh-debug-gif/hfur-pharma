(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const mrId = Number(window.location.pathname.split("/").pop());

    if (!token || role !== "ADMIN" || !Number.isInteger(mrId)) {
        window.location.href = "/login";
        return;
    }

    const API = "/api/admin/visits/" + mrId;
    const headers = { Authorization: "Bearer " + token };
    const table = document.getElementById("visitTable");

    function formatDate(value) {
        if (!value) return "—";
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? value : date.toLocaleString("en-IN");
    }

    async function loadVisits() {
        table.innerHTML = '<tr><td colspan="3" class="text-center text-muted py-4">Loading visits...</td></tr>';

        try {
            const response = await axios.get(API, { headers });
            const visits = Array.isArray(response.data) ? response.data : [];
            table.innerHTML = "";

            if (!visits.length) {
                table.innerHTML = '<tr><td colspan="3" class="text-center text-muted py-4">No visits logged by this MR.</td></tr>';
                return;
            }

            visits.forEach(visit => {
                const row = document.createElement("tr");
                [visit.shopName || "—", visit.notes || "—", formatDate(visit.timestamp)].forEach(value => {
                    const cell = document.createElement("td");
                    cell.textContent = value;
                    row.appendChild(cell);
                });
                table.appendChild(row);
            });
        } catch (error) {
            console.error(error);
            table.innerHTML = '<tr><td colspan="3" class="text-center text-danger py-4">Unable to load visits.</td></tr>';
        }
    }

    loadVisits();
})();
