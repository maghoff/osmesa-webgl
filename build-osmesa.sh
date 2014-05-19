#!/bin/bash -e

CORES=1

if [[ -f /proc/cpuinfo ]]
then
	CORES=$(awk '/^processor/ {++n} END {print n}' /proc/cpuinfo)
fi

if which sysctl >/dev/null
then
	CORES=$(sysctl -n hw.ncpu 2>/dev/null || echo $CORES)
fi

pushd Mesa-10.1.0
./configure --enable-gallium-osmesa --disable-egl --disable-driglx-direct --disable-dri --with-gallium-drivers=swrast --enable-gallium-llvm
make -j $CORES
popd
