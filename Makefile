all:
	@(cd client/common && make -s)
	@(cd client/lib && make -s)
	@(cd client/arena && make -s)
	@(cd client/arxio && make -s)
	@(cd client/movie && make -s)

status:
	git status

diff:
	git diff

pull:
	git pull

commit:
	git commit -m "modifications" .

push:
	git push

check:
	@find . -name '*.min.js' -type f -print

cleanup:
	@find . -name '*.min.js' -type f -print -exec rm {} \;
