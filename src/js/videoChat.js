import customAxios from "./axios";
import { io } from "socket.io-client";

let userData;

async function soketIoFn() {
  const data = await customAxios.get("/auth/getUserById");
  userData = data.data.data;
  const password = "xsalom";
  const socket = io("https://backend.lingostep.uz/video", {
    auth: {
      password: password,
      userId: data.data.data.id,
    },
  });

  return socket;
}
let pendingCandidates = [];

let socket;
const userList = document.querySelector("#userList");
const localVideoEl = document.querySelector("#local-video");
const remoteVideoEl = document.querySelector("#remote-video");
const hangupBtn = document.querySelector("#hangup");
const noneAvailable = document.querySelector(".none-available");

let localStream;
let remoteStream;
let peerConnection;
let didOfer = false;

let peerConfiguretion = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"],
    },
  ],
};

document.addEventListener("DOMContentLoaded", async () => {
  socket = await soketIoFn();

  const observer = new MutationObserver(() => {
    if (userList.children.length === 0) {
      noneAvailable.textContent = "None available";
    } else {
      noneAvailable.textContent = "";
    }
  });

  observer.observe(userList, {
    childList: true,
  });

  if (userList.children.length === 0) {
    noneAvailable.textContent = "None available";
  }

  const call = async (e) => {
    await fetchUserMedia();
    await createPeerConnection();

    try {
      const offer = await peerConnection.createOffer();
      peerConnection.setLocalDescription(offer);
      didOfer = true;
      socket.emit("newOffer", offer);
    } catch (error) {
      console.log(error);
    }
  };

  const answerOffer = async (offerObj) => {
    await fetchUserMedia();
    await createPeerConnection(offerObj);

    userList.style.display = "none";
    
    const answer = await peerConnection.createAnswer({});
    await peerConnection.setLocalDescription(answer);

    offerObj.answer = answer;

    const divs = userList.querySelectorAll("div");
    divs.forEach((div) => {
      div.remove();
    });

    const offerIceCandidates = await socket.emitWithAck("newAnswer", offerObj);
    offerIceCandidates.forEach((c) => {
      peerConnection.addIceCandidate(c);
    });
  };

const addAnswer = async (offerObj) => {
  if (!peerConnection) return;

  if (!peerConnection.currentRemoteDescription) {
    try {
      await peerConnection.setRemoteDescription(offerObj.answer);
    } catch (error) {
      console.error("setRemoteDescription xatoligi:", error);
      return;
    }
  }

  if (pendingCandidates.length > 0) {
    pendingCandidates.forEach(async (c) => {
      try {
        await peerConnection.addIceCandidate(c);
      } catch (err) {
        console.error("Buffered ICE qo‘shishda xato:", err);
      }
    });
    pendingCandidates = [];
  }

  // UI tozalash
  const divs = userList.querySelectorAll("div");
  divs.forEach((div) => div.remove());
};


  const createPeerConnection = (offerObj) => {
    return new Promise(async (resolve, reject) => {
      peerConnection = await new RTCPeerConnection(peerConfiguretion);
      remoteStream = new MediaStream();
      remoteVideoEl.srcObject = remoteStream;

      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });

      peerConnection.addEventListener("icecandidate", (e) => {
        if (e.candidate) {
          socket.emit("sendIceCandidateToSignalingServer", {
            iceCandidate: e.candidate,
            iceUsername: userData.username,
            didOfer,
          });
        }
      });

      peerConnection.addEventListener("track", (e) => {
        console.log("Got a track from the other peer!! How excting");
        e.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track, remoteStream);
          console.log("Here's an exciting moment... fingers cross");
        });
      });

      if (offerObj) {
        await peerConnection.setRemoteDescription(offerObj.offer);
      }

      resolve();
    });
  };

  const fetchUserMedia = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        localVideoEl.srcObject = stream;
        localStream = stream;
        resolve();
      } catch (error) {
        reject();
      }
    });
  };

const addNewIceCandidate = async (iceCandidate) => {
  if (!peerConnection) return;

  if (!peerConnection.remoteDescription) {
    // Qo‘yilmagan bo‘lsa, vaqtincha saqlaymiz
    pendingCandidates.push(iceCandidate);
    return;
  }

  try {
    await peerConnection.addIceCandidate(iceCandidate);
  } catch (error) {
    console.error("ICE qo'shishda xato:", error);
  }
};



  document.querySelector("#call").addEventListener("click", call);

  const hangup = () => {
    if (peerConnection) {
      peerConnection.close();
      peerConnection = null;
    }

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      localVideoEl.srcObject = null;
    }

    if (remoteVideoEl.srcObject) {
      remoteVideoEl.srcObject.getTracks().forEach((track) => track.stop());
      remoteVideoEl.srcObject = null;
    }

    remoteStream = null;
    localStream = null;
    didOfer = false;

    userList.style.display = "block";

    socket.emit("hungUpPhone", { username: userData.username });

    console.log("Connection has been closed");
  };

  hangupBtn.addEventListener("click", hangup);

  socket.on("answerUserHangup", (str) => {
    console.log(str, "keldi va ishladi");
    if (peerConnection) {
      peerConnection.close();
      peerConnection = null;
      userList.style.display = "block";
    }

    if (remoteVideoEl.srcObject) {
      remoteVideoEl.srcObject.getTracks().forEach((track) => track.stop());
      remoteVideoEl.srcObject = null;
    }

    remoteStream = null;
    didOfer = false;
  });

  function disconnectFn(username) {
    const data = document.getElementById(username);
    if (data) {
      document.getElementById(username).remove();
    }
  }

  socket.on("availableOffers", (offers) => {
    createOfferEls(offers);
  });

  socket.on("newOfferAwaiting", (offers) => {
    createOfferEls(offers);
  });

  socket.on("answerResponse", (offerObj) => {
    addAnswer(offerObj);
  });

  socket.on("receivedIceCandidateFromServer", (iceCandidate) => {
    addNewIceCandidate(iceCandidate);
  });

  socket.on("disconnectOffers", (username) => {
    disconnectFn(username);
  });

  socket.on("connectedUsers", (data) => {
    disconnectFn(data.user1);
    disconnectFn(data.user2);
  });

  function createOfferEls(offers) {
    offers.forEach((o) => {
      const newOfferEl = document.createElement("div");
      newOfferEl.id = o.offererUsername;
      newOfferEl.classList.add("user-item", "active");
      newOfferEl.innerHTML = `<img src="${o.offerImgUrl}" alt="User Img" />  <span class="user-name-sidebar">${o.offererUsername}</span>`;
      newOfferEl.addEventListener("click", () => answerOffer(o));
      userList.appendChild(newOfferEl);
    });
  }
});
