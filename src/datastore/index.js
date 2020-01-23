import axios from 'axios';

/**
 * The Datastore connects to Quasar to save and retreive data from IPFS.
 * See the Quasar source here: https://github.com/openworklabs/quasar.
 *
 * @param {Object} [options]
 *        Options
 * @param {string} [options.host]
 *        Your Quasar endpoint.
 */
 export default class Datastore {
  constructor(options) {
    this.host = (options && options.host) || 'http://localhost:3003/api/v0';
  }

  setHost(host) {
    this.host = host;
  }

  // ensures that PinHash events fired at this contract address are picked up by Quasar
  async listenToStorageApp(address) {
    try {
      const response = await axios.post(
        `${this.host}/storageContracts`,
        JSON.stringify({ contractAddress: address }),
        {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      if (!(response.status === 200
        || response.status === 201
        || response.status === 204)
      ) {
        console.error(`Error registering contract with proxyAddress: ${address} with Quasar`)
      }
    } catch (err) {
      console.error(`Error registering contract with proxyAddress: ${address} with Quasar: ${err}`)
    }
  }

  isStorageApp = (appInfo) => appInfo.storage

  /*
    The `add` function accepts blobs or file objects. I.e.:

    const val = new Blob([Buffer.from(JSON.stringify(json))])
    const hash = await api.datastore('add', val).toPromise()

    OR

    const reader = new FileReader()
    reader.onload = async () => {
      const arrayBuffer = reader.result
      const file = new File([arrayBuffer], `photo.jpg`, {
        type: 'text/json;charset=utf-8',
      })
      const hash = await add(file)
    }
  */
  async add(val) {
    const formData = new FormData();
    formData.append('entry', val);

    try {
      const result = await axios.post(`${this.host}/add`, formData);

      return result.data;
    } catch (err) {
      console.error('Error pinning file to IPFS', err);
    }
  }

  /*
    We add files in a couple different ways—JSON blobs and file objects.
    JSON blobs are returned in the data fields.
    Files objects are returned as a readable stream in the body field.
    You can find us using both of these in the open-enterprise repo.
  */
  async cat(hash) {
    try {
      const result = await axios.get(`${this.host}/cat?arg=${hash}`);
      return { data: result.data, body: result.body };
    } catch (err) {
      console.error('Error catting file from IPFS', err);
    }
  }

  // a dag is any javascript object
  async dagPut(dag) {
    try {
      const result = await axios.post(`${this.host}/dag/put`, dag);
      return result.data;
    } catch (err) {
      console.error('Error putting dag to IPFS', err);
    }
  }

  // returns the dag that was passed to dagPut
  async dagGet(hash) {
    try {
      const result = await axios.get(`${this.host}/dag/get?arg=${hash}`);
      return result.data;
    } catch (err) {
      console.error('Error getting dag from IPFS', err);
    }
  }
}
