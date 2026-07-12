const token = localStorage.getItem("token");

const mrId = window.location.pathname.split("/").pop();

const API = "https://hfur-pharma-1.onrender.com/api/admin/visits/" + mrId;

const table = document.getElementById("visitTable");

async function loadVisits(){

    try{

        const response = await axios.get(

            API,

            {

                headers:{

                    Authorization:"Bearer " + token

                }

            }

        );

        table.innerHTML="";

        response.data.forEach(v=>{

            table.innerHTML+=`

            <tr>

            <td>${v.shopName}</td>

            <td>${v.notes}</td>

            <td>${v.timestamp}</td>

            </tr>

            `;

        });

    }

    catch(e){

        console.log(e);

    }

}

loadVisits();