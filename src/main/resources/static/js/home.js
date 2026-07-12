const API_BASE = "http://localhost:8080/api/public";

/* ===========================
      LOAD TOP 10 MEDICINES
=========================== */

async function loadTopMedicines() {

    try {

        const response = await axios.get(`${API_BASE}/medicines/top10`);

        const medicines = response.data;

        const container = document.getElementById("topMedicineContainer");

        container.innerHTML = "";

        medicines.forEach(medicine => {

            container.innerHTML += `

            <div class="col-lg-3 col-md-4 col-sm-6">

                <div class="medicine-card">

                    <img src="${medicine.imageUrl}"
                         alt="${medicine.name}">

                    <div class="medicine-card-body">

                        <h5>${medicine.name}</h5>

                        <p>${medicine.brand}</p>

                        <div class="price">

                            ₹${medicine.price}

                        </div>

                        <a href="/medicine/${medicine.id}"
                           class="btn btn-success mt-3 w-100">

                            View Details

                        </a>

                    </div>

                </div>

            </div>

            `;

        });

    }

    catch(error){

        console.error("Top medicines error",error);

    }

}

/* ===========================
        LOAD SLIDER
=========================== */

async function loadMedicineSlider(){

    try{

        const response = await axios.get(`${API_BASE}/medicines`);

        const medicines=response.data;

        const slider=document.getElementById("sliderContainer");

        slider.innerHTML="";

        medicines.forEach(medicine=>{

            slider.innerHTML += `

            <div class="slider-card">

                <img src="${medicine.imageUrl}">

                <h6>${medicine.name}</h6>

            </div>

            `;

        });

        /* Duplicate for infinite effect */

        medicines.forEach(medicine=>{

            slider.innerHTML += `

            <div class="slider-card">

                <img src="${medicine.imageUrl}">

                <h6>${medicine.name}</h6>

            </div>

            `;

        });

    }

    catch(error){

        console.log(error);

    }

}

/* ===========================
      CONTACT FORM
=========================== */

document.getElementById("contactForm")
    .addEventListener("submit",async function(e){

        e.preventDefault();

        const enquiry={

            name:document.getElementById("name").value,

            email:document.getElementById("email").value,

            phone:document.getElementById("phone").value,

            message:document.getElementById("message").value

        };

        try{

            const response=await axios.post(

                `${API_BASE}/enquiry`,

                enquiry

            );

            alert(response.data.message);

            // Opens WhatsApp (web or app) in a new tab with the
            // enquiry pre-filled to Hfur Pharma's number. The visitor
            // still needs to tap Send inside WhatsApp themselves — a
            // free wa.me link cannot auto-send silently.
            if (response.data.whatsappUrl) {
                window.open(response.data.whatsappUrl, "_blank");
            }

            document.getElementById("contactForm").reset();

        }

        catch(error){

            alert("Unable to submit enquiry.");

        }

    });

/* ===========================
        START
=========================== */

window.onload=()=>{

    loadTopMedicines();

    loadMedicineSlider();

};