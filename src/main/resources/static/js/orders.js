const token = localStorage.getItem("token");

if(!token){

    window.location.href="/login";

}

const API="http://https://hfur-pharma-1.onrender.com/api/customer/orders";

const container=document.getElementById("ordersContainer");

async function loadOrders(){

    try{

        const response=await axios.get(

            API,

            {

                headers:{

                    Authorization:"Bearer "+token

                }

            }

        );

        showOrders(response.data);

    }

    catch(e){

        console.log(e);

    }

}

function showOrders(orders){

    container.innerHTML="";

    if(orders.length===0){

        container.innerHTML=`

<div class="text-center">

<h3>No Orders Found</h3>

<a href="/medicines"

class="btn btn-success mt-3">

Browse Medicines

</a>

</div>

`;

        return;

    }

    orders.forEach(order=>{

        container.innerHTML+=`

<div class="order-card">

<h4>

Order #${order.id}

</h4>

<p class="order-date">

${order.createdAt}

</p>

<h5>

₹${order.totalAmount}

</h5>

<p class="status">

${order.status}

</p>

</div>

`;

    });

}

loadOrders();