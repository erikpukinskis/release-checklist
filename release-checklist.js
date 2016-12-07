var library = require("module-library")(require)


module.exports = library.export(
  "release-checklist",
  function() {
    var lists = {}

    function releaseChecklist(story, id) {

      var list = {
        id: id,
        story: story,
        tasks: []
      }

      if (!list.id) { assignId(list) }

      lists[id] = list
      return list
    }

    releaseChecklist.get = function(id) {
      return lists[id]
    }

    releaseChecklist.addTask = function(ref, task) {
      if (!ref) {
        throw new Error("No ref!")
      }

      if (typeof ref == "string") {
        var list = lists[ref]
      } else {
        var list = ref
      }

      list.tasks.push(task)
    }

    function assignId(list) {
      do {
        var id = Math.random().toString(36).split(".")[1]
      } while(lists[id])

      list.id = id
    }
    
    return releaseChecklist
  }
)

