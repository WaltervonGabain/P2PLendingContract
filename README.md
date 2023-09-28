# SmartContract

A Zigurat Blockchain project for Module 9

## Installation

```sh
# Install Truffle
$ npm install -g truffle

# Install OpenZeppelin
$ npm install -g @openzeppelin/contracts
```

Start the ganache cli

```sh
$ npm install -g ganache-cli
$ ganache-cli
```

Compile truffle for testing & abi

```sh
$ truffle compile
```

Migrate truffle

```sh
$ truffle migrate
```

Run the test suite

```sh
$ truffle test
```

## FAQ

- **How do I use this with Ganache (or any other network)?**

  The Truffle project is set to deploy to Ganache by default. If you'd like to change this, it's as easy as modifying the Truffle config file! Check out [our documentation on adding network configurations](https://trufflesuite.com/docs/truffle/reference/configuration/#networks). From there, you can run `truffle migrate` pointed to another network, restart the React dev server, and see the change take place.


- **Where can I find more resources?**

  This Box is a sweet combo of [Truffle](https://trufflesuite.com) and [Webpack](https://webpack.js.org). Either one would be a great place to start!

