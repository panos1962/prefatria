%.min.js : %.js
	echo "common/$@: JS compression"
	yui-compressor --verbose --line-break 70 --charset UTF-8 -o $@ $<

all: \
	energia.min.js \
	kinisi.min.js \
	partida.min.js \
	prefadoros.min.js \
	skiniko.min.js
