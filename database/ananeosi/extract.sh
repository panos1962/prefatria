#!/usr/bin/env bash

data_files="pektis.data peparam.data profinfo.data sxesi.data isfora.data"

mysql -u prefadoros -p <extract.sql || exit 2

cd /tmp
tar czf data.tar.gz ${data_files} || exit 2
