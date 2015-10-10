/*
 * gh-js
 * simple GitHub API v3 wrapper in Javascript
 * 
 * ohnx was here (2015)
 */

/*
 * enum declarations
 */
// SORT_METHOD 
var SORT_METHOD = {
    RECENT : 0,
    STARS : 1,
    RANDOM : 2
};

/*
 * object declarations
 */
// GHtime object
function GHtime(create, update) {
    this.create_time = create;  // Create time
    this.update_time = update;  // Update time
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
    this.filled_gists = false;  // Were gists filled?
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
    this.watchers = 0;          // Watchers
    this.stars = 0;             // # of stars
    this.forks = 0;             // # of forks
    this.issues = 0;            // # of issues
    this.filled = false;        // Was basic info filled?
    this.filled_full = false;   // Was everything (including watchers) filled?
}

// GHgistfile object
function GHgistfile(filename) {
    this.name = filename;       // Filename
    this.type = null;           // MIME type
    this.lang = null;           // Language
    this.url = null;            // raw URL
}

// GHgist object
function GHgist(id) {
    this.id = id;               // Gist ID
    this.url = null;            // URL to gist
    this.files = null;          // Array of files
    this.time = null;           // Update & create time
    this.description = null;    // Description
    this.owner = null;          // Owner name
    this.filled = false;        // Was basic info filled?
}

/*
 * prototypes declarations
 */
// Shuffle the elements in an array
// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
// http://bost.ocks.org/mike/shuffle/
Array.prototype.shuffle = function() {
  var m = this.length, t, i;
  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);
    // And swap it with the current element.
    t = this[m];
    this[m] = this[i];
    this[i] = t;
  }
};

// GHuser fill in user info
GHuser.prototype.fill = function(callback) {
    var xmlhttp = new XMLHttpRequest();
    var self = this;
    if(callback == null) {
        callback = function () {};
    }
    // callback function
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            var jresp = JSON.parse(xmlhttp.responseText);
            self.profile_pic = jresp.avatar_url;// profile picture
            self.id = jresp.id;                 // ID
            self.site = jresp.blog;             // link to blog
            self.loc = jresp.location;          // Location
            self.name = jresp.name;             // Name
            self.email = jresp.email;           // Email
            self.followers = jresp.followers;   // Followers
            self.following = jresp.following;   // Following
            self.time = new GHtime(jresp.created_at, jresp.updated_at);
            self.filled = true;
            callback();
        }
    };
    // send HTTP request async
    xmlhttp.open("GET", "https://api.github.com/users/"+this.username, true);
    xmlhttp.send();
};

// GHuser fill repo info
GHuser.prototype.fill_repos = function(callback) {
    var xmlhttp = new XMLHttpRequest();
    var self = this;
    if(callback == null) {
        callback = function () {};
    }
    // callback function
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            var jresp = JSON.parse(xmlhttp.responseText);
            self.repos = new Array(jresp.length);
            for(var i = 0; i < jresp.length; i++) {
                self.repos[i] = new GHrepo(jresp[i].full_name);         // Full name of repo
                self.repos[i].owner = jresp[i].owner.login;             // Repo owner
                self.repos[i].desc = jresp[i].description;              // Repo description
                self.repos[i].url = jresp[i].html_url;                  // URL to go to repository
                // I have no idea what updated_at is, but it sure ain't the last time the code was changed.
                self.repos[i].time = new GHtime(jresp[i].created_at, jresp[i].pushed_at);
                self.repos[i].is_fork = jresp[i].fork;                  // Is the repo a fork?
                self.repos[i].lang = jresp[i].language;                 // Repo language
                // Watchers count is not given in a user's repo list.
                // The Github API returns a tag named "watchers", as well as "watchers_count" and "stargazers_count"
                // These are all the same thing (# of people who starred the repo)
                // The only place where the actual amount of watchers is returned is in a direct repo call (ie, /repos/user/repo)
                // In those calls, the watcher count is returned with the tag "subscribers_count".
                self.repos[i].stars = jresp[i].stargazers_count;        // # of stars
                self.repos[i].forks = jresp[i].forks;                   // # of forks
                self.repos[i].issues = jresp[i].open_issues_count;      // # of issues
                self.repos[i].filled = true;                            // Filled basic info
            }
            self.filled_repos = true;
            callback();
        }
    };
    // send HTTP request async
    xmlhttp.open("GET", "https://api.github.com/users/"+this.username+"/repos", true);
    xmlhttp.send();
};

