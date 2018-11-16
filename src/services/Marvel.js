import md5 from 'md5';

const _baseUrl = 'https://gateway.marvel.com:443/v1/public/';
const _publicKey = '0469fbe0130d1300ace0f23f9abbdb84';
const _privateKey = 'dfff2377fd7e4f9a2cd5c6663c22f9adb6277495';

function getTimestamp() {
  return new Date().getTime();
}

function getApiKey() {
  return { apikey: _publicKey };
}

function getHash(ts) {
  return { hash: md5(ts + _privateKey + _publicKey) };
}

function autentica() {
  let arrAuth = [];
  const ts = getTimestamp();
  arrAuth.push({ ts });
  arrAuth.push(getApiKey());
  arrAuth.push(getHash(ts));

  return arrAuth;
}

function createArgs(filters) {
  let text = '?';
  for(let i = 0; i < filters.length; i++) {
    let key = Object.keys(filters[i]);
    let filter = Object.values(filters[i]);
    text += key + "=" + filter;

    if(i < filters.length -1)
      text += '&';
  }
  return text;
}

function getHeaders() {
  return { 
    headers: new Headers({
      'Content-Type': 'application/json; charset=utf-8'
    })
  };
}

export default class Marvel {
  static getComics(...filters) {
    const route = 'comics';
    filters.push({orderBy: '-issueNumber'},{hasDigitalIssue:true});
    filters.push(...autentica());
    const args = createArgs(filters);

    const url = _baseUrl + route + args;

    return new Promise((resolve, reject) => {
      fetch(url, getHeaders())
        .then(response => {
          return response.json();
        })
        .then(json => {
          if(json.code === 200) 
            resolve(json.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  static comicById(id) {
    const route = `comics/${id}`;
    const args = createArgs(autentica());

    const url = _baseUrl + route + args;
    return new Promise((resolve, reject) => {
      fetch(url, getHeaders())
        .then(response => {
          if(response.status === 404)
            throw new Error('Quadrinho não encontrado.');
          
          if(response.ok) {
            return response.json();
          } else {
            throw new Error('Falha ao consultar o quadrinho.');
          }
        })
        .then(json => resolve(json.data.results[0]))
        .catch(err => reject(err));
    });
  }
}