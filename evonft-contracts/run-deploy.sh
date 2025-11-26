#!/bin/bash
cd "$(dirname "$0")"
npx hardhat run deploy-simple.js --network amoy
