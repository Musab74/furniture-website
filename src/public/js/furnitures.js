console.log("Furnitures frontend javascript file");


$(function () {
    $(".furniture-collection").on("change", () => {
        const selectedValue = $(".furniture-collection").val();
        if (selectedValue === "DRINK") {
            $("#furniture-collection").hide();
            $("#furniture-capacity").show();
        } else {
            $("#furniture-volume").hide();
            $("#furniture-collection").show();
        }
    });

$("#process-btn").on("click", () => {
    $(".dish-container").slideToggle(500);
    $("#process-btn").css("display", "none")
});

$("#cancel-btn").on("click", () => {
    $(".dish-container").slideToggle(100);
    $("#process-btn").css("display", "flex")
});

$(".new-furniture-status").on("change", async function(e) {
    const id = e.target.id;
    const furnitureStatus = $(`#${id}.new-furniture-status`).val();

    try {
        const response = await axios.post(`/admin/furniture/${id}`, {furnitureStatus: furnitureStatus});

        const result = response.data;
        if(result.data) {
            console.log("furniture updated!");
            $(".new-furniture-status").blur();
            
        }else {
            alert ("furniture update failed");
        }
    } catch (err) {
        console.log( err );
        alert("furniture update failed");
        
    }

})

});


function validateForm() {
    const furnitureName = $(".furniture-name").val();
    const furniturePrice = $(".furniture-price").val();
    const furnitureLeftCount = $(".furniture-left-count").val();
    const furnitureCollection = $(".furniture-collection").val();
    const furnitureDesc = $(".furniture-desc").val();
    const furnitureStatus = $(".furniture-status").val();


    if (
        furnitureName == "" ||
        furniturePrice == "" ||
        furnitureLeftCount == "" ||
        furnitureCollection == "" ||
        furnitureDesc == "" ||
        furnitureStatus == ""
    ) {
        alert("Please insert all required credentials");
        return false;
    } else return true;

}

function previewFileHandler(input, order) {
    const imgClassName = input.className;
   

    const file = $(`.${imgClassName}`).get(0).files[0]; //gives detail infos about the file 
    console.log("file:", file);
    
    const fileType = file["type"];
   
    
    const validImageType = ["image/jpg", "image/jpeg", "image/png"]; //mime type

    if (!validImageType.includes(fileType)) {
        alert("Please insert only the following image file types: .jpg, .jpeg, .png");
    } else {
        if (file) {
            let reader = new FileReader();
          
            
            reader.onload = function () {
                $(`#image-section-${order}`).attr("src", reader.result)
            
                
            }
            reader.readAsDataURL(file);
           
        }
    }

}