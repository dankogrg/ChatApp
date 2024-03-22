const chatDisplay = document.querySelector("#chatdisplay");
const chatInput = document.querySelector("#chatinput");
const message = document.querySelector("#message");
const button = document.querySelector("#button");
const userModal = document.querySelector("#usermodal");
const userName = document.querySelector("#username");
const userModalObj = new bootstrap.Modal(userModal, {});

let user;

userModal.addEventListener("submit", handleUser);
message.addEventListener("keyup", handleinput);
button.addEventListener("click", handleinput);

function handleUser(e) {
    e.preventDefault();
    user = userName.value;

    userModalObj.hide();
}

function handleinput(e) {
    e.preventDefault();
    if (e.key != "Enter" && e.key != undefined) {
        return;
    }
    console.log(message.value);

    const div = document.createElement("div");
    div.className = "divclass";

    div.innerHTML = `<p>${user}: ${message.value}</p>`;
    chatDisplay.append(div);
    chatInput.reset();
}

window.addEventListener("load", () => {
    userModalObj.show();
});
