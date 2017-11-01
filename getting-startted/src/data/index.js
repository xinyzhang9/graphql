const videoA = {
  id: 'a',
  title: 'videoA',
  duration: 100,
  watched: true
}

const videoB = {
  id: 'b',
  title: 'videoB',
  duration: 200,
  watched: false
}

const videos = [videoA, videoB];

const getVideoById = (id) => new Promise((resolve) => {
  const [video] = videos.filter( v => v.id === id);
  resolve(video);
});

exports.getVideoById = getVideoById;
