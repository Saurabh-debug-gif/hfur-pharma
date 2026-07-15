(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "MR") {
        localStorage.removeItem("mrTrackingEnabled");
        window.location.href = "/login";
        return;
    }

    const API = "/api/mr";
    const headers = { Authorization: "Bearer " + token };
    const locationButton = document.getElementById("locationBtn");
    const trackingState = document.getElementById("trackingState");
    const locationStatus = document.getElementById("locationStatus");
    const coordinates = document.getElementById("locationCoordinates");
    const lastLocationTime = document.getElementById("lastLocationTime");
    const mapLink = document.getElementById("myMapLink");
    const visitForm = document.getElementById("visitForm");
    const visitSubmitButton = document.getElementById("visitSubmitBtn");
    const visitsTable = document.getElementById("recentVisits");

    let watchId = null;
    let lastLocationSentAt = 0;

    document.getElementById("mrName").textContent = localStorage.getItem("name") || "MR";

    function formatDate(value) {
        if (!value) return "—";
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? value : date.toLocaleString("en-IN");
    }

    function getErrorMessage(error, fallback) {
        const data = error?.response?.data;
        if (typeof data === "string" && data.trim()) return data;
        if (data?.message) return data.message;
        return fallback;
    }

    function setTrackingState(message, state = "") {
        locationStatus.textContent = message;
        trackingState.classList.remove("active", "error");
        if (state) trackingState.classList.add(state);
    }

    function showLocation(location) {
        if (!location || location.latitude == null || location.longitude == null) return;
        const latitude = Number(location.latitude).toFixed(6);
        const longitude = Number(location.longitude).toFixed(6);
        coordinates.textContent = `${latitude}, ${longitude}`;
        lastLocationTime.textContent = formatDate(location.timestamp);
        mapLink.href = `https://www.google.com/maps?q=${encodeURIComponent(latitude + "," + longitude)}`;
        mapLink.classList.remove("d-none");
    }

    async function sendLocation(position, force = false) {
        const now = Date.now();
        if (!force && now - lastLocationSentAt < 30000) return;

        const data = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };

        await axios.post(API + "/location/update", data, { headers });
        lastLocationSentAt = now;
        showLocation({ ...data, timestamp: new Date().toISOString() });
        setTrackingState("Live tracking is active", "active");
    }

    function locationErrorMessage(error) {
        if (error?.code === 1) return "Location permission was denied. Enable it in your browser settings.";
        if (error?.code === 2) return "Your current location is unavailable.";
        if (error?.code === 3) return "Location request timed out. Please try again.";
        return "Unable to access your current location.";
    }

    function startTracking() {
        if (!navigator.geolocation) {
            setTrackingState("This browser does not support location tracking", "error");
            return;
        }

        setTrackingState("Waiting for location permission...");
        locationButton.disabled = true;

        watchId = navigator.geolocation.watchPosition(
            async position => {
                try {
                    await sendLocation(position);
                    localStorage.setItem("mrTrackingEnabled", "true");
                    locationButton.innerHTML = '<i class="fa-solid fa-stop"></i> Stop live tracking';
                } catch (error) {
                    console.error(error);
                    setTrackingState(getErrorMessage(error, "Unable to send location"), "error");
                } finally {
                    locationButton.disabled = false;
                }
            },
            error => {
                setTrackingState(locationErrorMessage(error), "error");
                localStorage.removeItem("mrTrackingEnabled");
                locationButton.disabled = false;
                watchId = null;
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }

    function stopTracking() {
        if (watchId !== null) navigator.geolocation.clearWatch(watchId);
        watchId = null;
        localStorage.removeItem("mrTrackingEnabled");
        setTrackingState("Tracking is stopped");
        locationButton.innerHTML = '<i class="fa-solid fa-play"></i> Start live tracking';
    }

    function getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error("Geolocation unsupported"));
                return;
            }
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 5000
            });
        });
    }

    async function loadLatestLocation() {
        try {
            const response = await axios.get(API + "/location/latest", { headers });
            if (response.status !== 204 && response.data) showLocation(response.data);
        } catch (error) {
            console.error("Unable to load latest location", error);
        }
    }

    async function loadVisits() {
        visitsTable.innerHTML = '<tr><td colspan="3" class="text-center text-muted py-4">Loading visits...</td></tr>';

        try {
            const response = await axios.get(API + "/visit/my", { headers });
            const visits = Array.isArray(response.data) ? response.data : [];
            visitsTable.innerHTML = "";

            if (!visits.length) {
                visitsTable.innerHTML = '<tr><td colspan="3" class="text-center text-muted py-4">No visits logged yet.</td></tr>';
                return;
            }

            visits.slice(0, 20).forEach(visit => {
                const row = document.createElement("tr");
                const place = document.createElement("td");
                const notes = document.createElement("td");
                const time = document.createElement("td");

                place.className = "visit-place";
                place.textContent = visit.shopName || "—";
                notes.textContent = visit.notes || "—";
                time.textContent = formatDate(visit.timestamp);
                row.append(place, notes, time);
                visitsTable.appendChild(row);
            });
        } catch (error) {
            console.error(error);
            visitsTable.innerHTML = '<tr><td colspan="3" class="text-center text-danger py-4">Unable to load visits.</td></tr>';
        }
    }

    locationButton.addEventListener("click", () => {
        if (watchId === null) startTracking();
        else stopTracking();
    });

    visitForm.addEventListener("submit", async event => {
        event.preventDefault();
        visitSubmitButton.disabled = true;
        visitSubmitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving visit...';

        try {
            try {
                const position = await getCurrentPosition();
                await sendLocation(position, true);
            } catch (locationError) {
                console.warn("Visit saved without a fresh location", locationError);
            }

            await axios.post(API + "/visit/log", {
                shopName: document.getElementById("shopName").value.trim(),
                notes: document.getElementById("notes").value.trim()
            }, { headers });

            alert("Visit logged successfully.");
            visitForm.reset();
            await loadVisits();
        } catch (error) {
            console.error(error);
            alert(getErrorMessage(error, "Unable to log visit."));
        } finally {
            visitSubmitButton.disabled = false;
            visitSubmitButton.innerHTML = '<i class="fa-solid fa-check"></i> Save visit';
        }
    });

    document.getElementById("refreshVisitsBtn").addEventListener("click", loadVisits);

    loadLatestLocation();
    loadVisits();
    if (localStorage.getItem("mrTrackingEnabled") === "true") startTracking();
})();
