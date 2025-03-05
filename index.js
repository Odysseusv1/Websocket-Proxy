const WebSocket = require('ws');

// Create a proxy server that listens on port 3000
const proxyServer = new WebSocket.Server({ port: 3000 });

// Create a connection to the target WebSocket server
function createTargetConnection(targetUrl) {
  return new WebSocket(targetUrl);
}

proxyServer.on('connection', (clientWs) => {
  console.log('Client connected to proxy');

  // Connect to target server (example using echo server)
  const targetWs = createTargetConnection('wss://echo.websocket.org');

  targetWs.on('open', () => {
    console.log('Connected to target server');

    // Forward messages from client to target
    clientWs.on('message', (data) => {
      console.log('Forwarding message to target:', data.toString());
      targetWs.send(data);
    });

    // Forward messages from target to client
    targetWs.on('message', (data) => {
      console.log('Forwarding message to client:', data.toString());
      clientWs.send(data);
    });
  });

  // Handle client disconnection
  clientWs.on('close', () => {
    console.log('Client disconnected');
    targetWs.close();
  });

  // Handle target disconnection
  targetWs.on('close', () => {
    console.log('Target disconnected');
    clientWs.close();
  });

  // Handle errors
  clientWs.on('error', (error) => {
    console.error('Client error:', error);
    targetWs.close();
  });

  targetWs.on('error', (error) => {
    console.error('Target error:', error);
    clientWs.close();
  });
});

console.log('WebSocket proxy server running on ws://localhost:3000');
