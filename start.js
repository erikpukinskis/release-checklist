var library = require("module-library")(require)

library.using(
  ["./", "web-site"],
  function(releaseChecklist, WebSite) {
    WebSite.provision(releaseChecklist.bootServer)
    WebSite.megaBoot()
  }
)
