import { RetellWebClient } from "../../js/retell-client-js-sdk/dist/index.js";

document.addEventListener("DOMContentLoaded", function () {
  const retellClient = new RetellWebClient();
  const micSelect = document.getElementById("micSelect");
  const speakerSelect = document.getElementById("speakerSelect");
  const callButton = document.getElementById("callButton");
  const errorMessage = document.getElementById("errorMessage");

  let callStatus = "idle";

  // Initialize audio devices
  async function initializeDevices() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();

      const audioInputs = devices.filter(
        (device) => device.kind === "audioinput"
      );
      const audioOutputs = devices.filter(
        (device) => device.kind === "audiooutput"
      );

      // Populate microphone options
      audioInputs.forEach((device) => {
        const option = document.createElement("option");
        option.value = device.deviceId;
        option.text = device.label || `Microphone ${device.deviceId}`;
        micSelect.appendChild(option);
      });

      // Populate speaker options
      audioOutputs.forEach((device) => {
        const option = document.createElement("option");
        option.value = device.deviceId;
        option.text = device.label || `Speaker ${device.deviceId}`;
        speakerSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Error getting devices:", error);
    }
  }

  async function startCall() {
    try {
      updateCallStatus("connecting");

      const response = await fetch("/api/webcall/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.success) {
        await retellClient.startCall({
          accessToken: data.accessToken,
          sampleRate: 24000,
          captureDeviceId: micSelect.value,
          playbackDeviceId: speakerSelect.value,
        });
        updateCallStatus("connected");
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error starting call:", error);
      updateCallStatus("error");
    }
  }

  async function endCall() {
    try {
      await retellClient.endCall();
      updateCallStatus("idle");
    } catch (error) {
      console.error("Error ending call:", error);
    }
  }

  function updateCallStatus(status) {
    callStatus = status;
    errorMessage.classList.toggle("hidden", status !== "error");

    switch (status) {
      case "idle":
        callButton.textContent = "Start Call";
        callButton.className =
          "bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2";
        callButton.disabled = false;
        break;
      case "connecting":
        callButton.textContent = "Connecting...";
        callButton.className =
          "bg-gray-400 text-white px-6 py-2 rounded-md cursor-not-allowed";
        callButton.disabled = true;
        break;
      case "connected":
        callButton.textContent = "End Call";
        callButton.className =
          "bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2";
        callButton.disabled = false;
        break;
    }
  }

  // Event Listeners
  callButton.addEventListener("click", () => {
    if (callStatus === "idle") {
      startCall();
    } else if (callStatus === "connected") {
      endCall();
    }
  });

  // Initialize
  initializeDevices();
});
