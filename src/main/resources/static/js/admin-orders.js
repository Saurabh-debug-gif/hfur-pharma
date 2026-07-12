const API="http://https://hfur-pharma-1.onrender.com/api/admin/orders";

const token=localStorage.getItem("token");

const table=document.getElementById("orderTable");

async function loadOrders(){

    const response=await axios.get(

        API,

        {

            headers:{

                Authorization:"Bearer "+token

            }

        }

    );

    render(response.data);

}

function render(orders){

    table.innerHTML="";

    orders.forEach(order=>{

        table.innerHTML+=`

<tr>

<td>${order.id}</td>

<td>${order.user.name}</td>

<td>₹${order.totalAmount}</td>

<td>

<span class="badge bg-success">

${order.status}

</span>

</td>

<td>

${order.createdAt}

</td>

<td>

<select

class="form-select"

onchange="changeStatus(${order.id},this.value)">

<option value="">Update</option>

<option value="CONFIRMED">CONFIRMED</option>

<option value="DISPATCHED">DISPATCHED</option>

<option value="DELIVERED">DELIVERED</option>

</select>

</td>

</tr>

`;

    });

}

async function changeStatus(id,status){

    if(status==="") return;

    await axios.put(

        API+"/"+id+"/status?status="+status,

        {},

        {

            headers:{

                Authorization:"Bearer "+token

            }

        }

    );

    loadOrders();

}

loadOrders();