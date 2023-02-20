## THIS IS README FOR THE API PART

You need the api for frontend functionality

There are currently two ways to run the api:

- run docker image (all dependencies will install themselves)
- run straight up form shell (you need to install dependencies manually)

### to run docker image:

when in dir
`docker build . -t <YOURTAG>`

running the image:

`docker run <YOURTAG> -p 8000:<YOURPORT>`

now api is listening at port 8000 in the container,
you can translate the port to your liking by changing `<OUTSIDEPORT>`

`<YOURPORT>` has to be provided to the frontend with the link localhost:`<YOURPORT>`

congrats your api is probably running

frontend is in the `frontend` folder



  


