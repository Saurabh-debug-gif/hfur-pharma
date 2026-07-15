(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const mrId = Number(window.location.pathname.split("/").pop());

    if (!token || role !== "ADMIN" || !Number.isInteger(mrId)) {
        window.location.href = "/login";
        return;
    }

    const API = "/api/admin/tracking";
    const headers = { Authorization: "Bearer " + token };
    const historyTable = document.getElementById("historyTable");
    const message = document.getElementById("trackingMessage");
    const mapLink = document.getElementById("latestMapLink");
    let loading = false;

    function formatDate(value) {
        if (!value) return "—";
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? value : date.toLocaleString("en-IN");
    }

    function mapUrl(latitude, longitude) {
        return `https://www.google.com/maps?q=${encodeURIComponent(latitude + "," + longitude)}`;
    }

    function clearLatest() {
        document.getElementById("latitude").textContent = "—";
        document.getElementById("longitude").textContent = "—";
        document.getElementById("time").textContent = "No location shared yet";
        mapLink.classList.add("d-none");
    }

    async function loadTracking() {
        if (loading) return;
        loading = true;

        try {
            const [latest, history] = await Promise.all([
                axios.get(API + "/latest/" + mrId, { headers }),
                axios.get(API + "/history/" + mrId, { headers })
            ]);

            if (latest.status === 204 || !latest.data) {
                clearLatest();
            } else {
                const latitude = Number(latest.data.latitude).toFixed(6);
                const longitude = Number(latest.data.longitude).toFixed(6);
                document.getElementById("latitude").textContent = latitude;
                document.getElementById("longitude").textContent = longitude;
                document.getElementById("time").textContent = formatDate(latest.data.timestamp);
                mapLink.href = mapUrl(latitude, longitude);
                mapLink.classList.remove("d-none");
            }

            const locations = Array.isArray(history.data) ? history.data : [];
            historyTable.innerHTML = "";

            if (!locations.length) {
                historyTable.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-4">No tracking history available.</td></tr>';
            } else {
                locations.forEach(location => {
                    const latitude = Number(location.latitude).toFixed(6);
                    const longitude = Number(location.longitude).toFixed(6);
                    const row = document.createElement("tr");

                    [latitude, longitude, formatDate(location.timestamp)].forEach(value => {
                        const cell = document.createElement("td");
                        cell.textContent = value;
                        row.appendChild(cell);
                    });

                    const mapCell = document.createElement("td");
                    const link = document.createElement("a");
                    link.className = "btn btn-outline-success btn-sm";
                    link.href = mapUrl(latitude, longitude);
                    link.target = "_blank";
                    link.rel = "noopener noreferrer";
                    link.textContent = "Open map";
                    mapCell.appendChild(link);
                    row.appendChild(mapCell);
                    historyTable.appendChild(row);
                });
            }

            message.textContent = "Updated " + new Date().toLocaleTimeString("en-IN") + ". Auto-refresh is active.";
        } catch (error) {
            console.error(error);
            message.textContent = "Unable to load tracking data. Check the MR account and try again.";
            historyTable.innerHTML = '<tr><td colspan="4" class="text-center text-danger py-4">Unable to load tracking.</td></tr>';
        } finally {
            loading = false;
        }
    }

    document.getElementById("refreshTrackingBtn").addEventListener("click", loadTracking);
    loadTracking();
    window.setInterval(loadTracking, 30000);
})();