// GHuser fill in gist info
GHuser.prototype.fill_gists = function(callback) {
    var xmlhttp = new XMLHttpRequest();
    var self = this;
    if(callback == null) {
        callback = function () {};
    }
    // callback function
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            var jresp = JSON.parse(xmlhttp.responseText);
            self.gists = new Array(jresp.length);
            for(var i = 0; i < jresp.length; i++) {
                self.gists[i] = new GHgist(jresp[i].id);            // Gist ID
                self.gists[i].url = jresp[i].html_url;              // URL to gist
                self.gists[i].files = make_gf_array(jresp[i].files);// Array of files
                self.gists[i].time = new GHtime(jresp[i].created_at, jresp[i].updated_at);
                self.gists[i].description = jresp[i].description;   // Description
                self.gists[i].owner = jresp[i].owner.login;         // Owner name
                self.gists[i].filled = true;                        // Was basic info filled?
            }
            self.filled_gists = true;
            callback();
        }
    };
    // send HTTP request async
    xmlhttp.open("GET", "https://api.github.com/users/"+this.username+"/gists", true);
    xmlhttp.send();
};

// GHuser list repos
GHuser.prototype.list_repos = function(count, sortMethod) {
    var repos2 = this.repos;
    var sort_func;
    // Check if we're trying to get too many, if we are, then just return max amount
    if(count > this.repos.length) count = this.repos.length;
    // Check if specified sort method is either RANDOM, RECENT or STARS (popular)
    if(sortMethod == SORT_METHOD.RANDOM) {
        repos2.shuffle();
    } else if(sortMethod == SORT_METHOD.RECENT) {
        // check if update times are sooner/later
        sort_func = function (a, b) {
            if (a.time.update_time > b.time.update_time) {
                return -1;
            } else if (a.time.update_time < b.time.update_time) {
                return 1;
            }
            return 0;
        };
        repos2.sort(sort_func);
    } else if(sortMethod == SORT_METHOD.STARS) {
        // check if update times are sooner/later
        sort_func = function (a, b) {
            if (a.stars > b.stars) {
                return -1;
            } else if (a.stars < b.stars) {
                return 1;
            }
            return 0;
        };
        repos2.sort(sort_func);
    } else {
        return;
    }
    return repos2.slice(0, count);
};

// GHrepo fill info
GHrepo.prototype.fill = function(callback) {
    var xmlhttp = new XMLHttpRequest();
    var self = this;
    if(callback == null) {
        callback = function () {};
    }
    // callback function
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            var jresp = JSON.parse(xmlhttp.responseText);
            self.owner = jresp.owner.login;             // Repo owner
            self.desc = jresp.description;              // Repo description
            self.url = jresp.html_url;                  // URL to go to repository
            // I have no idea what updated_at is, but it sure as 4311 ain't the last time the code was changed.
            self.time = new GHtime(jresp.created_at, jresp.pushed_at);
            self.is_fork = jresp.fork;                  // Is the repo a fork?
            self.lang = jresp.language;                 // Repo language
            self.watchers = jresp.subscribers_count;    // Watchers
            self.stars = jresp.stargazers_count;        // # of stars
            self.forks = jresp.forks;                   // # of forks
            self.issues = jresp.open_issues_count;      // # of issues
            self.filled = true;                         // Filled basic info
            self.filled_full = true;                    // Filled watchers
            callback();
        }
    };
    // send HTTP request async
    xmlhttp.open("GET", "https://api.github.com/repos/"+this.name, true);
    xmlhttp.send();
};

/*
 * misc function declarations
 */
// Why on earth is this function needed?
// Well, GitHub returns an Object instead of an Array for the files in a gist.
// This function unwraps that object to create an array instead.
// It also converts the objects to a custom type gistfile while its at it.
function make_gf_array(gfobj) {
    var gf_array = new Array();
    for (var i in gfobj) {
        if (!gfobj.hasOwnProperty(i)) break;
        // get the actual value of i, not just the key value
        i = gfobj[i];
        var gf_temp = new GHgistfile(i.filename);
        gf_temp.type = i.type;          // MIME type
        gf_temp.lang = i.language;      // Language
        gf_temp.url = i.raw_url;        // URL
        gf_array.push(gf_temp);
    }
    return gf_array;
}