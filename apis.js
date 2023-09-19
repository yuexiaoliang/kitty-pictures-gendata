const http = require('./http');

const getCompletion = (messages) => {
  const systemContent = `你回答的内容不能包含反动、色情、违法等不良内容。`;

  return http.post('/v1/chat/completions', {
    messages: [{ role: 'system', content: systemContent }, ...messages],
    model: 'gpt-3.5-turbo',
    stream: false
  });
};

function genImages(prompt, n = 1) {
  return http.post(`/v1/images/generations`, {
    prompt,
    n,
    response_format: 'b64_json'
  });
}

module.exports = {
  getCompletion,
  genImages
};
