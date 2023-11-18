# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

# Setup and usage

## Metamask

* Add new network
* Network Name: Localhost
* New RPC URL: http://localhost:8545
* Chain ID: 5
* Currency symbol: ETH

## Infura

* Create new API key
* Select IPFS
* Enable dedicated gateway and give it a unique name

Implementation in NFTContext.js: 

```javascript
const infuraKey = '<API_KEY>';
const projectSecret = '<PROJECT_SECRET>';
const auth = `Basic ${Buffer.from(`${infuraKey}:${projectSecret}`).toString('base64')}`;

const ipfs = createClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },

  const uploadToIPFS = async (file) => {
    try {
      const added = await client.add({ content: file });

      // Example url
      return `https://someurl-nft-marketplace.infura-ipfs.io/ipfs/${added.path}`;
    } catch (error) {
      console.log('Error uploading file');
    }
  },
});
```

## Store API keys

Create an .env file to store api keys and secret keys. Next.js comes with built-in support for environment variables.

Example:

```javascript
// .env
API_KEY=abcd
SECRET_KEY=efgh
```

```javascript
// index.js
export async function getStaticProps() {
  const db = await myDB.connect({
    key: process.env.API_KEY,
    secret: process.env.SECRET_KEY,
  })
  // ...
}
```

## Ether v5 vs v6 (I'm using v6)

Read about the differences here: https://docs.ethers.org/v6/migrating/#migrate-utils

