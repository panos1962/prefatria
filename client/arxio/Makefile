%.min.js : %.js
	echo "Arena/$@: JS compression"
	yui-compressor --verbose --line-break 70 --charset UTF-8 -o $@ $<

all: \
	arxio.min.js
