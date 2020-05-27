#!/bin/bash

echo "Removing node_modules..."
rm -rf node_modules/
echo -e "Done\n"

echo "Removing locks..."
rm -f package-lock.json && rm -f yarn.lock
echo -e "Done\n"

#echo "Verifying npm cache..."
#npm cache verify
#echo -e "Done\n"

echo "Installing dependencies..."
npm install
echo -e "Done\n"

