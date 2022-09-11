const fs = require('fs');
const path = require('path');

const getPos = (request) => {
  let { range } = request.headers;

  if (!range) {
    range = 'bytes=0-';
  }

  const positions = range.replace(/bytes=/, '').split('-');

  return positions;
};

const getStream = (response, file, positions, stats, type) => {
  let start = parseInt(positions[0], 10);

  const total = stats.size;
  const end = positions[1] ? parseInt(positions[1], 10) : total - 1;

  if (start > end) {
    start = end - 1;
  }

  const chunksize = (end - start) + 1;

  response.writeHead(206, {
    'Content-Range': `bytes ${start}-${end}/${total}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunksize,
    'Content-Type': type,
  });

  // File Response
  const stream = fs.createReadStream(file, { start, end });

  stream.on('open', () => {
    stream.pipe(response);
  });

  stream.on('error', (streamErr) => {
    response.end(streamErr);
  });

  return stream;
};

const getParty = (request, response) => {
  const file = path.resolve(__dirname, '../client/party.mp4');

  fs.stat(file, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        response.writeHead(404);
      }
      return response.end(err);
    }

    const positions = getPos(request);

    const stream = getStream(response, file, positions, stats, 'video/mp4');

    return stream;
  });
};

const getBling = (request, response) => {
  const file = path.resolve(__dirname, '../client/bling.mp3');

  fs.stat(file, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        response.writeHead(404);
      }
      return response.end(err);
    }

    const positions = getPos(request);

    const stream = getStream(response, file, positions, stats, 'audio/mpeg');

    return stream;
  });
};

const getBird = (request, response) => {
    const file = path.resolve(__dirname, '../client/bird.mp4');

    fs.stat(file, (err, stats)=> {
        if(err) {
            if (err.code === 'ENOENT') {
                response.writeHead(404);
            }
            return response.end(err);
        } 

        const positions = getPos(request);

        const stream = getStream(response, file, positions, stats, 'video/mp4');
    
        return stream;
    });
};

module.exports.getParty = getParty;
module.exports.getBling = getBling;
module.exports.getBird = getBird;