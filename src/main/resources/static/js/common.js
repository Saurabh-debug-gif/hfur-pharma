function showToast(message,type="success"){

    const toast=document.getElementById("globalToast");

    const body=document.getElementById("toastBody");

    body.innerHTML=message;

    toast.classList.remove(

        "bg-success",

        "bg-danger",

        "bg-warning"

    );

    if(type==="success"){

        toast.classList.add("bg-success","text-white");

    }

    if(type==="error"){

        toast.classList.add("bg-danger","text-white");

    }

    if(type==="warning"){

        toast.classList.add("bg-warning");

    }

    new bootstrap.Toast(toast).show();

}