#!/bin/bash -e

MESA_VERSION="10.1.0"

MESA_DIRNAME="Mesa-$MESA_VERSION"
MESA_FILENAME="MesaLib-$MESA_VERSION.tar.bz2"
MESA_URL="ftp://ftp.freedesktop.org/pub/mesa/current/MesaLib-$MESA_VERSION.tar.bz2"

if [[ ! -d "$MESA_DIRNAME" ]]
then

	if [[ ! -f "$MESA_FILENAME" ]]
	then
		curl -o "$MESA_FILENAME" "$MESA_URL"
	fi

	tar jxf "$MESA_FILENAME"
fi

pushd "$MESA_DIRNAME"
autoreconf -v --install
popd
