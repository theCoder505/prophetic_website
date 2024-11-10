import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:5000'); // Ensure this matches your signaling server

function LiveStream() {
  const [isHost, setIsHost] = useState(false);
  const videoRef = useRef(null);
  const peerConnection = useRef(null);

  useEffect(() => {
    // Initialize WebRTC Peer Connection
    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    // Event handlers for ICE candidates
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('Sending ICE candidate:', event.candidate);
        socket.emit('ice-candidate', { candidate: event.candidate });
      }
    };

    // Clean up peer connection on component unmount
    return () => {
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  }, []);

  const startBroadcast = async () => {
    setIsHost(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoRef.current.srcObject = stream;

      stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      socket.emit('broadcast', { sdp: offer });
    } catch (error) {
      console.error('Error starting broadcast:', error);
    }
  };

  const joinBroadcast = () => {
    setIsHost(false);
    console.log('Asking to join broadcast!');

    // Listen for broadcast offer from the host
    socket.on('broadcast', async ({ sdp }) => {
      console.log('Received broadcast offer:', sdp);
      if (sdp) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(sdp));
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        console.log('Sending answer:', answer);
        socket.emit('answer', { sdp: answer });
      }
    });

    // Listen for ICE candidates
    socket.on('ice-candidate', ({ candidate }) => {
      console.log('Received ICE candidate');
      if (candidate) {
        peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate))
          .catch(error => console.error('Error adding received ICE candidate:', error));
      }
    });

    // When a track is received, display the stream
    peerConnection.current.ontrack = (event) => {
      console.log('Received remote track', event.streams[0]);
      if (videoRef.current) {
        console.log('Setting video srcObject to received stream');
        videoRef.current.srcObject = event.streams[0]; // Update videoRef to show the stream
      } else {
        console.error('videoRef is null');
      }
    };
  };

  return (
    <div className='p-10'>
      <h2 className='text-3xl text-center text-black font-bold mb-5'>
        {isHost ? 'You are broadcasting' : 'You are viewing the broadcast'}
      </h2>
      <div className="flex justify-between mb-5">
        <button
          className='bg-slate-500 px-10 py-2 text-white rounded-full'
          onClick={startBroadcast}
          disabled={isHost} // Disable if already broadcasting
        >
          Start Broadcast
        </button>
        <button
          className='bg-slate-500 px-10 py-2 text-white rounded-full'
          onClick={joinBroadcast}
          disabled={isHost} // Disable if already a host
        >
          Join Broadcast
        </button>
      </div>
      <video ref={videoRef} autoPlay playsInline controls={false} className='w-full border-4 border-slate-900' />
    </div>
  );
}

export default LiveStream;
