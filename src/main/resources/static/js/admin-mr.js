const API="https://hfur-pharma-1.onrender.com/api/admin/mr";

const token=localStorage.getItem("token");

const table=document.getElementById("mrTable");

const form=document.getElementById("mrForm");

async function loadMRs(){

    const response=await axios.get(

        API,

        {

            headers:{

                Authorization:"Bearer "+token

            }

        }

    );

    table.innerHTML="";

    response.data.forEach(mr=>{

        table.innerHTML+=`

<tr>

<td>${mr.name}</td>

<td>${mr.email}</td>

<td>${mr.area??"-"}</td>

<td>

<a

href="/admin/visits/${mr.id}"

class="btn btn-primary btn-sm">

Visits

</a>

</td>

<td>

<a

href="/admin/tracking/${mr.id}"

class="btn btn-success btn-sm">

Track

</a>

</td>

</tr>

`;

    });

}

form.addEventListener("submit",async e=>{

    e.preventDefault();

    const data={

        name:mrName.value,

        email:mrEmail.value,

        password:mrPassword.value,

        area:mrArea.value

    };

    await axios.post(

        API+"/create",

        data,

        {

            headers:{

                Authorization:"Bearer "+token

            }

        }

    );

    bootstrap.Modal.getInstance(

        document.getElementById("mrModal")

    ).hide();

    form.reset();

    loadMRs();

});

loadMRs();