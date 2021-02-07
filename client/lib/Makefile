%.min.js : %.js
	echo "lib/$@: JS compression"
	yui-compressor --verbose --line-break 70 --charset UTF-8 -o $@ $<

all: \
	skiniko.min.js \
	panel.min.js \
	selida.min.js
