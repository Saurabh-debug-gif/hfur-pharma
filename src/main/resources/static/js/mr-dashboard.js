const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "/login";
}

const API = "https://hfur-pharma-1.onrender.com/api/mr";
/* ==========================
      UPDATE LOCATION
========================== */

document.getElementById("locationBtn")

    .addEventListener("click",()=>{

        navigator.geolocation.getCurrentPosition(async position=>{

            const data={

                latitude:position.coords.latitude,

                longitude:position.coords.longitude

            };

            try{

                await axios.post(

                    API+"/location/update",

                    data,

                    {

                        headers:{

                            Authorization:"Bearer "+token

                        }

                    }

                );

                alert("Location Updated");

            }

            catch(e){

                console.log(e);

                alert("Unable to update location.");

            }

        });

    });

/* ==========================
      VISIT LOG
========================== */

document.getElementById("visitForm")

    .addEventListener("submit",async e=>{

        e.preventDefault();

        const data={

            shopName:shopName.value,

            notes:notes.value

        };

        try{

            await axios.post(

                API+"/visit/log",

                data,

                {

                    headers:{

                        Authorization:"Bearer "+token

                    }

                }

            );

            alert("Visit Logged Successfully");

            visitForm.reset();

        }

        catch(e){

            console.log(e);

            alert("Unable to log visit.");

        }

    });