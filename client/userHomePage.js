async function loadUser(){

    const id = new URLSearchParams(window.location.search).get("id");

    const token = localStorage.getItem("token");


    try{

        const response = await fetch(`/api/user/user/${id}`,{

            method:"GET",

            headers:{
                Authorization:`Bearer ${token}`
            }

        });


        const result = await response.json();


        if(result.status){


            // Name in header
            document.getElementById("userName").innerText =
            result.data.name;



            // Profile form
            document.getElementById("name").value =
            result.data.name;


            document.getElementById("email").value =
            result.data.email;


            document.getElementById("password").value="";



            // Show profile image
            if(result.data.profile_image){


                const imagePath =
                `/uploads/${result.data.profile_image}`;


                // Header icon image
                document.getElementById("headerProfileImage").src =
                imagePath;



                // Profile card image
                document.getElementById("profileImage").src =
                imagePath;


            }


        }


    }catch(error){

        console.log(error);

    }

}





function toggleProfile(){


    const card =
    document.getElementById("profileCard");


    if(card.style.display==="block"){

        card.style.display="none";

    }
    else{

        card.style.display="block";

    }


}







function enableEdit(){


    document.getElementById("name").disabled=false;

    document.getElementById("email").disabled=false;

    document.getElementById("password").disabled=false;


}









// Update Name + Email + Password
async function updateProfile(){


    const id =
    new URLSearchParams(window.location.search).get("id");


    const token =
    localStorage.getItem("token");



    const name =
    document.getElementById("name").value;


    const email =
    document.getElementById("email").value;


    const password =
    document.getElementById("password").value;



    try{


        const response = await fetch(`/api/user/update-profile/${id}`,{


            method:"PUT",


            headers:{


                "Content-Type":"application/json",

                Authorization:`Bearer ${token}`


            },


            body:JSON.stringify({

                name,
                email,
                password

            })


        });



        const result =
        await response.json();



        alert(result.message);



        if(result.status){


            document.getElementById("password").value="";


            document.getElementById("name").disabled=true;


            document.getElementById("email").disabled=true;


            document.getElementById("password").disabled=true;


            loadUser();


        }



    }catch(error){

        console.log(error);

        alert("Profile update failed");

    }


}








// Upload Profile Image
async function uploadProfileImage(){


    const id =
    new URLSearchParams(window.location.search).get("id");


    const token =
    localStorage.getItem("token");



    const file =
    document.getElementById("photo").files[0];



    if(!file){

        alert("Please select image");

        return;

    }



    const formData = new FormData();


    formData.append("photo",file);





    try{


        const response = await fetch(`/api/user/update-profile-image/${id}`,{


            method:"PUT",


            headers:{


                Authorization:`Bearer ${token}`


            },


            body:formData


        });




        const result =
        await response.json();



        alert(result.message);



        if(result.status){


            document.getElementById("profileImage").src =
            "/uploads/" + result.data.profile_image;


        }



    }catch(error){


        console.log(error);

        alert("Image upload failed");


    }


}








// Image Preview
document.getElementById("photo").addEventListener("change",function(){


    const file=this.files[0];


    if(file){


        document.getElementById("profileImage").src =
        URL.createObjectURL(file);


    }


});








function logout(){


    const confirmLogout =
    confirm("Are you sure you want to logout?");


    if(!confirmLogout) return;



    localStorage.removeItem("token");

    localStorage.removeItem("user");



    window.location.href="login.html";


}






loadUser();