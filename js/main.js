function setInputError(inputElement, message) {
    inputElement.classList.add("form_input_error");
    // inputElement.parentElement.querySelector(".form_input_error_message").textContent = message;
}

function clearInputError(inputElement) {
    inputElement.classList.remove("form_input_error");
    // inputElement.parentElement.querySelector(".form_input_error_message").textContent = "";
}
var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
var passformat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

document.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll(".form_input").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {
            if (e.target.id === "signupUsername" && e.target.value.length >= 0 && e.target.value.length < 5) {
                setInputError(inputElement, "Username must be at least 5 characters in length");
            }
			
        });
		
		inputElement.addEventListener("blur", e => {
            if(e.target.id === "signupEmail")
			{
				if(e.target.value.match(mailformat))
				{
				}
				else
				{
					setInputError(inputElement, "Invalid E-mail");
				}
			}
			
        });
		
		inputElement.addEventListener("blur", e => {
            if(e.target.id === "signupPassword")
			{
				if(e.target.value.match(passformat))
				{
				}
				else
				{
					setInputError(inputElement, "It must contain 8 to 15 characters that are of at least one number, one special character and one uppercase and lowercase letters");
				}
			}
			
        });
		
		inputElement.addEventListener("blur", e => {
            if(e.target.id === "signupConfirm")
			{
				var pass = document.getElementById("signupPassword").value;
				if(e.target.value === pass)
				{
				}
				else
				{
					setInputError(inputElement, "Password doesn't match");
				}
			}
			
        });

        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        });
		
		
		
	});
});

