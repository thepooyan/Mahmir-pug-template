# Mahmir pug template
is a template, created to make the proccess of developing static HTML/SASS websites easier.
it helps you render html components (written in pug) in a nested way, so you can develop static sites, componental, like react!
so you might say it's a kind of router, built on top of pug, with a compiler that is watching your files for changes so you can see the result of your work as fast as possible!

## getting started
1. first clone this repository in your own system
2. then, install the required dependencies, using this comman: `npm install`
3. you need to install `sass` and `live-server` globally, so run `npm install -g sass` and `npm istall -g live-server`

that's it! now just open the project in your favorite editor, start the compiler script (start.bat for windows and start.sh for linux)

create your new pages in the `pages` folder, and write some pug code!

## nested routes:
to create nested routes:
1. create a page in the pages folder (a .pug file)
2. create a folder with the same name right next to it so there will be a folder for each page that you want to use nested
3. inside that folder, there must be an `index.pug` file. which is the defualt child of that component. (it can also be empty)
4. for each of the cildern, create a file inside the folder.

### now for adding the placeholder in the page file:
after the the folder and childern are created, inside the page add the following line:
> include childern
this line will act like a placohoder to render the childern inside itself

### refrencing a page's childern in href
in the page file, you can add an anchor tag with the `>` character, and then name the child you want to refrence to.
syntax will look like this:
```pug
a(href=">index") goto the index child!
```
use the index keyword or the name of the child-file you created

## router options
there is a variable `#{currentPage}`. whenever used inside a page file, it will return the name of the child that is currently being renderd on the page.
