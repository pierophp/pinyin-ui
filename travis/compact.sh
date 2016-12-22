rm secrets.tar.enc
tar cvf secrets.tar *  --exclude="secrets.tar" --exclude="compact.sh"
travis encrypt-file secrets.tar
