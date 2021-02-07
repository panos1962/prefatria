all:
	@(cd client/common && make -s)
	@(cd client/lib && make -s)
	@(cd client/arena && make -s)
	@(cd client/arxio && make -s)
	@(cd client/movie && make -s)

status:
	hg status

diff:
	hg diff

pull:
	hg pull --update

commit:
	hg commit -m "modifications"

push:
	hg push

check:
	@find . -name '*.min.js' -type f -print

cleanup:
	@find . -name '*.min.js' -type f -print -exec rm {} \;
