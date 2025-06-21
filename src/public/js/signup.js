console.log("SignUp frontend Js file");

$(function () {
    const fileTarget = $(".file-box .upload-hidden");
    let filename;

    fileTarget.on("change", function () {
        if (window.FileReader) {
            const uploadFile = $(this)[0].files[0];
            console.log("uploadFile:", uploadFile);

            const fileType = uploadFile["type"];
            const validImageType = ["image/jpg", "image/jpeg", "image/png"];

            if (!validImageType.includes(fileType)) {
                alert("Please insert only the following image file types: .jpg, .jpeg, .png");
            } else {
                if (uploadFile) {
                    const previewURL = URL.createObjectURL(uploadFile);
                    console.log(previewURL);
                    $(".upload-img-frame").attr("src", previewURL).addClass("success");
                }
                filename = $(this)[0].files[0].name;
            }
            $(this).siblings(".upload-name").val(filename);
        }
    });
});

function validateSignUpForm() {
    const memberNick = $(".member-nick").val();
    const memberPhone = $(".member-phone").val();
    const memberPassword = $(".member-password").val();
    const confirmPassword = $(".confirm-password").val();

    if (
        memberNick == "" ||
        memberPhone == "" ||
        memberPassword == "" ||
        confirmPassword == ""
    ) {
        alert("Please insert all required inputs");
        return false;
    }

    if (memberPassword !== confirmPassword) {
        alert("Password differs, please check!");
        return false;
    }


    const memberImage = $(".member-image").get(0).files[0] ? $(".member-image").get(0).files[0].name :
        null;
    if (!memberImage) {
        alert("Please insert store image first!");
        return false
    }
    return true;
}