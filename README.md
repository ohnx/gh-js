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
<script src="//cdn.rawgit.com/ohnx/gh-js/cb349ac4645030f5cb14365f580d5a1a089fe8e3/gh.js"></script>
```

As long as a modern-ish browser is being used and JavaScript is enabled, everything should work.

## how do I use gh-js?

Now that you've got gh-js, you probably want to use it. Luckily, it (in my opinion (which might not be worth too much)) isn't too difficult to understand.

Please check out the file `docs.md` for the documentation.

## contributing
Please feel free to do so.

## todo
 - [ ] Gist support (anonymous new)
 - [ ] events for a user

## legal stuff

Most of my stuff is MIT licensed (because MIT is cool \\(^.^)/ )
This is no exception.


This README is almost longer than all the code...
