import md5 from 'md5';

const _baseUrl = 'https://gateway.marvel.com:443/v1/public/';
const _publicKey = '0469fbe0130d1300ace0f23f9abbdb84';
const _privateKey = 'dfff2377fd7e4f9a2cd5c6663c22f9adb6277495';

function _getTimestamp() {
  return new Date().getTime();
}

function _getApiKey() {
  return { apikey: _publicKey };
}

function _getHash(ts) {
  return { hash: md5(ts + _privateKey + _publicKey) };
}

function _autentica() {
  let arrAuth = [];
  const ts = _getTimestamp();
  arrAuth.push({ ts });
  arrAuth.push(_getApiKey());
  arrAuth.push(_getHash(ts));

  return arrAuth;
}

function _createArgs(filters) {
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

export default class Marvel {
  static comics(...filters) {
    const route = 'comics';
    filters.push(..._autentica());
    const args = _createArgs(filters);

    const url = _baseUrl + route + args;

    return new Promise((resolve, reject) => {
      fetch(url, { headers: new Headers({ 'Content-Type': 'application/json; charset=utf-8' }) })
        .then(response => {
          return response.json();
        })
        .then(json => {
          if(json.code === 200) {
            const count = json.data.count;
            const limit =  json.data.limit;
            const offset = json.data.offset;
            const total = json.data.total;
            console.log(`count: ${count} | limit: ${limit} | offset: ${offset} | total: ${total}`);
  
            resolve(json.data.results);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}