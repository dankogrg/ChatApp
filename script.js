const chatDisplay = document.querySelector("#chatdisplay");
const chatInput = document.querySelector("#chatinput");
const message = document.querySelector("#message");
const button = document.querySelector("#button");
const color = document.querySelector("#color");
const userModal = document.querySelector("#usermodal");
const userName = document.querySelector("#username");
const userModalObj = new bootstrap.Modal(userModal, {});

let y = 0;
let user;
let userColor;
let chat = {
    chatLines: [],
};

userModal.addEventListener("submit", handleUser);
message.addEventListener("keyup", handleinput);
button.addEventListener("click", handleinput);

onChatLoad();
function onChatLoad() {
    const records = localStorage.getItem("chat");
    if (records) {
        chat = JSON.parse(records);
        chat.chatLines.forEach((chatMessage) => {
            addToChatLog(
                chatMessage.user,
                chatMessage.color,
                chatMessage.message,
                chatMessage.classNam
            );
        });
    } else {
        window.addEventListener("load", () => {
            userModalObj.show();
            userModal.addEventListener("shown.bs.modal", function () {
                userName.focus();
            });
        });
    }
}

function handleUser(e) {
    e.preventDefault();

    chat.user = userName.value;
    chat.userColor = color.value;
    chat.counter = 0;

    userModalObj.hide();
    message.focus();
}

function addToChatLog(user, color, message, classNam) {
    const div = document.createElement("div");

    div.className = classNam;
    div.innerHTML = `<p style="text-align:right"><small><u>${user}:</u></small></br>${message}</p>`;
    div.style.backgroundImage = `linear-gradient(#ffffff, ${color}) `;
    chatDisplay.prepend(div);
}

function insertFakeUser() {
    x = Math.random() >= 0.3;
    console.log(x);

    if (x) {
        const fakeChatLine = {};
        fakeChatLine.user = "John";
        fakeChatLine.classNam = "fakedivclass";
        fakeChatLine.color = "#ff0000";
        fakeChatLine.message = `message ${chat.counter} `;
        chat.counter++;
        const fakeDiv = document.createElement("div");
        fakeDiv.className = "spinnerclass spinner-border";
        chatDisplay.prepend(fakeDiv);
        setTimeout(() => {
            fakeDiv.className = fakeChatLine.classNam;
            fakeDiv.innerHTML = `<p style="text-align:right"><small><u>${fakeChatLine.user}</u></small></br>${fakeChatLine.message}</p>`;
            fakeDiv.style.backgroundImage = `linear-gradient(#ffffff, ${fakeChatLine.color})`;

            chatDisplay.prepend(fakeDiv);
        }, Math.floor(Math.random() * 3 * 1000));

        chat.chatLines.push(fakeChatLine);
        return chat;
    }
}

function handleinput(e) {
    e.preventDefault();
    if (e.key != "Enter" && e.key != undefined) {
        return;
    }
    if (!message.value.trim()) {
        return;
    }
    const chatLine = {};
    chatLine.user = chat.user;
    chatLine.classNam = "divclass";
    chatLine.color = chat.userColor;
    chatLine.message = message.value;
    chat.chatLines.push(chatLine);
    addToChatLog(
        chatLine.user,
        chatLine.color,
        message.value,
        chatLine.classNam
    );
    insertFakeUser();
    localStorage.setItem("chat", JSON.stringify(chat));
    chatInput.reset();
}
