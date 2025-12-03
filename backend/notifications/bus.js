// Simple in-memory SSE notification bus

const clients = new Set();

function addClient(res) {
  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  // Allow CORS for EventSource
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Send initial comment to establish stream
  res.write(': connected\n\n');

  clients.add(res);

  // Heartbeat to keep connection alive
  const interval = setInterval(() => {
    try {
      res.write(': ping\n\n');
    } catch (e) {
      // Ignore write errors; client will be removed on close
    }
  }, 15000);

  // Remove client on close
  res.on('close', () => {
    clearInterval(interval);
    clients.delete(res);
  });
}

function broadcast(event, data) {
  const payload = `event: ${event}\n` + `data: ${JSON.stringify(data)}\n\n`;
  for (const res of clients) {
    try {
      res.write(payload);
    } catch (e) {
      // If write fails, drop client
      clients.delete(res);
    }
  }
}

module.exports = { addClient, broadcast };
