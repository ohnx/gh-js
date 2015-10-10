# gh-js

## what is gh-js?

gh-js is a simple wrapper for the GitHub API.

It allows you to get information on a user, that user's repos, gists, and a bit more. The goal of gh-js is to be nightmare-free and have no dependencies (other than JavaScript, a functioning internet connection, and a modern browser).

It can't edit files or do any fancy shenanigans that require logging in. If you want to do that, please use one of the libraries [here](https://developer.github.com/libraries/#javascript).

Sample usage cases would be showing off your top 3 starred repositories, 5 most recently updated repositories, or having a sort of "contact card" based on your Github profile.

I personally use it on my site to list the most recent repositories I've worked on.

## how do I get gh-js?

Just put a script tag in your HTML file, like this:
```html
<script src="//cdn.rawgit.com/ohnx/gh-js/192e6dfe5f8af650b941d88756940ec1a40c1874/gh.js"></script>
```

As long as a modern-ish browser is being used and JavaScript is enabled, everything should work.

## how do I use gh-js?

Now that you've got gh-js, you probably want to use it. Luckily, it (in my opinion (which might not be worth too much)) isn't too difficult to understand.

To start off with, you probably want to create a GHuser object:
```js
var user = new GHuser("octocat");
```
You will need to pass your username.

Afterwards, `fill` in all the information!
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
If you also want to get information on the repositories of a user, you're going to have to run another function 
`fill_repos`:
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

For more help, please visit [`docs.md`](https://github.com/ohnx/gh-js/blob/master/docs.md).

## contributing
Please feel free to do so.

## todo
 - [ ] Gist support (anonymous new)
 - [ ] events for a user

## legal stuff

Most of my stuff is MIT licensed (because MIT is cool \\(^.^)/ )
This is no exception.
