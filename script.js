const chatDisplay = document.querySelector("#chatdisplay");
const chatInput = document.querySelector("#chatinput");
const message = document.querySelector("#message");
const button = document.querySelector("#button");
const color = document.querySelector("#color");
const userModal = document.querySelector("#usermodal");
const userName = document.querySelector("#username");
const userModalObj = new bootstrap.Modal(userModal, {});

let user;
let chat = {
    chatLog: [],
};

userModal.addEventListener("submit", handleUser);
message.addEventListener("keyup", handleinput);
button.addEventListener("click", handleinput);

onCahtLoad();
function onCahtLoad() {
    const records = localStorage.getItem("chat");
    if (records) {
        chat = JSON.parse(records);
        chat.chatLog.forEach((chatMessage) => {
            addToChatLog(chat.user, chat.color, chatMessage);
        });
    } else {
        window.addEventListener("load", () => {
            userModalObj.show();
        });
    }
}

function handleUser(e) {
    e.preventDefault();

    chat.user = userName.value;
    chat.color = color.value;
    userModalObj.hide();
}

function addToChatLog(user, color, message) {
    const div = document.createElement("div");
    div.className = "divclass";

    div.innerHTML = `<p>${user}: ${message}</p>`;
    div.style.backgroundColor = color;
    chatDisplay.append(div);
    chatInput.reset();
}

function handleinput(e) {
    e.preventDefault();
    if (e.key != "Enter" && e.key != undefined) {
        return;
    }

    chat.chatLog.push(message.value);
    console.log(chat);
    localStorage.setItem("chat", JSON.stringify(chat));
    addToChatLog(chat.user, chat.color, message.value);
}
