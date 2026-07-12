const token = localStorage.getItem("token");

const mrId = window.location.pathname.split("/").pop();

const API = "https://hfur-pharma-1.onrender.com/api/admin/tracking";

async function loadTracking(){

    try{

        const latest = await axios.get(

            API + "/latest/" + mrId,

            {

                headers:{

                    Authorization:"Bearer " + token

                }

            }

        );

        document.getElementById("latitude").innerHTML =
            latest.data.latitude;

        document.getElementById("longitude").innerHTML =
            latest.data.longitude;

        document.getElementById("time").innerHTML =
            latest.data.timestamp;

        const history = await axios.get(

            API + "/history/" + mrId,

            {

                headers:{

                    Authorization:"Bearer " + token

                }

            }

        );

        const table = document.getElementById("historyTable");

        table.innerHTML = "";

        history.data.forEach(location=>{

            table.innerHTML += `

<tr>

<td>${location.latitude}</td>

<td>${location.longitude}</td>

<td>${location.timestamp}</td>

</tr>

`;

        });

    }

    catch(e){

        console.log(e);

        alert("Unable to load tracking.");

    }

}

loadTracking();