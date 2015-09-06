# gh-js

First off, if you're looking for actually good libraries in Javascript (or any other languages, for that matter), please visit [here](https://developer.github.com/libraries/#javascript).

Those wrappers are probably a lot better than mine will ever be.
However, if you're looking for a simple client-side interface that won't give you too many nightmares and doesn't depend on any large libraries, free free to use this.

Now that that's over with, here's the rest of the readme.

## what is gh-js?

gh-js is a simple wrapper for the GitHub API.

It allows you to get information on a user, that user's repos, and a bit more.

It can't edit files or do any fancy shenanigans like that. If you want to do that, please use one of the libraries [here](https://developer.github.com/libraries/#javascript).

Sample usage cases would be showing off your top 3 starred repositories, 5 most recently updated repositories, or having a sort of "contact card" based on your Github profile.

## how do I get gh-js?

Just put a script tag in your HTML file, like this:
```html
<script src="//cdn.rawgit.com/ohnx/gh-js/872304e3a7674317f1be489785fa63fe1afe2d26/gh.js" />
```

As long as a modern browser is being used and JavaScript is enabled, everything should be good.

done! no nightmares! :)

## how do I use gh-js?

Now that you've got gh-js, you probably want to use it. Luckily, it (in my opinion (which might not be worth too much)) isn't too difficult to understand.

There are 3 objects that gh-js uses:
 - GHtime object (Stores 2 timestamps that are common between GHrepo and GHuser)
 - GHuser object (Stores info about a user)
 - GHrepo object (Stores info about a repo)

Function calls in gh-js are all part of the last two objects.

To start off with, you probably want to create a GHuser object:
```js
var user = new GHuser("octocat");
```
You will need to pass your username.

Afterwards, fill in all the information!
```js
var callback = function () { alert("done!"); };
user.fill(callback);
```
You can specify a callback if you want, as this is a network operation.
In the callback, you can modify the page to show off your information, ie:
```js
var callback = function () {
    var elem = document.getElementById("about");
    // Profile picture
    elem.innerHTML += "<img src=\"" + user.profile_pic + "\" />\n";
    // Name
    elem.innerHTML += "<h1>" + user.name + "</h1>\n";
    // Username
    elem.innerHTML += "<h2>" + user.username + "</h2>\n";
};
```
If you also want to get information on the repositories of a user, you're going to have to run another function:
```js
var callback_repo = function () { alert("done!"); };
user.fill_repos(callback_repo);
```
As with all network operations, a callback can be specified.

Once the repositories of a user have been filled, you can call a very cool function called `list_repos`.

`list_repos` takes 2 arguments:

1. the number of repos to list (or some crazy high number to list them all)
2. the sort method (either `SORT_METHOD.RANDOM`, `SORT_METHOD.STARS`, or `SORT_METHOD.RECENT`)

It returns an array of the GHrepo objects.

For example, if I wanted to get the names of the 5 most recently updated repositories, I could set the `fill_repos` callback to be the following:
```js
var callback_repo = function () {
    var elem = document.getElementById("repos");
    elem.innerHTML += "<ul>\n";
    var repos = user.list_repos(5, SORT_METHOD.RECENT);
    for(var i = 0; i < repos.length; i++) {
        elem.innerHTML += "<li>" + repos[i].name + "</li>\n";
    }
    elem.innerHTML += "</ul>\n";
};
```

If you want to get specific information on a repository (or if you want to know how many watchers a repo has), use the GHrepo object directly:
```js
var bs = new GHrepo("twbs/bootstrap");
```
Afterwards, fill it with information:
```js
var callback = function () { alert("hi"); };
bs.fill(callback);
```

## documentation

When in doubt, check the Java(Script)Doc!

Here's the objects and their property names (and comments describing what they are):
```js
// GHtime object
function GHtime(create, update) {
    this.create_time = create;
    this.update_time = update;
}

// GHuser object
function GHuser(username) {
    this.username = username;   // Username
    this.id = 0;                // ID
    this.profile_pic = null;    // profile picture
    this.site = null;           // link to blog
    this.loc = null;            // Location
    this.name = null;           // Name
    this.email = null;          // Email
    this.followers = 0;         // Followers
    this.following = 0;         // Following
    this.time = null;           // Update & create time
    this.filled = false;        // Was info filled?
    this.filled_repos = false;  // Were repos filled?
    // Note - after this.fill_repos() is called, another attribute named "repos" of type "Array" is added.
}

// GHrepo object
function GHrepo(fullname) {
    this.name = fullname;       // Full name of repo
    this.owner = null;          // Repo owner
    this.desc = null;           // Repo description
    this.url = null;            // URL to go to repository
    this.time = null;           // Update & create time 
    this.is_fork = null;        // Is the repo a fork?
    this.lang = null;           // Repo language
    // Note - In order to get the number of watchers, you will have to explicitly call this.fill()
    //        as the GitHub API doesn't actually return the number of watchers for some strange reason
    //        see my paragraph in "GHuser.prototype.fill_repos" for more info
    this.watchers = 0;          // Watchers
    this.stars = 0;             // # of stars
    this.forks = 0;             // # of forks
    this.issues = 0;            // # of issues
    this.filled = false;        // Was basic info filled?
    this.filled_full = false;   // Was everything (including watchers) filled?
}
```

Here are the functions (with comments describing what they do):
```js
// GHuser fill in user info
// Network operation, so there is a callback.
GHuser.prototype.fill = function(callback);

// GHuser fill in repo info
// Network operation, so there is a callback.
GHuser.prototype.fill_repos = function(callback);

// GHuser list repos
// Pass a maximum number of repositories to return (will return all repositories if max > # of repos user has)
// The sortMethod can be any one of the following values: SORT_METHOD.RECENT, SORT_METHOD.STARS, SORT_METHOD.RANDOM
GHuser.prototype.list_repos = function(count, sortMethod);

// GHrepo fill info
// Network operation, so there is a callback.
GHrepo.prototype.fill = function(callback);
```

Overall, the code \*should\* be (semi) commented. If you have any more issues, please feel free to poke through the code.

## contributing
Please feel free to do so.

## legal stuff

Most of my stuff is MIT licensed (because MIT is cool \\(^.^)/ )
This is no exception.


This README is almost longer than all the code...
