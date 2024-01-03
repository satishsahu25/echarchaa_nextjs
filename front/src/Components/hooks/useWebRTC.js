import { useCallback, useEffect, useRef, useState } from "react";
import { useStateWithCallback } from "./useStateWithCallback";
import { socketInit } from "../../socket/index";
import { ACTIONS } from "../../actions";
import freeice from "freeice";

export const useWebRTC = (roomId, user) => {
  //all users list
  const [clients, setclients] = useStateWithCallback([]);
  //sabke audio elements which will store socket id
  const audioElements = useRef({});
  const connections = useRef({});
  const localMediaStream = useRef(null);
  const socketref = useRef(null);

  //whenevr page loads it automatically runs
  useEffect(() => {
    //ie here all socket connection info get stored
    socketref.current = socketInit();
  }, []);

  //checks function not to render everytime
  const addNewClients = useCallback(
    (newclient, cb) => {
      //client finding already in list
      const lookingfor = clients.find((client) => client.id === newclient.id);

      if (lookingfor === undefined) {
        //previous state, new element to be added
        setclients((existingClients) => [...existingClients, newclient], cb);
      }
    },
    [clients, setclients]
  );

  //Capture the audio/media
  useEffect(() => {
    const startCapture = async () => {
      //browser has navigator object
      localMediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
    };

    //async function so returns a promise
    startCapture().then(() => {
      addNewClients(user, () => {
        const localElement = audioElements.current[user.id];
        if (localElement) {
          localElement.volume = 0; //to not listen self voice
          //what to pay in srcobject ie our localmedia stream
          localElement.srcObject = localMediaStream.current;
        }

        ///sending to the websocket server: socket emit to JOIN

        socketref.current.emit(ACTIONS.JOIN, { roomId, user });
      });
    });

    return () => {
      //when a user leaves the room
      localMediaStream.current.getTracks().forEach((track) => {
        track.stop();
      });

      socketref.current.emit(ACTIONS.LEAVE, { roomId });
    };
  }, []);

  useEffect(() => {
    //createOffer-who wants to join (boolean)
    const handleNewPeer = async ({ peerId, createOffer, user: remoteUser }) => {
      //if already connectd then give warning
      if (peerId in connections.current) {
        //connections
        return console.warn(
          `You are already connected with ${peerId} (${user.name})`
        );
      }

      connections.current[peerId] = new RTCPeerConnection({
        //ice servers tells to our computer what is Public IP as computer dont know
        //now computer can send its public ip to someone else
        iceServers: freeice(),
      });

      ////handle new ice candidate
      connections.current[peerId].onicecandidate = (event) => {
        //peerId hai uski jisko ice candidate bhejna hai
        socketref.current.emit(ACTIONS.RELAY_ICE, {
          peerId,
          icecandidate: event.candidate,
        });
      };

      //Handle media comings on this connection
      connections.current[peerId].ontrack = ({ streams: [remoteStream] }) => {
        addNewClients(remoteUser, () => {
          //remote user ko addkariya then callback
          if (audioElements.current[remoteUser.id]) {
            //checking uske liye audio element bna hai ki nahi
            audioElements.current[remoteUser.id].srcObject = remoteStream;
          } else {
            let settled = false;
            const interval = setInterval(() => {
              //interval taki jab tak dom render ho
              //hum mic aya ki nahi scan kar rahe hai
              if (audioElements.current[remoteUser.id]) {
                //checking uske liye audio element bna hai ki nahi
                audioElements.current[remoteUser.id].srcObject = remoteStream;
                settled = true;
              }

              //ab settle hogaya toh stop interval
              if (settled) clearInterval(interval);
            }, 1000);
          }
        });
      };

      //Adding localtrack to remote connections (so that our voice reach to them)
      localMediaStream.current.getTracks().forEach((track) => {
        connections.current[peerId].addTrack(track, localMediaStream.current);
      });

      //creating  offer if createOffer true
      if (createOffer) {
        const offer = connections.current[peerId].createOffer();

        connections.current[peerId].setLocalDescription(offer);

        //send offer to other clients vi server then after this browser to browser connection will establish
        socketref.current.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: offer,
        });
      }
    };

    socketref.current.on(ACTIONS.ADD_PEER, handleNewPeer);

    //cleaning function
    return () => {
      socketref.current.off(ACTIONS.ADD_PEER);
    };
  }, []);

  //HANDLEING ICE CANDIDATE
  useEffect(() => {
    socketref.current.on(ACTIONS.ICE_CANDIDATE, ({ peerId, icecandidate }) => {
      if (icecandidate) {
        connections.current[peerId].addIceCandidate(icecandidate);
      }
    });

    return () => {
      socketref.current.off(ACTIONS.ICE_CANDIDATE);
    };
  }, []);

  //HANDLING SDP

  useEffect(() => {
    const handleremoteDescription = async ({
      peerId,
      sessionDescription: remotesessionDescription,
    }) => {
      connections.current[peerId].setRemoteDescription(
        remotesessionDescription
      );

      //if session description is type of offer then we create answer
      if (remotesessionDescription.type === "offer") {
        const connection = connections.current[peerId];
        const answer = await connection.createAnswer();
        connection.setLocalDescription(answer);

        socketref.current.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: answer,
        });
      }
    };

    socketref.current.on(ACTIONS.SESSION_DESCRIPTION, handleremoteDescription);

    return () => {
      socketref.current.off(ACTIONS.SESSION_DESCRIPTION);
    };
  }, []);

  //Handle remove peer

  useEffect(() => {
    const handleremovePeer = async ({ peerId, userId }) => {
      if (connections.current[peerId]) {
        connections.current[peerId].close();
      }

      delete connections.current[peerId];
      delete audioElements.current[peerId];
      setclients((list) => list.filter((client) => client.id !== userId));
    };

    socketref.current.on(ACTIONS.REMOVE_PEER, handleremovePeer);

    return () => {
      socketref.current.off(ACTIONS.REMOVE_PEER);
    };
  }, []);

  //receiving the mic instance and client id from room
  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance;
  };

  //exporting provideref so that it bceomes importable in rooms file
  return { clients, provideRef };
};
