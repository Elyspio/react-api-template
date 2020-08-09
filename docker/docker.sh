#!/bin/bash


rm -rdf ../back/build
rm -rdf ../front/build


if [ "$(uname -r | sed -n 's/.*\( *Microsoft *\).*/\1/ip')" = 'microsoft' ]; then
  powershell.exe "cd ../front ; yarn build"
  powershell.exe "cd ../back ; yarn build"
else
  cd ../front && npm run build
  cd ../back && npm run build
fi

echo "Building for amd64"
./amd64.sh

echo "Building for arm64"
./arm64.sh
