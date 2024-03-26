const chatDisplay = document.querySelector("#chatdisplay");
const chatInput = document.querySelector("#chatinput");
const message = document.querySelector("#message");
const button = document.querySelector("#button");
const color = document.querySelector("#color");
const userModal = document.querySelector("#usermodal");
const userName = document.querySelector("#username");
const userModalObj = new bootstrap.Modal(userModal, {});
const membersCount = document.querySelector(".members-count");
const membersList = document.querySelector(".members-list");

let drone;
let chat = {
    messages: [],
};
let members = [];

userModal.addEventListener("submit", handleUser);
message.addEventListener("keyup", handleinput);
button.addEventListener("click", handleinput);

onChatLoad();
function onChatLoad() {
    const records = localStorage.getItem("chat");
    if (records) {
        chat = JSON.parse(records);
        chat.messages.forEach((chatMessage) => {
            addToChatLog(chat.user, chat.userColor, chatMessage);
        });
    }
    window.addEventListener("load", () => {
        userModalObj.show();
        userModal.addEventListener("shown.bs.modal", () => {
            userName.focus();
        });
    });
}

function handleUser(e) {
    e.preventDefault();

    chat.user = userName.value;
    chat.userColor = color.value;

    openScalderone();
    userModalObj.hide();
    message.focus();
}

function openScalderone() {
    drone = new Scaledrone("7e11H1xcHoFAEHQc", {
        data: {
            // Will be sent out as clientData via events
            name: userName.value,
            color: color.value,
        },
    });

    drone.on("open", (error) => {
        if (error) {
            return console.error(error);
        }
        console.log("Successfully connected to Scaledrone");

        const room = drone.subscribe("observable-room");
        room.on("open", (error) => {
            if (error) {
                return console.error(error);
            }
            console.log("Successfully joined room");
        });

        // List of currently online members, emitted once
        room.on("members", (m) => {
            members = m;
            updateMembersDOM();
        });

        room.on("member_join", (member) => {
            members.push(member);
            updateMembersDOM();
        });

        room.on("member_leave", ({ id }) => {
            const index = members.findIndex((member) => member.id === id);
            members.splice(index, 1);
            updateMembersDOM();
        });
        room.on("data", (text, member) => {
            if (member) {
                const { name, color } = member.clientData;
                console.log(member);
                addToChatLog(name, color, text);
            } else {
                console.log("error");
            }
            room.on("message", (message) => {
                const { data, id, timestamp, clientId, member } = message;
                console.log(member);
            });
        });
    });
}

function createMemberElement(member) {
    const { name, color } = member.clientData;

    const el = document.createElement("div");
    el.appendChild(document.createTextNode(name));
    el.className = "divclass";
    el.style.backgroundImage = `linear-gradient(#ffffff, ${color}) `;
    return el;
}

function updateMembersDOM() {
    membersCount.innerText = `${members.length} users in room:`;
    membersList.innerHTML = "";
    members.forEach((member) =>
        membersList.appendChild(createMemberElement(member))
    );
}
function addToChatLog(user, color, message) {
    const div = document.createElement("div");
    if (user == userName.value) {
        div.className = "divclass";
    } else {
        div.className = "reverseclass";
    }

    div.innerHTML = `<p style="text-align:right"><small><u>${user}:</u></small></br>${message}</p>`;
    div.style.backgroundImage = `linear-gradient(#ffffff, ${color}) `;
    chatDisplay.prepend(div);
}

function handleinput(e) {
    e.preventDefault();
    if (e.key != "Enter" && e.key != undefined) {
        return;
    }
    if (!message.value.trim()) {
        return;
    }
    chat.messages.push(message.value);
    drone.publish({
        room: "observable-room",
        message: message.value,
    });

    localStorage.setItem("chat", JSON.stringify(chat));
    chatInput.reset();
}
