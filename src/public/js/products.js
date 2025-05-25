console.log("Products frontend javascript file");


$(function () {
    $(".product-collection").on("change", () => {
        const selectedValue = $(".product-collection").val();
        if (selectedValue === "DRINK") {
            $("#product-collection").hide();
            $("#product-volume").show();
        } else {
            $("#product-volume").hide();
            $("#product-collection").show();
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

$(".new-product-status").on("change", async function(e) {
    const id = e.target.id;
    const productStatus = $(`#${id}.new-product-status`).val();

    try {
        const response = await axios.post(`/admin/product/${id}`, {productStatus: productStatus});

        const result = response.data;
        if(result.data) {
            console.log("product updated!");
            $(".new-product-status").blur();
            
        }else {
            alert ("Product update failed");
        }
    } catch (err) {
        console.log( err );
        alert("product update failed");
        
    }

})

});


function validateForm() {
    const productName = $(".product-name").val();
    const productPrice = $(".product-price").val();
    const productLeftCount = $(".product-left-count").val();
    const productCollection = $(".product-collection").val();
    const productDesc = $(".product-desc").val();
    const productStatus = $(".product-status").val();


    if (
        productName == "" ||
        productPrice == "" ||
        productLeftCount == "" ||
        productCollection == "" ||
        productDesc == "" ||
        productStatus == ""
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