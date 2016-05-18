#!/bin/bash
# Process prod build

#build minified files
gulp build

printf "Build Complete. Continue with pull? (if !errors) Y or N: "
read PULL

#pull 
if [ "$PULL" = "Y" ]; then
	git pull
	git branch
	printf "Pull Complete. Continue with commit? (if !errors && correct branch) Y or N: "
	read COMMIT
else
	echo "Build aborted"
	exit
fi

if [ "$COMMIT" = "Y" ]; then
	git commit -a 

	printf "Commit complete. Push? (if !errors) Y or N: "
	read PUSH

else
	echo "Build complete, commit manually."
	exit
fi

if [ "$PUSH" = "Y" ]; then
	git push

	printf "Push complete. Restart Dev Server? (if !conflicts) Y or N: "
	read DEV
else 
	echo "Commit complete, push manually."
	exit
fi

if [ "$DEV" = "Y" ]; then
	gulp watch
	exit
fi




